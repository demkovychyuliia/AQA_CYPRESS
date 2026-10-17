const auth = require('../../env/auth.json');

const Header = require('../pages/Header');
const AuthPage = require('../pages/AuthPage');
const GaragePage = require('../pages/GaragePage');
const ExpensesPage = require('../pages/ExpensesPage');

const { generateCarData } = require('../support/testData');

describe('Garage and fuel expenses API testing', () => {
  const header = new Header();
  const authPage = new AuthPage();
  const garagePage = new GaragePage();
  const expensesPage = new ExpensesPage();

  beforeEach(() => {
    cy.visit('/', {
      auth: {
        username: auth.username,
        password: auth.password,
      },
    });

    header.getSignInButton()
      .should('be.visible')
      .should('have.length', 1)
      .click();

    authPage.getEmailInput().should('be.visible');

    cy.env(['email', 'password']).then(({ email, password }) => {
      authPage.login(email, password);
    });
  });

  it('should create a car via UI, verify it via API, create an expense via API and verify it in UI', () => {
    cy.fixture('carData.json').then((fixtureData) => {
      const carData = generateCarData(fixtureData);

      // 1. Intercept the car creation request.
      cy.intercept('POST', '**/api/cars').as('createCar');

      // 2. Create a car through the UI.
      garagePage.addCar(carData);

      // 3. Validate the response and save the created car ID.
      cy.wait('@createCar').then(({ response }) => {
        expect(response, 'car creation response').to.exist;
        expect(response.statusCode).to.equal(201);
        expect(response.body.status).to.equal('ok');

        expect(response.body.data.id).to.be.a('number');
        expect(response.body.data.brand).to.equal(carData.brand);
        expect(response.body.data.model).to.equal(carData.model);
        expect(response.body.data.initialMileage)
          .to.equal(carData.initialMileage);

        cy.wrap(response.body.data.id).as('createdCarId');
      });

      // 4. Verify the created car through the API.
      cy.get('@createdCarId').then((carId) => {
        cy.request('GET', '/api/cars').then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.status).to.equal('ok');

          const cars = response.body.data;
          expect(cars, 'cars API response data').to.be.an('array');

          const createdCar = cars.find((car) => car.id === carId);

          expect(createdCar, 'created car in API response').to.exist;
          expect(createdCar.id).to.equal(carId);
          expect(createdCar.brand).to.equal(carData.brand);
          expect(createdCar.model).to.equal(carData.model);
          expect(createdCar.initialMileage)
            .to.equal(carData.initialMileage);

          // 5. Prepare the expense data.
          const expenseData = {
            carId,
            reportedAt: new Date().toISOString().slice(0, 10),
            mileage: carData.expenseMileage,
            liters: carData.fuelLiters,
            totalCost: carData.fuelTotalCost,
          };

          // 6. Create an expense through the custom API command.
          cy.createExpenseViaApi(expenseData).then((createdExpense) => {
            expect(createdExpense.id).to.be.a('number');
            expect(createdExpense.carId).to.equal(carId);

            // 7. Open Expenses and open the expense form.
            expensesPage.openExpenses();
            expensesPage.openAddExpenseModal();

            // 8. Find the option by the actual car ID.
            expensesPage.getExpenseCarSelect()
              .should('be.visible')
              .find('option')
              .then(($options) => {
                const matchingOption = [...$options].find((option) => {
                  return option.value.endsWith(`: ${carId}`);
                });

                expect(
                  matchingOption,
                  `option for car ID ${carId}`
                ).to.exist;

                // Select the exact option value, including its index prefix.
                expensesPage.getExpenseCarSelect()
                  .select(matchingOption.value);
              });

            // 9. Close the modal without creating a duplicate expense.
            expensesPage.closeAddExpenseModal();

            // 10. Verify the expense created through API in the UI.
            expensesPage.verifyExpenseInTable({
              expenseMileage: createdExpense.mileage,
              fuelLiters: createdExpense.liters,
              fuelTotalCost: createdExpense.totalCost,
            });
          });
        });
      });
    });
  });
});
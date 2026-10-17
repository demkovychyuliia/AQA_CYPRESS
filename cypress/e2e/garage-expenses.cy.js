const auth = require('../../env/auth.json');

const Header = require('../pages/Header');
const AuthPage = require('../pages/AuthPage');
const GaragePage = require('../pages/GaragePage');
const ExpensesPage = require('../pages/ExpensesPage');

const { generateCarData } = require('../support/testData');

describe('Garage and fuel expenses', () => {
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

  it('should add a car and fuel expenses to it', () => {
    cy.fixture('carData.json').then((fixtureData) => {
      const carData = generateCarData(fixtureData);

      // 1. Create a car in Garage.
      garagePage.addCar(carData);

      // 2. Open Fuel expenses.
      expensesPage.openExpenses();

      // 3. Verify the default car selected on the page.
      expensesPage.getCarSelectDropdown()
        .should('be.visible')
        .should('contain.text', carData.carName);

      // 4. Open the Add an expense modal.
      expensesPage.openAddExpenseModal();

      // 5. Verify the default car selected in the form.
      expensesPage.getExpenseCarSelect()
        .find('option:selected')
        .should('have.text', carData.carName);

      // 6. Fill in and submit the expense form.
      expensesPage.fillExpenseForm(carData);
      expensesPage.submitExpenseForm();

      // 7. Verify that the modal closes after saving.
      cy.get('body')
        .find('#addExpenseCar')
        .should('not.exist');

      // 8. Verify that the expense is displayed in the table.
      expensesPage.getExpensesTable().should('be.visible');

      expensesPage.getExpenseRows().should(($rows) => {
        const expectedMileage = String(carData.expenseMileage);
        const expectedLiters = `${carData.fuelLiters}L`;
        const expectedCost = Number(carData.fuelTotalCost);

        const matchingRow = [...$rows].find((row) => {
          const cells = [...row.querySelectorAll('td')].map((cell) =>
            cell.innerText.trim()
          );

          if (cells.length < 4) {
            return false;
          }

          const actualCost = Number.parseFloat(
            cells[3].replace(/[^\d.]/g, '')
          );

          return (
            cells[1] === expectedMileage &&
            cells[2] === expectedLiters &&
            actualCost === expectedCost
          );
        });

        expect(
          matchingRow,
          'expense row with expected mileage, liters and cost'
        ).to.exist;
      });
    });
  });
});
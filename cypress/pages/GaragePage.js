class GaragePage {
  getAddCarButton() {
    return cy.get('.panel-page_heading .btn.btn-primary');
  }

  getAddCarModal() {
    return cy.get('.modal-content').filter(':has(#addCarBrand)');
  }

  getCarBrandSelect() {
    return cy.get('#addCarBrand');
  }

  getCarModelSelect() {
    return cy.get('#addCarModel');
  }

  getCarMileageInput() {
    return cy.get('#addCarMileage');
  }

  getAddCarSubmitButton() {
    return this.getAddCarModal().contains('button', 'Add');
  }

  getCarItems() {
    return cy.get('.car-list .car-item');
  }

  getCarName() {
    return cy.get('.car_name');
  }

  openGarage() {
    cy.url().should('include', '/panel/garage');
  }

  openAddCarModal() {
    this.getAddCarButton()
      .should('be.visible')
      .click();

    this.getAddCarModal().should('be.visible');
  }

  fillCarForm(brand, model, mileage) {
    this.getCarBrandSelect()
      .should('be.visible')
      .select(brand);

    this.getCarModelSelect()
      .should('be.visible')
      .should('be.enabled')
      .find('option')
      .should(($options) => {
        const availableModels = [...$options].map((option) =>
          option.textContent.trim()
        );

        expect(
          availableModels,
          `Models available for ${brand}`
        ).to.include(model);
      });

    this.getCarModelSelect()
      .select(model)
      .find('option:selected')
      .should('have.text', model);

    this.getCarMileageInput()
      .should('be.visible')
      .clear()
      .type(String(mileage));
  }

  submitCarForm() {
    this.getAddCarSubmitButton()
      .should('be.enabled')
      .click();
  }

  addCar(carData) {
    this.openGarage();
    this.openAddCarModal();

    this.fillCarForm(
      carData.brand,
      carData.model,
      carData.initialMileage
    );

    this.submitCarForm();

    this.getCarItems().should(($items) => {
      const newCar = [...$items].find((item) => {
        const $item = Cypress.$(item);

        return (
          $item.find('.car_name').text().trim() ===
            `${carData.brand} ${carData.model}` &&
          Number(
            $item.find('.update-mileage-form_input').val()
          ) === carData.initialMileage
        );
      });

      expect(
        newCar,
        'new car card with expected name and mileage'
      ).to.exist;
    });
  }
}

module.exports = GaragePage;
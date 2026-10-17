class ExpensesPage {
  getExpensesLink() {
    return cy.get('.sidebar a[href="/panel/expenses"]');
  }

  getAddExpenseButton() {
    return cy.get('.panel-page_heading .btn.btn-primary');
  }

  getCarSelectDropdown() {
    return cy.get('#carSelectDropdown');
  }

  getAddExpenseModal() {
    return cy.get('.modal-content').filter(':has(#addExpenseCar)');
  }

  getExpenseCarSelect() {
    return cy.get('#addExpenseCar');
  }

  getExpenseDateInput() {
    return cy.get('#addExpenseDate');
  }

  getExpenseMileageInput() {
    return cy.get('#addExpenseMileage');
  }

  getExpenseLitersInput() {
    return cy.get('#addExpenseLiters');
  }

  getExpenseTotalCostInput() {
    return cy.get('#addExpenseTotalCost');
  }

  getAddExpenseSubmitButton() {
    return this.getAddExpenseModal().contains('button', 'Add');
  }

  getExpensesTable() {
    return cy.get('.expenses_table');
  }

  getExpenseRows() {
    return cy.get('.expenses_table tbody tr');
  }

  openExpenses() {
    this.getExpensesLink().click();
    cy.url().should('include', '/panel/expenses');
  }

  openAddExpenseModal() {
    this.getAddExpenseButton()
      .should('be.visible')
      .click();

    this.getAddExpenseModal().should('be.visible');
  }

  closeAddExpenseModal() {
    this.getAddExpenseModal()
      .contains('button', 'Cancel')
      .should('be.visible')
      .click();

    cy.get('body')
      .find('#addExpenseCar')
      .should('not.exist');
  }

  fillExpenseForm(expenseData) {
    this.getExpenseCarSelect()
      .find('option:selected')
      .should('have.text', expenseData.carName);

    this.getExpenseMileageInput()
      .should('be.visible')
      .clear()
      .type(String(expenseData.expenseMileage));

    this.getExpenseLitersInput()
      .should('be.visible')
      .clear()
      .type(String(expenseData.fuelLiters));

    this.getExpenseTotalCostInput()
      .should('be.visible')
      .clear()
      .type(String(expenseData.fuelTotalCost));
  }

  submitExpenseForm() {
    this.getAddExpenseSubmitButton()
      .should('be.visible')
      .should('be.enabled')
      .click();
  }

  verifyExpenseInTable(expenseData) {
    this.getExpensesTable().should('be.visible');

    this.getExpenseRows().should(($rows) => {
      const expectedDate = expenseData.reportedAt
        ? expenseData.reportedAt.split('-').reverse().join('.')
        : null;

      const expectedMileage = String(expenseData.expenseMileage);
      const expectedLiters = `${expenseData.fuelLiters}L`;
      const expectedCost = Number(expenseData.fuelTotalCost);

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
          (!expectedDate || cells[0] === expectedDate) &&
          cells[1] === expectedMileage &&
          cells[2] === expectedLiters &&
          actualCost === expectedCost
        );
      });

      expect(
        matchingRow,
        'expense row with expected date, mileage, liters and cost'
      ).to.exist;
    });
  }

  addExpense(expenseData) {
    this.openExpenses();

    this.getCarSelectDropdown()
      .should('be.visible')
      .should('contain.text', expenseData.carName);

    this.openAddExpenseModal();
    this.fillExpenseForm(expenseData);
    this.submitExpenseForm();

    cy.get('body')
      .find('#addExpenseCar')
      .should('not.exist');

    this.verifyExpenseInTable(expenseData);
  }
}

module.exports = ExpensesPage;
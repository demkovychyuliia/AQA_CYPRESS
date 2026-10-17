Cypress.Commands.add('createExpenseViaApi', (expenseData) => {
  return cy.request({
    method: 'POST',
    url: '/api/expenses',
    body: {
      carId: expenseData.carId,
      reportedAt: expenseData.reportedAt,
      mileage: expenseData.mileage,
      liters: expenseData.liters,
      totalCost: expenseData.totalCost,
      forceMileage: false,
    },    
  }).then((response) => {
    expect(response.status, 'create expense status').to.equal(200);
    expect(response.body.status).to.equal('ok');

    expect(response.body.data).to.include({
      carId: expenseData.carId,
      reportedAt: expenseData.reportedAt,
      mileage: expenseData.mileage,
      liters: expenseData.liters,
      totalCost: expenseData.totalCost,
    });

    expect(response.body.data.id).to.be.a('number');

    return response.body.data;
  });
});
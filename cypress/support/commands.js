Cypress.Commands.add('login', (email, password) => {
  cy.contains('button', 'Sign In').click();

  cy.get('#signinEmail').type(email);
  cy.get('#signinPassword').type(password, { sensitive: true });

  cy.contains('button', 'Login').click();
});

Cypress.Commands.overwrite('type', (originalFn, element, text, options = {}) => {
  if (options.sensitive) {
    options = { ...options, log: false };

    Cypress.log({
      $el: element,
      name: 'type',
      message: '*'.repeat(text.length),
    });
  }

  return originalFn(element, text, options);
});
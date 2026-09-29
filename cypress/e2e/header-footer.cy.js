const auth = require('../../env/auth.json');

describe('Header, Contacts and Footer', () => {
  it('should find all header elements', () => {
    cy.visit('/', {
      auth: {
        username: auth.username,
        password: auth.password,
      },
    });

    cy.get('header').within(() => {

      cy.get('a.header_logo').should('be.visible');
      cy.get('a.header-link').contains('Home').should('be.visible');
      cy.get('button.header-link').contains('About').should('be.visible');
      cy.get('button.header-link').contains('Contacts').should('be.visible');
      cy.get('button.-guest').contains('Guest log in').should('be.visible');
      cy.get('button.header_signin').contains('Sign In').should('exist');  


    });

  });

});



const auth = require('../../env/auth.json');

describe('Header, Contacts and Footer', () => {
  beforeEach(() => {
    cy.visit('/', {
      auth: {
        username: auth.username,
        password: auth.password,
      },
    });
  });

  it('should find all header elements', () => {
    cy.get('header').within(() => {
      cy.get('a.header_logo').should('be.visible');
      cy.get('a.header-link').contains('Home').should('be.visible');
      cy.get('button.header-link').contains('About').should('be.visible');
      cy.get('button.header-link').contains('Contacts').should('be.visible');
      cy.get('button.-guest').contains('Guest log in').should('be.visible');
      cy.get('button.header_signin').contains('Sign In').should('be.visible');
    });
  });

  it('should find all contacts links', () => {
    cy.get('#contactsSection').within(() => {
      cy.contains('h2', 'Contacts').should('be.visible');

      cy.get('a.socials_link').should('have.length', 5);

      cy.get('a.socials_link:has(.icon-facebook)')
        .should('be.visible')
        .and('have.attr', 'href', 'https://www.facebook.com/Hillel.IT.School');

      cy.get('a.socials_link:has(.icon-telegram)')
        .should('be.visible')
        .and('have.attr', 'href', 'https://t.me/ithillel_kyiv');

      cy.get('a.socials_link:has(.icon-youtube)')
        .should('be.visible')
        .and(
          'have.attr',
          'href',
          'https://www.youtube.com/user/HillelITSchool?sub_confirmation=1'
        );

      cy.get('a.socials_link:has(.icon-instagram)')
        .should('be.visible')
        .and('have.attr', 'href', 'https://www.instagram.com/hillel_itschool/');

      cy.get('a.socials_link:has(.icon-linkedin)')
        .should('be.visible')
        .and('have.attr', 'href', 'https://www.linkedin.com/school/ithillel/');

      cy.get('a.contacts_link')
        .contains('ithillel.ua')
        .should('be.visible')
        .and('have.attr', 'href', 'https://ithillel.ua');

      cy.get('a.contacts_link')
        .contains('support@ithillel.ua')
        .should('be.visible')
        .and('have.attr', 'href', 'mailto:developer@ithillel.ua');
    });
  });

  it('should find all footer elements', () => {
    cy.get('footer').within(() => {
      cy.contains('p', '© 2021 Hillel IT school').should('be.visible');

      cy.contains(
        'p',
        'Hillel auto developed in Hillel IT school for educational purposes of QA courses.'
      ).should('be.visible');

      cy.get('a.footer_logo')
        .should('be.visible')
        .and('have.attr', 'href', '/');
    });
  });
});
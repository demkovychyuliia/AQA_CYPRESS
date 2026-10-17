const auth = require('../../env/auth.json');

describe('Registration', () => {
  const validPassword = 'Testpass123';

  const fillRegistrationForm = ({
    name = 'Anna',
    lastName = 'Smith',
    email = `anna${Date.now()}@example.com`,
    password = validPassword,
    repeatPassword = password,
  } = {}) => {
    cy.get('#signupName').clear().type(name);
    cy.get('#signupLastName').clear().type(lastName);
    cy.get('#signupEmail').clear().type(email);
    cy.get('#signupPassword')
      .clear()
      .type(password, { sensitive: true });
    cy.get('#signupRepeatPassword')
      .clear()
      .type(repeatPassword, { sensitive: true });
  };

  const expectInvalidField = (selector, message) => {
    cy.get(selector)
      .should('have.class', 'is-invalid')
      .and('have.css', 'border-color', 'rgb(220, 53, 69)');

    cy.get(selector)
      .closest('.form-group')
      .find('.invalid-feedback')
      .should('be.visible')
      .and('contain.text', message);
  };

  const expectValidField = (selector) => {
    cy.get(selector).should('not.have.class', 'is-invalid');
  };

  beforeEach(() => {
    cy.visit('/', {
      auth: {
        username: auth.username,
        password: auth.password,
      },
    });

    cy.contains('button', 'Sign In').click();
    cy.contains('button', 'Registration').click();
    cy.contains('h4', 'Registration').should('be.visible');
  });

  it('should display the registration form and required fields', () => {
    cy.get('#signupName').should('be.visible');
    cy.get('#signupLastName').should('be.visible');
    cy.get('#signupEmail').should('be.visible');
    cy.get('#signupPassword').should('be.visible');
    cy.get('#signupRepeatPassword').should('be.visible');

    cy.contains('button', 'Register').should('be.disabled');
  });

  it('should show required-field errors for empty inputs', () => {
    const fields = [
      ['#signupName', 'Name required'],
      ['#signupLastName', 'Last name required'],
      ['#signupEmail', 'Email required'],
      ['#signupPassword', 'Password required'],
      ['#signupRepeatPassword', 'Re-enter password required'],
    ];

    fields.forEach(([selector, message]) => {
      cy.get(selector).focus().blur();
      expectInvalidField(selector, message);
    });

    cy.contains('button', 'Register').should('be.disabled');
  });

  describe('Name validation', () => {
    it('should reject a name shorter than 2 characters', () => {
      cy.get('#signupName').type('A');
      cy.get('#signupLastName').click();

      expectInvalidField(
        '#signupName',
        'Name has to be from 2 to 20 characters long',
      );

      cy.contains('button', 'Register').should('be.disabled');
    });

    it('should reject a name longer than 20 characters', () => {
      cy.get('#signupName').type('A'.repeat(21));
      cy.get('#signupLastName').click();

      expectInvalidField(
        '#signupName',
        'Name has to be from 2 to 20 characters long',
      );
    });

    it('should reject invalid characters in a name', () => {
      cy.get('#signupName').type('Anna1');
      cy.get('#signupLastName').click();

      expectInvalidField('#signupName', 'Name is invalid');
      cy.contains('button', 'Register').should('be.disabled');
    });

    it('should reject non-English characters in a name', () => {
      cy.get('#signupName').type('Анна');
      cy.get('#signupLastName').click();

      expectInvalidField('#signupName', 'Name is invalid');
      cy.contains('button', 'Register').should('be.disabled');
    });

    it('should reject special characters in a name', () => {
      cy.get('#signupName').type('Anna@');
      cy.get('#signupLastName').click();

      expectInvalidField('#signupName', 'Name is invalid');
      cy.contains('button', 'Register').should('be.disabled');
    });

    it('should accept names with lengths of 2 and 20 characters', () => {
      cy.get('#signupName').type('Al');
      cy.get('#signupLastName').click();
      expectValidField('#signupName');

      cy.get('#signupName').clear().type('A'.repeat(20));
      cy.get('#signupLastName').click();
      expectValidField('#signupName');
    });

    it('should ignore leading and trailing spaces when validating a name', () => {
      cy.get('#signupName').type(' Anna ');
      cy.get('#signupLastName').click();

      expectValidField('#signupName');
    });
  });

  describe('Last Name validation', () => {
    it('should reject a last name shorter than 2 characters', () => {
      cy.get('#signupLastName').type('A');
      cy.get('#signupName').click();

      expectInvalidField(
        '#signupLastName',
        'Last name has to be from 2 to 20 characters long',
      );
    });

    it('should reject a last name longer than 20 characters', () => {
      cy.get('#signupLastName').type('S'.repeat(21));
      cy.get('#signupName').click();

      expectInvalidField(
        '#signupLastName',
        'Last name has to be from 2 to 20 characters long',
      );
    });

    it('should reject invalid characters in a last name', () => {
      cy.get('#signupLastName').type('Smith1');
      cy.get('#signupName').click();

      expectInvalidField('#signupLastName', 'Last name is invalid');
    });

    it('should reject non-English characters in a last name', () => {
      cy.get('#signupLastName').type('Сміт');
      cy.get('#signupName').click();

      expectInvalidField('#signupLastName', 'Last name is invalid');
      cy.contains('button', 'Register').should('be.disabled');
    });

    it('should reject special characters in a last name', () => {
      cy.get('#signupLastName').type('Smith!');
      cy.get('#signupName').click();

      expectInvalidField('#signupLastName', 'Last name is invalid');
      cy.contains('button', 'Register').should('be.disabled');
    });

    it('should accept last names with lengths of 2 and 20 characters', () => {
      cy.get('#signupLastName').type('Li');
      cy.get('#signupName').click();
      expectValidField('#signupLastName');

      cy.get('#signupLastName').clear().type('S'.repeat(20));
      cy.get('#signupName').click();
      expectValidField('#signupLastName');
    });

    it('should ignore leading and trailing spaces when validating a last name', () => {
      cy.get('#signupLastName').type(' Smith ');
      cy.get('#signupName').click();

      expectValidField('#signupLastName');
    });
  });

  describe('Email validation', () => {
    it('should reject an invalid email format', () => {
      cy.get('#signupEmail').type('abc');
      cy.get('#signupPassword').click();

      expectInvalidField('#signupEmail', 'Email is incorrect');
      cy.contains('button', 'Register').should('be.disabled');
    });

    it('should reject an email without a complete domain', () => {
      cy.get('#signupEmail').type('anna@mail');
      cy.get('#signupPassword').click();

      expectInvalidField('#signupEmail', 'Email is incorrect');
    });

    it('should accept a valid email format', () => {
      cy.get('#signupEmail').type(`anna${Date.now()}@example.com`);
      cy.get('#signupPassword').click();

      expectValidField('#signupEmail');
    });
  });

  describe('Password validation', () => {
    const passwordError =
      'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter';

    const checkInvalidPassword = (password) => {
      cy.get('#signupPassword')
        .clear()
        .type(password, { sensitive: true });

      cy.get('#signupRepeatPassword').click();

      expectInvalidField('#signupPassword', passwordError);
      cy.contains('button', 'Register').should('be.disabled');
    };

    it('should reject a password shorter than 8 characters', () => {
      checkInvalidPassword('Abc1234');
    });

    it('should reject a password longer than 15 characters', () => {
      checkInvalidPassword('Abcdefghijklm123');
    });

    it('should reject a password without a digit', () => {
      checkInvalidPassword('Abcdefgh');
    });

    it('should reject a password without an uppercase letter', () => {
      checkInvalidPassword('abcdefg1');
    });

    it('should reject a password without a lowercase letter', () => {
      checkInvalidPassword('ABCDEFG1');
    });

    it('should accept valid passwords at the minimum and maximum lengths', () => {
      cy.get('#signupPassword').type('Abcdef1g', {
        sensitive: true,
      });
      cy.get('#signupRepeatPassword').click();
      expectValidField('#signupPassword');

      cy.get('#signupPassword')
        .clear()
        .type('Abcdefghijk1XYZ', { sensitive: true });
      cy.get('#signupRepeatPassword').click();
      expectValidField('#signupPassword');
    });
  });

  describe('Re-enter password validation', () => {
    it('should show an error when passwords do not match', () => {
      fillRegistrationForm({
        password: validPassword,
        repeatPassword: 'Different123',
      });

      cy.get('#signupRepeatPassword').blur();

      cy.get('#signupRepeatPassword')
        .closest('.form-group')
        .find('.invalid-feedback p')
        .should('be.visible')
        .and('have.text', 'Passwords do not match');

      cy.get('#signupRepeatPassword').should(
        'have.class',
        'is-invalid',
      );

      cy.contains('button', 'Register').should('be.disabled');
    });

    it('should accept matching passwords', () => {
      fillRegistrationForm();

      cy.get('#signupRepeatPassword').blur();

      expectValidField('#signupPassword');
      expectValidField('#signupRepeatPassword');
      cy.contains('button', 'Register').should('be.enabled');
    });
  });

  it('should close the registration form when clicking X', () => {
    cy.get('.modal-header')
      .contains('h4', 'Registration')
      .parent()
      .find('button[aria-label="Close"]')
      .click();

    cy.contains('h4', 'Registration').should('not.exist');
  });

  describe('Successful registration and login', () => {
    it('should register a new user successfully and log in with the same credentials', () => {
      const uniqueEmail = `anna${Date.now()}@example.com`;

      fillRegistrationForm({
        email: uniqueEmail,
        password: validPassword,
      });

      cy.contains('button', 'Register')
        .should('be.enabled')
        .click();

      // Verify successful registration
      cy.url().should('include', '/panel/garage');

      // Log out from the newly registered account
      cy.get('#userNavDropdown').click();
      cy.get('.user-nav_menu')
        .contains('button', 'Logout')
        .click();

      // Verify successful logout
      cy.url().should('eq', 'https://qauto.forstudy.space/');

      // Log in with the same credentials
      cy.login(uniqueEmail, validPassword);

      // Verify successful login
      cy.url().should('include', '/panel/garage');
    });
  });
});
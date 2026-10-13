class AuthPage {
  getEmailInput() {
    return cy.get('#signinEmail');
  }

  getPasswordInput() {
    return cy.get('#signinPassword');
  }

  getLoginButton() {
    return cy.get('ngb-modal-window .modal-footer button.btn-primary');
  }

  login(email, password) {
    this.getEmailInput().clear().type(email);
    this.getPasswordInput().clear().type(password, { log: false });
    this.getLoginButton().should('be.enabled').click();
  }
}

module.exports = AuthPage;
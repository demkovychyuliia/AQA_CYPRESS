class Header {
  getLogo() {
    return cy.get('header a.header_logo');
  }

  getHomeLink() {
    return cy.get('header a.header-link').contains('Home');
  }

  getAboutButton() {
    return cy.get('header button.header-link').contains('About');
  }

  getContactsButton() {
    return cy.get('header button.header-link').contains('Contacts');
  }

  getGuestLoginButton() {
    return cy.get('header button.-guest').contains('Guest log in');
  }

  getSignInButton() {
    return cy.get('header button.header_signin').contains('Sign In');
  }
}

module.exports = Header;
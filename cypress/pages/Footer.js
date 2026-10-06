class Footer {
  getSection() {
    return cy.get('footer');
  }

  getCopyright() {
    return cy.get('footer').contains('p', '© 2021 Hillel IT school');
  }

  getDescription() {
    return cy
      .get('footer')
      .contains(
        'p',
        'Hillel auto developed in Hillel IT school for educational purposes of QA courses.'
      );
  }

  getLogo() {
    return cy.get('footer a.footer_logo');
  }
}

module.exports = Footer;
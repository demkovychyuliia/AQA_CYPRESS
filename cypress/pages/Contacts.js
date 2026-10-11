class Contacts {
  getSection() {
    return cy.get('#contactsSection');
  }

  getTitle() {
    return cy.get('#contactsSection h2').contains('Contacts');
  }

  getSocialLinks() {
    return cy.get('#contactsSection a.socials_link');
  }

  getFacebookLink() {
    return cy.get('#contactsSection a.socials_link:has(.icon-facebook)');
  }

  getTelegramLink() {
    return cy.get('#contactsSection a.socials_link:has(.icon-telegram)');
  }

  getYoutubeLink() {
    return cy.get('#contactsSection a.socials_link:has(.icon-youtube)');
  }

  getInstagramLink() {
    return cy.get('#contactsSection a.socials_link:has(.icon-instagram)');
  }

  getLinkedinLink() {
    return cy.get('#contactsSection a.socials_link:has(.icon-linkedin)');
  }

  getWebsiteLink() {
    return cy.get('#contactsSection a.contacts_link').contains('ithillel.ua');
  }

  getSupportEmailLink() {
    return cy
      .get('#contactsSection a.contacts_link')
      .contains('support@ithillel.ua');
  }
}

module.exports = Contacts;
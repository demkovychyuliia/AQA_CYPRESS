const auth = require('../../env/auth.json');

const Header = require('../pages/Header');
const Contacts = require('../pages/Contacts');
const Footer = require('../pages/Footer');

describe('Header, Contacts and Footer', () => {
  const header = new Header();
  const contacts = new Contacts();
  const footer = new Footer();

  beforeEach(() => {
    cy.visit('/', {
      auth: {
        username: auth.username,
        password: auth.password,
      },
    });
  });

  it('should find all header elements', () => {
    header.getLogo().should('be.visible');
    header.getHomeLink().should('be.visible');
    header.getAboutButton().should('be.visible');
    header.getContactsButton().should('be.visible');
    header.getGuestLoginButton().should('be.visible');
    header.getSignInButton().should('be.visible');
  });

  it('should find all contacts links', () => {
    contacts.getTitle().should('be.visible');

    contacts.getSocialLinks().should('have.length', 5);

    contacts.getFacebookLink().should('be.visible').and('have.attr', 'href', 'https://www.facebook.com/Hillel.IT.School');
    contacts.getTelegramLink().should('be.visible').and('have.attr', 'href', 'https://t.me/ithillel_kyiv');
    contacts.getYoutubeLink().should('be.visible').and('have.attr', 'href', 'https://www.youtube.com/user/HillelITSchool?sub_confirmation=1');
    contacts.getInstagramLink().should('be.visible').and('have.attr', 'href', 'https://www.instagram.com/hillel_itschool/');
    contacts.getLinkedinLink().should('be.visible').and('have.attr', 'href', 'https://www.linkedin.com/school/ithillel/');
    contacts.getWebsiteLink().should('be.visible').and('have.attr', 'href', 'https://ithillel.ua');
    contacts.getSupportEmailLink().should('be.visible').and('have.attr', 'href', 'mailto:developer@ithillel.ua');
  });

  it('should find all footer elements', () => {
    footer.getCopyright().should('be.visible');
    footer.getDescription().should('be.visible');
    footer.getLogo().should('be.visible').and('have.attr', 'href', '/');
  });
});
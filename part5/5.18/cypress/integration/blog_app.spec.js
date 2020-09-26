
describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    const user = {
      name: 'Sammynilla',
      username: 'sammynilla',
      password: 'secret',
    };
    cy.request('POST', 'http://localhost:3003/api/users', user);
    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function () {
    cy.contains('login').click();
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#loginFormUsername').type('sammynilla');
      cy.get('#loginFormPassword').type('secret');
      cy.contains('login').click();

      cy.contains('Sammynilla logged in');
    });
    it('fails with wrong credentials', function () {
      cy.contains('login').click();
      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)');
    });
  });
});
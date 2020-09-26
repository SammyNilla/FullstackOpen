
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

  describe('When logged in', function () {
    beforeEach(function () {
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'sammynilla', password: 'secret',
      }).then(res => {
        localStorage.setItem('loggedBlogappUser', JSON.stringify(res.body));
        cy.visit('http://localhost:3000');
      });
    });

    it('A blog can be created', function () {
      cy.contains('create new blog').click();
      cy.get('#blogFormTitle').type('test blog');
      cy.get('#blogFormAuthor').type('Sammynilla');
      cy.get('#blogFormUrl').type('http://localhost:3003');
      cy.get('#blogFormSubmit').click();

      cy.contains('test blog Sammynilla');
      cy.visit('http://localhost:3000');
    });
  });
});
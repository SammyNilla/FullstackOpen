
describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    cy.createUser({ name: 'Sammynilla', username: 'sammynilla', password: 'secret' });
    cy.createUser({ name: 'test user', username: 'abcd', password: '1234' });
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
      cy.login({ username: 'sammynilla', password: 'secret' });
    });

    it('A blog can be created', function () {
      cy.contains('create new blog').click();
      cy.get('#blogFormTitle').type('test blog');
      cy.get('#blogFormAuthor').type('Sammynilla');
      cy.get('#blogFormUrl').type('http://localhost:3003');
      cy.get('#blogFormSubmit').click();

      cy.contains('test blog Sammynilla');
    });

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'test blog',
          author: 'Sammynilla',
          url: 'http://localhost:3003',
        });
      });

      it('it can liked', function () {
        // since theres only one blog atm, this should be fine atm.
        cy.contains('view').click();
        cy.contains('like').click();
      });
      it('it can be deleted by the user who created it', function () {
        cy.contains('test blog Sammynilla').parent()
          .find('button').contains('view')
          .as('toggleDetails');
        cy.get('@toggleDetails').click();

        // verifying that the remove button isn't hidden (implies it can be deleted)
        cy.get('.details')
          .find('button').contains('remove')
          .as('removeBlog');
        cy.get('@removeBlog').should('not.have.css', 'display', 'none');
      });
      it('it cannot be deleted by a user who didn\'t create it', function () {
        // log in as a different user
        cy.login({ username: 'abcd', password: '1234' });

        cy.contains('test blog Sammynilla').parent()
          .find('button').contains('view')
          .as('toggleDetails');
        cy.get('@toggleDetails').click();

        // verifying that the remove button is hidden (implies it cannot be deleted)
        cy.get('.details')
          .find('button').contains('remove')
          .as('removeBlog');
        cy.get('@removeBlog').should('have.css', 'display', 'none');
      });
    });
  });
});
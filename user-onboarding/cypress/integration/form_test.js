describe('Testing form inputs', () => { // you can use context instead of describe
    beforeEach(() => {
        cy.visit('http://localhost:3000')
    });
    it('adding text to inputs and submits the form', () => {
        cy.visit('http://localhost:3000')
        cy.get('h1').contains('User Onboarding Form')
        cy.get('[data-cy=name]')
        .type('Patrice')
        .should('have.value', 'Patrice');
        cy.get('[data-cy=pronoun]')
        .type('She/Her')
        .should('have.value', 'She/Her');
        cy.get('[data-cy=email]')
        .type('patrice@email.com')
        .should('have.value', 'patrice@email.com')    
        cy.get('[data-cy=password]')
        .type('have.length', 6)
        cy.get('[data-cy=roles]')
        .select('Customer Service Agent')
        .should('have.value', 'Customer Service Agent');
        cy.get('[data-cy=terms]')
        .check()
        .should('be.checked')
        cy.get('[data-cy=submit]')
        .click()
        cy.request('POST')
        cy.intercept('POST', '/name', 'name').as('userSuccess')
        cy.get('form').submit()
    })
})
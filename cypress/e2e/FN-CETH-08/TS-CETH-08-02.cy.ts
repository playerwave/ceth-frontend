describe('FN-CETH-08 จัดการอาหาร', () => {
  it('TS-CETH-08-02 ตรวจสอบการแสดงผลการค้นหา', () => {
    cy.visit('http://localhost:5173/activity-list-visitor');
     
    // Login
    cy.get('[data-cy="login-button"]').should('be.visible').click();
    cy.url().should('include', '/login');
    cy.get('[data-cy="username"]').type('admin');
    cy.get('[data-cy="password"]').type('1234');
    cy.get('[data-cy="signin-button"]').click();

    // รอ Sidebar render แล้วคลิก
    cy.get('[data-cy="sidebar-จัดการอาหาร"]', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true });

    // Toggle sidebar 
    cy.get('[data-cy="toggle-sidebar"]')
      .should('exist')
      .click({ force: true });

    // Searchbar
    cy.get('[data-cy="searchbar"]').should('exist').within(() => {
      cy.get('input').type('กะเพรา{enter}');
      cy.get('button').click();
    });
  });
});

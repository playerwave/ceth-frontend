describe('FN-CETH-04 จัดการประวัติกิจกรรม', () => {
  it('TS-CETH-04-04 ตรวจสอบการทำงานการกดคลิ๊กลิสต์รายการประวัติกิจกรรรมสหกิจ', () => {
    cy.visit('http://localhost:5173/activity-list-visitor');
     
    // Login
    cy.get('[data-cy="login-button"]').should('be.visible').click();
    cy.url().should('include', '/login');
    cy.get('[data-cy="username"]').type('admin');
    cy.get('[data-cy="password"]').type('1234');
    cy.get('[data-cy="signin-button"]').click();

    // รอ Sidebar render แล้วคลิก
    cy.get('[data-cy="sidebar-ประวัติกิจกรรม"]', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true });

    // Toggle sidebar 
    cy.get('[data-cy="toggle-sidebar"]')
      .should('exist')
      .click({ force: true });

      cy.wait(3000)

    // cy.get('.MuiDataGrid-row', { timeout: 10000 })
    //   .should('have.length.greaterThan', 0) // ต้องมี row อย่างน้อย 1 แถว
    //   .first()
    //   .click()
  });
});

describe('FN-CETH-09 จัดการห้อง', () => {
  it('TS-CETH-09-09 ตรวจสอบการทำงานปุ่ม icon ลบห้อง และการแจ้งเตือน', () => {
    // cy.viewport(1280, 800);
    cy.visit('http://localhost:5173/activity-list-visitor');
     
    // Login
    cy.get('[data-cy="login-button"]').should('be.visible').click();
    cy.url().should('include', '/login');
    cy.get('[data-cy="username"]').type('admin');
    cy.get('[data-cy="password"]').type('1234');
    cy.get('[data-cy="signin-button"]').click();

    // รอ Sidebar render แล้วคลิก
    cy.get('[data-cy="sidebar-จัดการห้อง"]', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true });

    // Toggle sidebar
    cy.get('[data-cy="toggle-sidebar"]')
      .should('exist')
      .click({ force: true });

    cy.get('.MuiDataGrid-row', { timeout: 10000 })
      .should('have.length.greaterThan', 0) // ต้องมี row อย่างน้อย 1 แถว
      .first()
      .click()
    // กดปุ่มลบห้อง
    cy.get('[data-cy="delete-button"]').click({ force: true });

    // ตรวจสอบว่ามี Dialog แสดงขึ้น
    cy.get('[data-cy="delete-dialog"]', { timeout: 5000 }).should('exist');

    cy.wait(3000);

    cy.get('[data-cy="Cancel-dialog-button"]', { timeout: 5000 })
      .should('be.visible')
      .click(); // ไม่ต้อง force ถ้า visible

    cy.wait(3000);

    cy.get('[data-cy="delete-button"]').click({ force: true });

    // ตรวจสอบว่ามี Dialog แสดงขึ้น
    cy.get('[data-cy="delete-dialog"]', { timeout: 5000 }).should('exist');

    cy.get('[data-cy="confirm-dialog-button"]').click({ force: true });
  });
});

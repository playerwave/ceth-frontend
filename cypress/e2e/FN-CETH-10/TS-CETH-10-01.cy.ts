describe('FN-CETH-10 ออกจากระบบ', () => {
  it('TS-CETH-10-01 ตรวจสอบการทำงานปุ่ม icon ออกจากระบบ และการแจ้งเตือน', () => {
    cy.visit('http://localhost:5173/activity-list-visitor');
     
    // คลิกปุ่ม Login
    cy.get('[data-cy="login-button"]').should('be.visible').click();
    
    // รอให้ URL เปลี่ยนเป็น /login
    cy.url().should('include', 'http://localhost:5173/login');
    
    // กรอก Student ID และ Password
    cy.get('[data-cy="username"]').type('admin');
    cy.get('[data-cy="password"]').type('1234');
    
// // กดปุ่ม show/hide password (optional)
//     cy.get('[data-cy="toggle-password"]').click();
//     // กดปุ่ม show/hide password (optional)
//     cy.get('[data-cy="toggle-password"]').click();

    // คลิก Sign in
    cy.get('[data-cy="signin-button"]').click();
    cy.wait(3000);
        // รอ Sidebar render แล้วคลิก
    cy.get('[data-cy="sidebar-ออกจากระบบ"]', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true });
    
    cy.wait(3000);

    cy.get('[data-cy="Cancel-dialog-button"]', { timeout: 5000 })
      .should('be.visible')
      .click(); // ไม่ต้อง force ถ้า visible

    cy.wait(3000);

    cy.get('[data-cy="sidebar-ออกจากระบบ"]', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true });

    cy.wait(3000);

    cy.get('[data-cy="confirm-dialog-button"]').click({ force: true });
    // // Toggle sidebar
    // cy.get('[data-cy="toggle-sidebar"]')     
    //   .should('exist')
    //   .click({ force: true });
    
  });
});

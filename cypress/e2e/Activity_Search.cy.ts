describe('Activity Page', () => {
  it('หน้าระบบจัดการกิจกรรมสหกิจ ทดสอบ searchbar', () => {
    cy.visit('http://localhost:5173/activity-list-visitor');
     
    // คลิกปุ่ม Login
    cy.get('[data-cy="login-button"]').should('be.visible').click();
    
    // รอให้ URL เปลี่ยนเป็น /login
    cy.url().should('include', 'http://localhost:5173/login');
    
    // กรอก Student ID และ Password
    cy.get('[data-cy="username"]').type('admin');
    cy.get('[data-cy="password"]').type('1234');
    
// กดปุ่ม show/hide password (optional)
    cy.get('[data-cy="toggle-password"]').click();
    // กดปุ่ม show/hide password (optional)
    cy.get('[data-cy="toggle-password"]').click();

    // คลิก Sign in
    cy.get('[data-cy="signin-button"]').click();
    
    cy.get('[data-cy="sidebar-รายการกิจกรรม"]')
    .should('be.visible')
    .click();

    cy.get('[data-cy="toggle-sidebar"]')
  .should('exist')
  .click();
  // Searchbar
    cy.get('[data-cy="searchbar"]')
      .should('exist')
      .within(() => {
        // พิมพ์ค้นหา
        cy.get('input').type('ทดสอบสร้างกิจกรรม{enter}');
        // หรือกดปุ่ม search
        cy.get('button').click();
      });

  });
});

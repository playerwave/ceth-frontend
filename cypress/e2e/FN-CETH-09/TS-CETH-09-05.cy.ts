describe('FN-CETH-09 จัดการห้อง', () => {
  it('TS-CETH-09-05 ตรวจสอบการกดปุ่ม dropdown list ชั้น', () => {
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

   // ✅ เปิด Dropdown
    cy.get('[data-cy="floor-dropdown-button"]').click();
    cy.wait(3000);
    // ✅ เลือก ชั้น 1
    cy.get('[data-cy="floor-3"]').click();

    // ✅ เปิด Dropdown อีกครั้ง
    cy.get('[data-cy="floor-dropdown-button"]').click();
    cy.wait(3000);
    // ✅ เลือกทั้งหมด
    cy.get('[data-cy="floor-all"]').click();
  });
});

describe('FN-CETH-09 จัดการห้อง', () => {
  it('TS-CETH-09-08 ตรวจสอบการทำงานปุ่มและการกรอกข้อมูล และการแจ้งเตือน', () => {
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

    cy.wait(3000);
    cy.get('[data-cy="cancel-button"]').click(); // กลับไปหน้า list-room-teacher
    cy.url().should('include', '/list-room-teacher');
    cy.wait(3000);
    cy.get('.MuiDataGrid-row', { timeout: 10000 })
      .should('have.length.greaterThan', 0) // ต้องมี row อย่างน้อย 1 แถว
      .first()
      .click()
    // เลือก row แรกแล้วแก้ไขข้อมูล
cy.get('[data-cy="floor-dropdown"]').click();
cy.contains('li', 'ชั้น 11').click({ force: true });

cy.get('[data-cy="room-name-input"]')
  .clear()
  .type('IF-11M280');

cy.get('[data-cy="seat-number-input"]')
  .clear()
  .type('280');

// กดบันทึก
cy.get('[data-cy="save-button"]').click();

  });
});

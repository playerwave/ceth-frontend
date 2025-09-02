describe('FN-CETH-09 จัดการห้อง', () => {
  it('TS-CETH-09-06 ตรวจสอบการทำงานปุ่มและการกรอกข้อมูล  dropdown list และการแจ้งเตือน', () => {
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
    // ไปหน้าเพิ่มห้อง
    // รอบแรก: กดเพิ่มห้องแล้วกดยกเลิก
    cy.get('[data-cy="add-room-button"]').click();
    cy.wait(3000);
    cy.get('[data-cy="cancel-button"]').click(); // กลับไปหน้า list-room-teacher
    cy.url().should('include', '/list-room-teacher');

    // รอบสอง: กดเพิ่มห้องใหม่ → ใส่ข้อมูล → บันทึก
    cy.get('[data-cy="add-room-button"]').should('be.visible').click();

    // เลือกชั้น 11 (MUI dropdown บางทีต้องใช้ contains กับ li)
    cy.get('[data-cy="floor-dropdown"]').click();
    cy.contains('li', 'ชั้น 11').click({ force: true });

    // กรอกชื่อห้องและจำนวนที่นั่ง
    cy.get('[data-cy="room-name-input"]').type('IF-11M280');
    cy.get('[data-cy="seat-number-input"]').type('280');

    // กดบันทึก
    cy.get('[data-cy="save-button"]').click();

    // ตรวจสอบว่ากลับไปหน้ารายการห้อง
    cy.url().should('include', '/list-room-teacher');

  });
});

describe('FN-CETH-09 จัดการห้อง', () => {
  it('TS-CETH-09-07 ตรวจสอบการกรอกข้อมูลไม่ครบ', () => {
    cy.visit('http://localhost:5173/activity-list-visitor');
     
    // Login
    cy.get('[data-cy="login-button"]').click();
    cy.url().should('include', '/login');
    cy.get('[data-cy="username"]').type('admin');
    cy.get('[data-cy="password"]').type('1234');
    cy.get('[data-cy="signin-button"]').click();

    // ไปหน้า จัดการห้อง
    cy.get('[data-cy="sidebar-จัดการห้อง"]', { timeout: 10000 }).click({ force: true });
    cy.get('[data-cy="toggle-sidebar"]').click({ force: true });

    // รอบแรก: กดเพิ่มห้อง
    cy.get('[data-cy="add-room-button"]').click();

    // เลือกชั้น 11
    cy.get('[data-cy="floor-dropdown"]').click();
    cy.contains('li', 'ชั้น 11').click({ force: true });

    // กรอกชื่อห้อง แต่ไม่กรอกจำนวนที่นั่ง
    cy.get('[data-cy="room-name-input"]').type('IF-11M280');

    // stub alert
    cy.on('window:alert', (str) => {
      expect(str).to.equal('กรุณากรอกข้อมูลให้ครบทุกช่อง');
    });

    // กดบันทึก
    cy.get('[data-cy="save-button"]').click();
  });
});

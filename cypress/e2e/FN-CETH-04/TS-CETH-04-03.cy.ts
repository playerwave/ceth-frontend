describe('FN-CETH-04 จัดการประวัติกิจกรรม', () => {
  it('TS-CETH-04-03 ตรวจสอบการทำงานของปุ่ม Sort ข้อมูล Toggle filter checkbox และ dropdown list ', () => {
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
    cy.get('[data-cy="toggle-mode-button"]').click();
    cy.wait(3000)
        // กด range date
    cy.get('[data-cy="range-date-button"]').click();
    cy.wait(3000)
    cy.get('[data-cy="range-date-button"]').click();
        
    cy.wait(3000)

    cy.get('[data-cy="toggle-mode-button"]').click();
    cy.wait(3000)

// เปิด dropdown เลือกประเภท
cy.get('[data-cy="multi-select-button"]').click();
cy.wait(2000);

// เลือก Onsite แล้วเอาออก
cy.get('[data-cy="multi-select-checkbox-Onsite"] input').check();
cy.wait(2000);
cy.get('[data-cy="multi-select-checkbox-Onsite"] input').uncheck();
cy.wait(2000);

// เลือก Online แล้วเอาออก
cy.get('[data-cy="multi-select-checkbox-Online"] input').check();
cy.wait(2000);
cy.get('[data-cy="multi-select-checkbox-Online"] input').uncheck();
cy.wait(2000);

// เลือก Course แล้วเอาออก
cy.get('[data-cy="multi-select-checkbox-Course"] input').check();
cy.wait(2000);
cy.get('[data-cy="multi-select-checkbox-Course"] input').uncheck();
cy.wait(2000);

// สุดท้ายเลือกทั้ง 3 แบบพร้อมกัน
cy.get('[data-cy="multi-select-checkbox-Onsite"] input').check();
cy.get('[data-cy="multi-select-checkbox-Online"] input').check();
cy.get('[data-cy="multi-select-checkbox-Course"] input').check();
cy.wait(2000);

// ปิด dropdown
cy.get('[data-cy="multi-select-button"]').click();
cy.wait(3000);



// // เปิด dropdown ปี
// cy.get('[data-cy="dropdown-year"]').click();

// // เลือกปี
// cy.get('[data-cy="custom-dropdown-item-2025"]')
//   .should('exist')  // หรือ .should('be.visible') ถ้า visible
//   .click();

// // เดือนเหมือนกัน
// cy.get('[data-cy="dropdown-month"]').click();
// cy.get('[data-cy="custom-dropdown-item-0"]').click();



// cy.wait(3000)
//     // เลือกวันเดียว
//     cy.get('[data-cy="single-date-button"]').click();
//     cy.get('.react-calendar__tile--active').first().click();
  });
});

describe('FN-CETH-01 ตรวจสอบสิทธิ์การเข้าใช้งาน', () => {
  it('TS-CETH-01-08 ตรวจสอบการกรอก username ด้วยอีเมล @go.buu.ac.th แต่ไม่มีในระบบ', () => {
    cy.visit('http://localhost:5173/activity-list-visitor');
     
//     // คลิกปุ่ม Login
//     cy.get('[data-cy="login-button"]').should('be.visible').click();
    
//     // รอให้ URL เปลี่ยนเป็น /login
//     cy.url().should('include', 'http://localhost:5173/login');
    
//     // กรอก Student ID และ Password
//     cy.get('[data-cy="username"]').type('admin');
//     cy.get('[data-cy="password"]').type('1234');
    
// // // กดปุ่ม show/hide password (optional)
// //     cy.get('[data-cy="toggle-password"]').click();
// //     // กดปุ่ม show/hide password (optional)
// //     cy.get('[data-cy="toggle-password"]').click();
    
//     // คลิก Sign in
//     cy.get('[data-cy="signin-button"]').click();
    
  });
});

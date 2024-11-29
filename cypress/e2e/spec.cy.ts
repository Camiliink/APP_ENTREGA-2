describe('Verificar mi aplicación', () => {

  const numero = Math.floor(Math.random() * 1000000) + 1;

  it('Verificar inicio de sesión con credenciales incorrectas', () => {
    cy.visit('http://localhost:8100/ingreso').then(() => {
      cy.url().should('include', '/ingreso');
      cy.get('#correo').invoke('val', '');
      cy.get('#correo').type('cuenta-inexistente');
      cy.get('#password').invoke('val', '');
      cy.get('#password').type('1234');
      cy.contains('Ingresar').click();
    });
  })

  it('Verificar inicio de sesión con credenciales correctas', () => {
    cy.visit('/').then(() => {
      cy.contains('Sistema de asistencia Duoc UC');
      cy.get('#correo').invoke('val', '');
      cy.get('#correo').type('atorres');
      cy.get('#password').invoke('val', '');
      cy.get('#password').type('1234');
      cy.contains('Ingresar').click();
      cy.intercept('/login').as('route').then(() => {
        cy.contains('Bienvenido(a)');
        cy.contains('salir').click();
      });
    });
  })

  it('Verificar publicación en foro', () => {
    cy.visit('http://localhost:8100/ingreso').then(() => {
      cy.contains('Sistema de asistencia Duoc UC');
      cy.get('#correo').invoke('val', '');
      cy.get('#correo').type('atorres');
      cy.get('#password').invoke('val', '');
      cy.get('#password').type('1234');
      cy.contains('Ingresar').click();
      cy.intercept('/inicio').as('route').then(() => {
        cy.get('#saludo').contains('Sistema de asistencia Duoc UC');
        cy.get('ion-segment-button[value="foro"]').click();
        cy.get('#titulo').type(`Título de prueba ${numero}`);
        cy.get('#contenido').type(`Contenido de prueba ${numero}`);
        cy.contains('Guardar').click();
        cy.wait(3000);
        cy.contains(`Título de prueba ${numero}`).should('exist');
        cy.contains('salir').click();
      });
    });
  });
  
    it(`Verificar eliminación en foro de la última publicación`, () => {
    cy.visit('http://localhost:8100/ingreso').then(() => {
      cy.contains('Sistema de asistencia Duoc UC');
      cy.get('#correo').invoke('val', '');
      cy.get('#correo').type('atorres');
      cy.get('#password').invoke('val', '');
      cy.get('#password').type('1234');
      cy.contains('Ingresar').click();
      cy.intercept('/inicio').as('route').then(() => {
        cy.get('ion-segment-button[value="foro"]').click();
        cy.get('ion-fab-button[value="eliminar"]').first().click();
        cy.contains(`Título de prueba ${numero}`).should('not.exist');
        cy.contains('salir').click();
      });
    });  
  });

  // // it(`Verificar validaciones en MIS DATOS`, () => {
  // //   cy.visit('http://localhost:8100/ingreso').then(() => {
  // //     cy.contains('Sistema de asistencia Duoc UC');
  // //     cy.get('#correo').invoke('val', '');
  // //     cy.get('#correo').type('atorres');
  // //     cy.get('#password').invoke('val', '');
  // //     cy.get('#password').type('1234');
  // //     cy.contains('Ingresar').click();
  // //     cy.intercept('/inicio').as('route').then(() => {
  // //       cy.get('ion-segment-button[value="mis-datos"]').click();
  // //       cy.get('#correo').invoke('val', '');
  // //       cy.contains(`Título de prueba ${numero}`).should('not.exist');
  // //       cy.contains('salir').click();
  // //     });
  // //   });  
  // // });

  it('Valida las restricciones de los campos y el envío del formulario', () => {
    cy.visit('http://localhost:8100/ingreso').then(() => {
      cy.contains('Sistema de asistencia Duoc UC');
      cy.get('#correo').invoke('val', '');
      cy.get('#correo').type('atorres');
      cy.get('#password').invoke('val', '');
      cy.get('#password').type('1234');
      cy.contains('Ingresar').click();
      cy.intercept('/login').as('route').then(() => {
        cy.contains('Bienvenido(a)');
        cy.get('ion-segment-button[value="misdatos"]').click();
    // Intentamos enviar el formulario vacío
        cy.get('form').submit();
        cy.contains('salir').click();
      });
      });
  });


  it('Valida datos válidos y actualiza', () => {
    cy.visit('http://localhost:8100/ingreso').then(() => {
      cy.contains('Sistema de asistencia Duoc UC');
      cy.get('#correo').invoke('val', '');
      cy.get('#correo').type('atorres');
      cy.get('#password').invoke('val', '');
      cy.get('#password').type('1234');
      cy.contains('Ingresar').click();
      cy.intercept('/login').as('route').then(() => {
        cy.contains('Bienvenido(a)');
        cy.get('ion-segment-button[value="misdatos"]').click();
  // Completar con datos válidos
        cy.get('input[name="userName"]').clear().type('usuario123');
        cy.get('input[name="firstName"]').clear().type('Juan');
        cy.get('input[name="lastName"]').clear().type('Pérez');
        cy.get('input[name="email"]').clear().type('juan.perez@example.com');
        cy.get('input[name="address"]').clear().type('Calle Ficticia 123');
        cy.get('input[name="secretQuestion"]').clear().type('¿Tu color favorito?');
        cy.get('input[name="secretAnswer"]').clear().type('Azul');
        cy.get('ion-select[name="educationalLevel"]').click();
        cy.get('ion-radio').first().click(); 


        cy.get('input[name="password1"]').clear().type('Contraseña123');
        cy.get('input[name="password2"]').clear().type('Contraseña123');

      // Enviamos el formulario con datos válidos
        cy.get('form').submit();
      cy.get('ion-segment-button[value="qr"]').click();
      cy.wait(5000)
      cy.contains('salir').click();
      });
    });
  });

});

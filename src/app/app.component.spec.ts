import { Usuario } from 'src/app/model/usuario'; 
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NivelEducacional } from 'src/app/model/nivel-educacional';

describe('Probar el comienzo de la aplicación', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  it('Se debería crear la aplicación', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });


});

describe('Probar clase de usuario', () => {

  // Usamos el método estático getNewUsuario para crear el usuario de manera más consistente
  const usuario = Usuario.getNewUsuario(
    'agarcia', 
    'agarcia@duocuc.cl', 
    '1234', 
    '¿Cuál es tu animal favorito?', 
    'gato', 
    'Alison', 
    'Garcia', 
    NivelEducacional.buscarNivelEducacional(6)!,
    new Date(2000, 0, 1),
    'calle ejemplo 321'
  );

  describe('Probar que la contraseña sea correcta', () => {

    it('Probar que la contraseña no sea vacía', () => {
      usuario.password = '';  // Asignamos una contraseña vacía
      expect(usuario.validarPassword()).toContain('ingresar la contraseña');
    });

    it('Probar que la contraseña sea numérica y no "abcd"', () => {
      usuario.password = 'abcd';  // Asignamos una contraseña no numérica
      expect(usuario.validarPassword()).toContain('debe ser numérica');
    });

    it('Probar que la contraseña no supere los 4 dígitos como por ejemplo "1234567890"', () => {
      usuario.password = '1234567890';  // Contraseña que excede los 4 dígitos
      expect(usuario.validarPassword()).toContain('debe ser numérica de 4 dígitos');
    });

    it('Probar que la contraseña sea de 4 dígitos como por ejemplo "1234"', () => {
      usuario.password = '1234';  // Contraseña válida de 4 dígitos
      expect(usuario.validarPassword()).toEqual('');  // Se espera que no haya mensaje de error
    });

  });

});

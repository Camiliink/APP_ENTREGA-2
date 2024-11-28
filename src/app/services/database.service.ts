import { capSQLiteChanges, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { User } from '../model/user';
import { BehaviorSubject } from 'rxjs';
import { EducationalLevel } from '../model/educational-level';
import { showAlertError } from '../tools/message-functions';
import { convertDateToString, convertStringToDate } from '../tools/date-functions';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  
  testUser1 = User.getNewUsuario(
    'atorres', 
    'atorres@duocuc.cl', 
    '1234', 
    '¿Cuál es tu animal favorito?', 
    'gato',
    'Ana', 
    'Torres', 
    EducationalLevel.findLevel(6)!,
    new Date(2000, 0, 5),
    'La Florida',
    'default-image.jpg');

  testUser2 = User.getNewUsuario(
    'jperez', 
    'jperez@duocuc.cl', 
    '5678', 
    '¿Cuál es tu postre favorito?',
    'panqueques',
    'Juan', 
    'Pérez',
    EducationalLevel.findLevel(5)!,
    new Date(2000, 1, 10),
    'La Pintana',
    'default-image.jpg');

  testUser3 = User.getNewUsuario(
    'cmujica', 
    'cmujica@duocuc.cl', 
    '0987', 
    '¿Cuál es tu vehículo favorito?',
    'moto',
    'Carla', 
    'Mujica', 
    EducationalLevel.findLevel(6)!,
    new Date(2000, 2, 20),
    'Providencia',
    'default-image.jpg');

  testUser4 = User.getNewUsuario(
    'admin', 
    'admin@duocuc.cl', 
    'admin', 
    '¿Cuál es tu admin favorito?',
    'admin',
    'admin', 
    'admin', 
    EducationalLevel.findLevel(6)!,
    new Date(2000, 3, 20),
    'Providencia',
    'default-image.jpg');    

  userUpgrades = [
    {
      toVersion: 1,
      statements: [`
      CREATE TABLE IF NOT EXISTS USER (
        userName         TEXT PRIMARY KEY NOT NULL,
        email            TEXT NOT NULL,
        password         TEXT NOT NULL,
        secretQuestion   TEXT NOT NULL,
        secretAnswer     TEXT NOT NULL,
        firstName        TEXT NOT NULL,
        lastName         TEXT NOT NULL,
        educationalLevel INTEGER NOT NULL,
        dateOfBirth      TEXT NOT NULL,
        address          TEXT NOT NULL,
        image            TEXT NOT NULL
      );
      `]
    }
  ];

  sqlInsertUpdate = `
    INSERT OR REPLACE INTO USER (
      userName, 
      email, 
      password, 
      secretQuestion, 
      secretAnswer,
      firstName, 
      lastName,
      educationalLevel, 
      dateOfBirth,
      address,
      image
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  dataBaseName = 'DinosaurDataBase';
  db!: SQLiteDBConnection;
  userList: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  constructor(private sqliteService: SQLiteService) { }

  async initializeDataBase(): Promise<void> {
    try {
      // Crear la base de datos y realizar las actualizaciones necesarias
      await this.createDatabase();
  
      // Abrir la base de datos
      await this.openDatabase();
  
      // Crear los usuarios de prueba si es necesario
      await this.createTestUsers();
  
      // Leer todos los usuarios y actualizar el estado
      await this.readUsers();
  
      console.log('Base de datos inicializada correctamente');
    } catch (error) {
      // Si ocurre un error, lo gestionamos y mostramos un mensaje detallado
      this.handleError(error);
    }
  }
  
  private async createDatabase(): Promise<void> {
    try {
      const options = { database: this.dataBaseName, upgrade: this.userUpgrades };
      await this.sqliteService.createDataBase(options);
      console.log(`Base de datos '${this.dataBaseName}' creada o actualizada correctamente.`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error al crear la base de datos: ${error.message}`);
      } else {
        throw new Error('Error desconocido al crear la base de datos');
      }
    }
  }
  
  private async openDatabase(): Promise<void> {
    try {
      this.db = await this.sqliteService.open(this.dataBaseName, false, 'no-encryption', 1, false);
      console.log(`Base de datos '${this.dataBaseName}' abierta correctamente.`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error al abrir la base de datos: ${error.message}`);
      } else {
        throw new Error('Error desconocido al abrir la base de datos');
      }
    }
  }
  
  private handleError(error: unknown): void {
    if (error instanceof Error) {
      const errorMessage = error.message;
      showAlertError('DataBaseService.initializeDataBase', errorMessage);
      console.error('Error detallado:', error); // Proporciona detalles completos del error
    } else {
      showAlertError('DataBaseService.initializeDataBase', 'Error desconocido');
      console.error('Error detallado:', error);
    }
  }

  async createTestUsers() {
    try {
        const user1 = await this.readUser(this.testUser1.userName);
        if (!user1) {
            await this.saveUser(this.testUser1);
        }

        const user2 = await this.readUser(this.testUser2.userName);
        if (!user2) {
            await this.saveUser(this.testUser2);
        }

        const user3 = await this.readUser(this.testUser3.userName);
        if (!user3) {
            await this.saveUser(this.testUser3);
        }

        const User4 = await this.readUser(this.testUser4.userName);
        if (!User4) {
            await this.saveUser(this.testUser4);
        }
    } catch (error) {
        showAlertError('DataBaseService.createTestUsers', error);
    }
}



  // Create y Update del CRUD. La creación y actualización de un usuario
  // se realizarán con el mismo método, ya que la instrucción "INSERT OR REPLACE"
  // revisa la clave primaria y si el registro es nuevo entonces lo inserta,
  // pero si el registro ya existe, entonces los actualiza. Se debe tener cuidado de
  // no permitir que el usuario cambie su correo, pues dado que es la clave primaria
  // no debe poder ser cambiada.
  
  async saveUser(user: User): Promise<void> {
    try {
      this.sqlInsertUpdate = `
        INSERT OR REPLACE INTO USER (
          userName, 
          email, 
          password, 
          secretQuestion, 
          secretAnswer,
          firstName, 
          lastName,
          educationalLevel, 
          dateOfBirth,
          address,
          image
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
      await this.db.run(this.sqlInsertUpdate, [
          user.userName, 
          user.email, 
          user.password,
          user.secretQuestion, 
          user.secretAnswer, 
          user.firstName, 
          user.lastName,
          user.educationalLevel.id, 
          convertDateToString(user.dateOfBirth), 
          user.address,
          user.image
      ]);
      await this.readUsers();
    } catch (error) {
      showAlertError('DataBaseService.saveUser', error);
    }
  }

  // Cada vez que se ejecute leerUsuarios() la aplicación va a cargar los usuarios desde la base de datos,
  // y por medio de la instrucción "this.listaUsuarios.next(usuarios);" le va a notificar a todos los programas
  // que se subscribieron a la propiedad "listaUsuarios", que la tabla de usuarios se acaba de cargar. De esta
  // forma los programas subscritos a la variable listaUsuarios van a forzar la actualización de sus páginas HTML.
  // ReadAll del CRUD. Si existen registros entonces convierte los registros en una lista de usuarios
  // con la instrucción ".values as Usuario[];". Si la tabla no tiene registros devuelve null.

  async readUsers(): Promise<User[]> {
    try {
      const q = 'SELECT * FROM USER;';
      const rows = (await this.db.query(q)).values;
      let users: User[] = [];
      if (rows) {
        users = rows.map((row: any) => this.rowToUser(row));
      }
      this.userList.next(users);
      return users;
    } catch (error) {
      showAlertError('DataBaseService.readUsers', error);
      return [];
    }
  }

  // Read del CRUD
  async readUser(userName: string): Promise<User | undefined> {
    try {
      const q = 'SELECT * FROM USER WHERE userName=?;';
      const rows = (await this.db.query(q, [userName])).values;
      return rows?.length? this.rowToUser(rows[0]) : undefined;
    } catch (error) {
      showAlertError('DataBaseService.readUser', error);
      return undefined;
    }
  }

  // Delete del CRUD
  async deleteByUserName(userName: string): Promise<boolean> {
    try {
      const q = 'DELETE FROM USER WHERE userName=?';
      const result: capSQLiteChanges = await this.db.run(q, [userName]);
      const rowsAffected = result.changes?.changes ?? 0;
      await this.readUsers();
      return rowsAffected > 0;
    } catch (error) {
      showAlertError('DataBaseService.deleteByUserName', error);
      return false;
    }
  }
  async deleteByUserEmail(email: string): Promise<boolean> {
    try {
      const q = 'DELETE FROM USER WHERE email = ?';
      const result: capSQLiteChanges = await this.db.run(q, [email]);
      const rowsAffected = result.changes?.changes ?? 0; // Obtén el número de filas afectadas
      await this.readUsers(); // Actualiza la lista de usuarios
      return rowsAffected > 0; // Devuelve true si se eliminó un usuario
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }

  // Validar usuario
  async findUser(userName: string, password: string): Promise<User | undefined> {
    try {
      const q = 'SELECT * FROM USER WHERE userName=? AND password=?;';
      const rows = (await this.db.query(q, [userName, password])).values;
      return rows?.length? this.rowToUser(rows[0]) : undefined;
    } catch (error) {
      showAlertError('DataBaseService.findUser', error);
      return undefined;
    }
  }

  async findUserByUserName(userName: string): Promise<User | undefined> {
    try {
      const q = 'SELECT * FROM USER WHERE userName=?;';
      const rows = (await this.db.query(q, [userName])).values;
      return rows?  this.rowToUser(rows[0]) : undefined;
    } catch (error) {
      showAlertError('DataBaseService.findUserByEmail', error);
      return undefined;
    }
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    try {
      const q = 'SELECT * FROM USER WHERE email=?;';
      const rows = (await this.db.query(q, [email])).values;
      return rows? this.rowToUser(rows[0]) : undefined;
    } catch (error) {
      showAlertError('DataBaseService.findUserByEmail', error);
      return undefined;
    }
  }

  private rowToUser(row: any): User {
    try {
      const user = new User();
      user.userName = row.userName;
      user.email = row.email;
      user.password = row.password;
      user.secretQuestion = row.secretQuestion;
      user.secretAnswer = row.secretAnswer;
      user.firstName = row.firstName;
      user.lastName = row.lastName;
      user.educationalLevel = EducationalLevel.findLevel(row.educationalLevel) || new EducationalLevel();
      user.dateOfBirth = convertStringToDate(row.dateOfBirth);
      user.address = row.address;
      return user;
    } catch (error) {
      showAlertError('DataBaseService.rowToUser', error);
      return new User();
    }
  }

  



}

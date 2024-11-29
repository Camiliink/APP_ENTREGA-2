import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user'; 
import { DatabaseService } from 'src/app/services/database.service';
import { showToast } from 'src/app/tools/message-functions';
import { EducationalLevel } from 'src/app/model/educational-level'; // Adjust the path as necessary
import { AuthService } from 'src/app/services/auth.service';
import { IonicModule, IonInput, IonButton, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonTextarea, IonGrid, IonRow, IonCol, IonIcon, IonCardContent, IonFab, IonFabButton, IonFabList } from '@ionic/angular'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DatePickerComponent } from '../date-picker/date-picker.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    DatePickerComponent
  ]
})
export class UsuariosComponent implements OnInit {
  usuarios: User[] = [];
  usuario: User = new User();
  educationalLevels: EducationalLevel[] = EducationalLevel.getLevels();
  repetirPassword: string = '';
  esAdmin: boolean = false; // Indica si el usuario actual es administrador

  constructor(private databaseService: DatabaseService, private authService: AuthService) {}

  async ngOnInit() {
    this.esAdmin = await this.authService.esAdmin(); // Determina si el usuario es administrador
    if (this.esAdmin) {
      this.cargarUsuarios(); // Cargar usuarios solo si es administrador
    }
  }

  async cargarUsuarios() {
    this.usuarios = await this.databaseService.readUsers();
  }

  contrasenasCoinciden(): boolean {
    return this.usuario.password === this.repetirPassword;
  }

  async crearUsuario() {
    if (!this.contrasenasCoinciden()) {
      showToast('Las contraseñas no coinciden');
      return;
    }
    if (this.usuario.firstName && this.usuario.lastName && this.usuario.email) {
      await this.databaseService.saveUser(this.usuario);
      showToast('Usuario creado correctamente');
      this.usuario = new User();
      this.repetirPassword = '';
      this.cargarUsuarios();
    } else {
      showToast('Por favor, complete todos los campos requeridos');
    }
  }

  async eliminarUsuario(email: string) {
    try {
      await this.databaseService.deleteByUserEmail(email);
      showToast('Usuario eliminado correctamente');
      this.cargarUsuarios();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      showToast('Hubo un error al intentar eliminar el usuario');
    }
  }
}

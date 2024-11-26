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
  usuarios: User[] = [];  // Lista de usuarios
  usuario: User = new User();  // Usuario vacío para crear uno nuevo

  educationalLevels: EducationalLevel[] = EducationalLevel.getLevels();
  repetirPassword: string = ''; // Campo adicional para repetir contraseña

  constructor(private databaseService: DatabaseService) {}

  ngOnInit() {
    this.cargarUsuarios();  // Cargar la lista de usuarios al iniciar el componente
  }

  // Método para cargar la lista de usuarios desde la base de datos
  async cargarUsuarios() {
    this.usuarios = await this.databaseService.readUsers();  // Obtiene los usuarios de la base de datos
  }

 // Valida si las contraseñas coinciden
contrasenasCoinciden(): boolean {
  return this.usuario.password === this.repetirPassword;
}

// Modifica el método para evitar guardar si las contraseñas no coinciden
async crearUsuario() {
  if (!this.contrasenasCoinciden()) {
    showToast('Las contraseñas no coinciden');
    return;
  }
  if (this.usuario.firstName && this.usuario.lastName && this.usuario.email) {
    await this.databaseService.saveUser(this.usuario);
    showToast('Usuario creado correctamente');
    this.usuario = new User();
    this.repetirPassword = ''; // Reinicia el campo de repetir contraseña
    this.cargarUsuarios();
  } else {
    showToast('Por favor, complete todos los campos requeridos');
  }
}

  // Método para eliminar un usuario
  async eliminarUsuario(email: string) {
    try {
      await this.databaseService.deleteByUserEmail(email); // Cambia este método si es necesario
      showToast('Usuario eliminado correctamente');
      this.cargarUsuarios(); // Recarga la lista actualizada
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      showToast('Hubo un error al intentar eliminar el usuario');
    }
}
}
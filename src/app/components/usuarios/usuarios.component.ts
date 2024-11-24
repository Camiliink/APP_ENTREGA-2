import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user'; 
import { DatabaseService } from 'src/app/services/database.service';
import { showToast } from 'src/app/tools/message-functions';
import { AuthService } from 'src/app/services/auth.service';
import { IonicModule, IonInput, IonButton, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonTextarea, IonGrid, IonRow, IonCol, IonIcon, IonCardContent, IonFab, IonFabButton, IonFabList } from '@ionic/angular'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule
  ]
})
export class UsuariosComponent implements OnInit {
  usuarios: User[] = [];  // Lista de usuarios
  usuario: User = new User();  // Usuario vacío para crear uno nuevo

  constructor(private databaseService: DatabaseService) {}

  ngOnInit() {
    this.cargarUsuarios();  // Cargar la lista de usuarios al iniciar el componente
  }

  // Método para cargar la lista de usuarios desde la base de datos
  async cargarUsuarios() {
    this.usuarios = await this.databaseService.readUsers();  // Obtiene los usuarios de la base de datos
  }

  // Método para crear un nuevo usuario
  async crearUsuario() {
    if (this.usuario.firstName && this.usuario.lastName && this.usuario.email) {
      await this.databaseService.saveUser(this.usuario);  // Guarda el usuario en la base de datos
      showToast('Usuario creado correctamente');
      this.usuario = new User();  // Reinicia el formulario
      this.cargarUsuarios();  // Recarga la lista de usuarios
    } else {
      showToast('Por favor, complete todos los campos requeridos');
    }
  }

  // Método para eliminar un usuario
  async eliminarUsuario(id: string) {
    await this.databaseService.deleteByUserName( this.usuario.email);  // Elimina el usuario de la base de datos
    showToast('Usuario eliminado correctamente');
    this.cargarUsuarios();  // Recarga la lista de usuarios
  }
}
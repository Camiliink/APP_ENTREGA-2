import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonIcon, 
  IonFab, 
  IonFabButton 
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosComponent } from 'src/app/components/usuarios/usuarios.component'; // Ruta ajustada para el componente Usuarios
import { addIcons } from 'ionicons'; // Importación para íconos
import { logOutOutline } from 'ionicons/icons'; // Importación del ícono de cerrar sesión
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-registrarme',
  templateUrl: './registrarme.page.html',
  styleUrls: ['./registrarme.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonIcon,
    IonFab,
    IonFabButton, // Agregado para soportar fab-button
    UsuariosComponent, // Importa UsuariosComponent aquí
    TranslateModule
  ]
})
export class RegistrarmePage implements OnInit {

  constructor(private authService: AuthService) { 
    // Registrar el ícono de logout
    addIcons({ logOutOutline });
  }

  ngOnInit() {}

  logout() {
    this.authService.logout(); // Lógica de cierre de sesión
    console.log('Sesión cerrada');
  }
}

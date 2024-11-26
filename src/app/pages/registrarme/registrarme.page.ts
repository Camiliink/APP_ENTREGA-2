import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { UsuariosComponent } from 'src/app/components/usuarios/usuarios.component'; // Ruta ajustada para el componente Usuarios

@Component({
  selector: 'app-registrarme',
  templateUrl: './registrarme.page.html',
  styleUrls: ['./registrarme.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    UsuariosComponent // Importa UsuariosComponent aquí
  ]
})
export class RegistrarmePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

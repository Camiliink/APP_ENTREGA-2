import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCardHeader, IonItem, IonCard } from '@ionic/angular/standalone';
import { NavController, IonicModule } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-correcto',
  templateUrl: './correcto.page.html',
  styleUrls: ['./correcto.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class CorrectoPage implements OnInit {
  email: string = '';
  nombre: string = '';
  apellido: string = '';
  contrasenna: string = '';

  constructor(
    private navCtrl: NavController,
    private dbService: DatabaseService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    // Recuperar el email de los parámetros de la ruta
    this.activatedRoute.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.obtenerNombreYApellido();
    });
  }

  async obtenerNombreYApellido() {
    // Buscar al usuario por correo electrónico
    const user = await this.dbService.findUserByEmail(this.email);
    if (user) {
      this.nombre = user.firstName ;
      this.apellido = user.lastName ; 
      this.contrasenna = user.password;
    }
  }
}

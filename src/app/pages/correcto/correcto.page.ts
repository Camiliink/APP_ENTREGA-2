import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController, IonicModule } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-correcto',
  templateUrl: './correcto.page.html',
  styleUrls: ['./correcto.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule,TranslateModule]
})
export class CorrectoPage implements OnInit {
  email: string = '';
  nombre: string = '';
  apellido: string = '';
  contrasenna: string = '';

  constructor(
    private navCtrl: NavController,
    private dbService: DatabaseService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
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

  logout() {
    this.authService.logout();
  }

}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController, IonicModule } from '@ionic/angular'; // Importamos IonicModule
import { DatabaseService } from 'src/app/services/database.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.page.html',
  styleUrls: ['./pregunta.page.scss'],
  standalone: true,
  imports: [
    IonicModule,  // Importamos IonicModule, que ya incluye los componentes de Ionic necesarios
    CommonModule,
    FormsModule,
    TranslateModule
  ]
})
export class PreguntaPage implements OnInit {
  email: string = '';
  pregunta: string = '';
  respuesta: string = '';
  isAnswerInvalid: boolean = false;

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
      this.obtenerPreguntaSecreta();
    });
  }

  async obtenerPreguntaSecreta() {
    // Buscar al usuario por correo electrónico
    const user = await this.dbService.findUserByEmail(this.email);
    if (user) {
      this.pregunta = user.secretQuestion; // Mostrar la pregunta secreta
    }
  }

  async verificarRespuesta() {
    // Buscar al usuario y verificar si la respuesta es correcta
    const user = await this.dbService.findUserByEmail(this.email);
    if (user && this.respuesta === user.secretAnswer) {
      // Respuesta correcta, redirigir a la página de "correcto"
      this.navCtrl.navigateForward(`/correcto?email=${this.email}`);
    } else {
      this.isAnswerInvalid = true;
      // Respuesta incorrecta, redirigir a la página de "incorrecto"
      this.navCtrl.navigateForward('/incorrecto');
    }
  }

  logout() {
    this.authService.logout();
  }
}

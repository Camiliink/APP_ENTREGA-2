import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController, IonicModule } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CorreoPage implements OnInit {
  email: string = '';
  isEmailInvalid: boolean = false; // Bandera para verificar si el correo es inválido

  // Expresión regular más estricta para verificar el formato del correo
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zAZ]{2,}$/;

  constructor(
    private navCtrl: NavController,
    private dbService: DatabaseService
  ) {}

  ngOnInit() {}

  // Método para validar el formato del correo y su existencia en la base de datos
  async goToSecretQuestion() {
    // Validación del campo vacío
    if (!this.email) {
      this.isEmailInvalid = true;
      return;
    }

    // Validación del formato del correo
    if (!this.emailRegex.test(this.email)) {
      // Redirigir a la página "incorrecto" si el formato no es válido
      this.navCtrl.navigateForward('/incorrecto');
      return;
    }

    // Verificación del correo en la base de datos
    const user = await this.dbService.findUserByEmail(this.email);
    if (user) {
      this.isEmailInvalid = false;
      this.navCtrl.navigateForward(`/pregunta?email=${this.email}`);
    } else {
      this.isEmailInvalid = false;
      this.navCtrl.navigateRoot('/ingresar'); // Redirige siempre a la página de inicio de sesión
    }
  }

  // Método para redirigir siempre a la página de inicio de sesión
  goBack() {
    this.navCtrl.navigateRoot('/ingresar'); // Redirige siempre a la página de inicio de sesión
  }
}

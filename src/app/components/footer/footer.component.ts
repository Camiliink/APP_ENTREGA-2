import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { addIcons } from 'ionicons';
import { homeOutline, qrCodeOutline, pencilOutline, personOutline, bookOutline, peopleOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonFooter, IonToolbar, IonSegment, IonSegmentButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,    // Permite usar directivas comunes de Angular
    FormsModule,     // Permite usar formularios
    TranslateModule, // Permite usar pipe 'translate'
    IonFooter, IonToolbar, IonSegment, IonSegmentButton, IonIcon
  ]
})
export class FooterComponent implements OnInit, OnDestroy {

  usuario: any = {};  // El objeto usuario, que será dinámico y puede tener propiedades diferentes
  private authUserSubs!: Subscription;
  selectedButton = 'welcome'; // Valor del botón seleccionado
  @Output() footerClick = new EventEmitter<string>();

  constructor(private auth: AuthService) { 
    // Registrar los íconos de Ionicons
    addIcons({
      homeOutline,
      qrCodeOutline,
      pencilOutline,
      personOutline,
      bookOutline,
      peopleOutline
    });
  }

  ngOnInit() {
    // Suscripción al observable de usuario
    this.authUserSubs = this.auth.authUser.subscribe(usuario => {
      this.usuario = usuario || {};  // Si no hay usuario, asignar un objeto vacío
      console.log('Usuario actual:', this.usuario);  // Verifica el valor del usuario
    });
  }

  ngOnDestroy() {
    // Cancelar la suscripción cuando el componente sea destruido
    if (this.authUserSubs) {
      this.authUserSubs.unsubscribe();
    }
  }

  // Emitir el evento al seleccionar un botón
  sendClickEvent($event: any) {
    this.footerClick.emit(this.selectedButton);
  }
}

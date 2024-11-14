import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule, NavController } from '@ionic/angular';
import { logOutOutline, qrCodeOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule
  ]
})
export class HeaderComponent implements OnChanges {

  @Output() headerClick = new EventEmitter<string>();
  @Input() colorTheme: string = 'light'; // Recibir el color del tema desde un componente padre

  constructor(
    private navCtrl: NavController,
    private authService: AuthService
  ) {
    addIcons({ logOutOutline, qrCodeOutline });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['colorTheme']) {
      this.colorTheme = changes['colorTheme'].currentValue; // Actualizar el tema si cambia
    }
  }

  sendClickEvent(buttonName: string) {
    this.headerClick.emit(buttonName);
  }

  logout() {
    this.authService.logout();
  }
}

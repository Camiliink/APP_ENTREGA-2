import { Component, ViewChild } from '@angular/core';
import { DinosaurComponent } from 'src/app/components/dinosaur/dinosaur.component';
import { AuthService } from 'src/app/services/auth.service';
import { IonContent } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { QrWebScannerComponent } from 'src/app/components/qr-web-scanner/qr-web-scanner.component';
import { Capacitor } from '@capacitor/core';
import { ScannerService } from 'src/app/services/scanner.service';
import { WelcomeComponent } from 'src/app/components/welcome/welcome.component';
import { ForumComponent } from 'src/app/components/forum/forum.component';
import { Asistencia } from 'src/app/model/asistencia';
import { ForoComponent } from "src/app/components/foro/foro.component";
import { MisdatosComponent} from "src/app/components/misdatos/misdatos.component";
import { MiclaseComponent } from "src/app/components/miclase/miclase.component";
import { CodigoQrComponent } from "../../components/codigoqr/codigoqr.component";

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonContent,
    HeaderComponent,
    FooterComponent,
    WelcomeComponent,
    QrWebScannerComponent,
    DinosaurComponent,
    ForumComponent,
    ForoComponent,
    MisdatosComponent,
    MiclaseComponent,
    CodigoQrComponent
]
})
export class InicioPage {
  
  @ViewChild(FooterComponent) footer!: FooterComponent;
  selectedComponent = 'codigoqr';

  constructor(private auth: AuthService, private scanner: ScannerService) { }

  ionViewWillEnter() {
    this.changeComponent('codigoqr');
  }

  // Maneja la interacción con el header
  async headerClick(button: string) {
    if (button === 'testqr') {
      this.showMiclaseComponent(Asistencia.jsonAsisExample);
    }

    if (button === 'scan') {
      if (Capacitor.getPlatform() === 'web') {
        this.selectedComponent = 'codigoqr';  // Muestra el componente de QR en la web
      } else {
        this.showMiclaseComponent(await this.scanner.scan());  // Escanea QR en dispositivos móviles
      }
    }
  }

  // Maneja cuando un QR es escaneado en la web
  webQrScanned(qr: string) {
    this.showMiclaseComponent(qr);
  }

  // Maneja cuando el escaneo de QR se detiene
  webQrStopped() {
    this.changeComponent('codigoqr');
  }

  // Muestra el componente de Mi Clase si el código QR es válido
  showMiclaseComponent(qr: string) {
    if (Asistencia.isValidAsistenciaQrCode(qr)) {
      this.auth.qrCodeData.next(qr);
      this.changeComponent('asis');  // Muestra el componente de asistencia
      return;
    }
    
    this.changeComponent('codigoqr');  // Si el QR no es válido, vuelve a mostrar el escáner
  }
  footerClick(button: string) {
    this.selectedComponent = button;
  }

  changeComponent(name: string) {
    this.selectedComponent = name;
    this.footer.selectedButton = name;
  }

}
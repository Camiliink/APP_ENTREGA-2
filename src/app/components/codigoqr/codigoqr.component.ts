import { CommonModule } from '@angular/common';
import { Component, ElementRef, Output, ViewChild, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, Platform } from '@ionic/angular';
import { EventEmitter } from '@angular/core';
import jsQR, { QRCode } from 'jsqr';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { ScannerService } from 'src/app/services/scanner.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-codigoqr',
  templateUrl: './codigoqr.component.html',
  styleUrls: ['./codigoqr.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule],
})
export class CodigoQrComponent implements OnDestroy {

  @ViewChild('video', { static: false }) private video!: ElementRef;
  @ViewChild('canvas', { static: false }) private canvas!: ElementRef;
  @Output() scanned: EventEmitter<string> = new EventEmitter<string>();
  @Output() stopped: EventEmitter<void> = new EventEmitter<void>();

  qrData: string = '';
  mediaStream: MediaStream | null = null; // Almacena el flujo de medios
  user: User = new User();

  constructor(
    private auth: AuthService, 
    private platform: Platform, 
    private scannerService: ScannerService
  ) { 
    this.auth.authUser.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });

    // Detecta si está en un dispositivo móvil
    if (this.platform.is('mobile') || this.platform.is('hybrid')) {
      this.startMobileQrScanning();
    } else {
      this.startQrScanningForWeb();
    }
  }

  // Método para dispositivos móviles usando ScannerService
  async startMobileQrScanning() {
    try {
      const scanResult = await this.scannerService.scan();
      if (scanResult) {
        this.qrData = scanResult;
        this.scanned.emit(scanResult);
      }
    } catch (error) {
      console.error('Error al escanear en móvil:', error);
    }
  }

  // Método para escaneo en la web usando jsQR
  async startQrScanningForWeb() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      this.video.nativeElement.srcObject = this.mediaStream;
      this.video.nativeElement.setAttribute('playsinline', 'true');
      this.video.nativeElement.play();
      requestAnimationFrame(this.verifyVideo.bind(this));
    } catch (error) {
      console.error('Error al iniciar la cámara para la web:', error);
    }
  }

  // Verificación continua del video en la web para detectar el QR
  async verifyVideo() {
    if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
      if (this.getQrData()) return;
      requestAnimationFrame(this.verifyVideo.bind(this));
    } else {
      requestAnimationFrame(this.verifyVideo.bind(this));
    }
  }

  // Método para obtener datos de QR en la web
  getQrData(): boolean {
    const w: number = this.video.nativeElement.videoWidth;
    const h: number = this.video.nativeElement.videoHeight;
    this.canvas.nativeElement.width = w;
    this.canvas.nativeElement.height = h;
    const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
    context.drawImage(this.video.nativeElement, 0, 0, w, h);
    const img: ImageData = context.getImageData(0, 0, w, h);
    let qrCode: QRCode | null = jsQR(img.data, w, h, { inversionAttempts: 'dontInvert' });
    if (qrCode) {
      const data = qrCode.data;
      if (data !== '') {
        this.stopCamera();
        this.scanned.emit(qrCode.data);
        return true;
      }
    }
    return false;
  }

  // Método para detener el escaneo en la web
  stopQrScanning(): void {
    this.stopCamera();
    this.stopped.emit();
  }

  // Método para detener la cámara
  stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop()); // Detén todas las pistas de video
      this.mediaStream = null; // Limpia el flujo de medios
    }
  }

  ngOnDestroy() {
    this.stopCamera();
  }
}

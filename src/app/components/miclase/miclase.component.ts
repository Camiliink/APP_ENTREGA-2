import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service'; // Adjust the path as necessary
import { Subscription } from 'rxjs';
import { IonContent, IonGrid, IonRow, IonCol } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-miclase',
  templateUrl: './miclase.component.html',
  styleUrls: ['./miclase.component.scss'],
  standalone: true,
  imports: [IonContent, IonGrid, IonRow, IonCol, CommonModule, FormsModule]
})
export class MiclaseComponent  implements OnDestroy {
  asis: any;
  private subscription: Subscription;

  constructor(private authService: AuthService) { 
    this.subscription = this.authService.qrCodeData.subscribe((qr) => {
      this.asis = qr? JSON.parse(qr): null;
    })
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

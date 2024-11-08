import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { User } from 'src/app/model/user'; // Asegúrate de que el path sea correcto
import { IonInput, IonButton, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,IonTextarea,IonGrid,IonRow,IonCol,IonIcon,IonCardContent, IonFab, IonFabButton, IonFabList} from '@ionic/angular/standalone'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { showToast } from 'src/app/tools/message-functions';


@Component({
  selector: 'app-misdatos',
  templateUrl: './misdatos.component.html',
  styleUrls: ['./misdatos.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonItem, IonLabel, IonInput, IonTextarea, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonContent, IonCardContent, IonFab, IonFabButton, IonFabList,  CommonModule, FormsModule]
})
export class MisdatosComponent implements OnInit {
  usuario: User; 
  selectedImage: string | ArrayBuffer | null = null;

  constructor(private authService: AuthService) {
    this.usuario = new User(); 
  }

  async ngOnInit() {
    const usuarioAlmacenado = await this.authService.readAuthUser();
    this.usuario = usuarioAlmacenado || new User(); 
  }

  async guardarDatos() {
    await this.authService.saveAuthUser(this.usuario); 
    showToast('Datos guardados correctamente');
  }
}






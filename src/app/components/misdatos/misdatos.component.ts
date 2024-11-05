import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/model/user'; // Asegúrate de que el path sea correcto
import { IonInput, IonButton, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,IonTextarea,IonGrid,IonRow,IonCol,IonIcon,IonCardContent, IonFab, IonFabButton, IonFabList} from '@ionic/angular/standalone'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-misdatos',
  templateUrl: './misdatos.component.html',
  styleUrls: ['./misdatos.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonItem, IonLabel, IonInput, IonTextarea, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonContent, IonCardContent, IonFab, IonFabButton, IonFabList,  CommonModule, FormsModule]
})
export class MisdatosComponent implements OnInit {
  usuario: User; // Cambiado a User
  selectedImage: string | ArrayBuffer | null = null;

  constructor(private authService: AuthService) {
    this.usuario = new User(); // Inicializar el usuario
  }

  async ngOnInit() {
    const usuarioAlmacenado = await this.authService.readAuthUser(); // Asegúrate de que este método exista y retorne User o null
    this.usuario = usuarioAlmacenado || new User(); // Cargar datos del usuario
  }

  async guardarDatos() {
    await this.authService.saveAuthUser(this.usuario); // Guarda el usuario en el servicio
    // Aquí puedes agregar lógica adicional, como mostrar un mensaje de éxito
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result; // Muestra la imagen en miniatura
      };
      reader.readAsDataURL(file);
    }
  }
}






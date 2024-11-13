import { DatabaseService } from './../../services/database.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/model/user'; 
import { IonInput, IonButton, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonTextarea, IonGrid, IonRow, IonCol, IonIcon, IonCardContent, IonFab, IonFabButton, IonFabList } from '@ionic/angular/standalone'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { showToast } from 'src/app/tools/message-functions';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-misdatos',
  templateUrl: './misdatos.component.html',
  styleUrls: ['./misdatos.component.scss'],
  standalone: true,
  imports: [IonHeader, TranslateModule, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonItem, IonLabel, IonInput, IonTextarea, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonContent, IonCardContent, IonFab, IonFabButton, IonFabList, CommonModule, FormsModule]
})
export class MisdatosComponent implements OnInit {
  usuario: User; 
  selectedImage: string | ArrayBuffer | null = null;
  dateOfBirth: string = ''; // Aquí solo lo usaremos para mostrarlo como string en el HTML

  constructor(private authService: AuthService, private databaseService: DatabaseService) {
    this.usuario = new User(); 
  }

  async ngOnInit() {
    const usuarioAlmacenado = await this.authService.readAuthUser();
    this.usuario = usuarioAlmacenado || new User();
  
    // Verifica si dateOfBirth es un string y lo convierte a Date
    if (this.usuario.dateOfBirth && typeof this.usuario.dateOfBirth === 'string') {
      this.usuario.dateOfBirth = new Date(this.usuario.dateOfBirth);  // Convierte el string a Date
    }
  
    // Ahora convierte la fecha a string para visualización (para el HTML)
    if (this.usuario.dateOfBirth) {
      this.dateOfBirth = this.convertDateToString(this.usuario.dateOfBirth);
    }
  }

  // Función para convertir la fecha a formato dd/mm/yyyy
  convertDateToString(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2); // Añade el 0 al día si es menor a 10
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Los meses van de 0 a 11, así que sumamos 1
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  // Función para convertir la fecha a formato ISO (yyyy-mm-dd) para guardarla en la base de datos
  convertDateToISOString(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  async guardarDatos() {
    // Asegurarse de que dateOfBirth sea un objeto Date antes de convertirlo
    if (this.usuario.dateOfBirth && typeof this.usuario.dateOfBirth === 'string') {
      this.usuario.dateOfBirth = new Date(this.usuario.dateOfBirth); // Convertir a Date si es un string
    }
  
    // Asegurarse de que dateOfBirth esté en formato Date antes de convertirlo a ISO string
    if (this.usuario.dateOfBirth instanceof Date) {
      const isoString = this.convertDateToISOString(this.usuario.dateOfBirth);
      this.usuario.dateOfBirth = new Date(isoString);  // Guardar la fecha como un objeto Date
    }
  
    await this.databaseService.saveUser(this.usuario); 
    showToast('Datos guardados correctamente');
  }
  
}

import { DatabaseService } from './../../services/database.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/model/user'; 
import { IonInput, IonButton, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonTextarea, IonGrid, IonRow, IonCol, IonIcon, IonCardContent, IonFab, IonFabButton, IonFabList, IonSelect, IonSelectOption } from '@ionic/angular/standalone'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { showToast } from 'src/app/tools/message-functions';
import { TranslateModule } from '@ngx-translate/core';
import { DatePickerComponent } from 'src/app/components/date-picker/date-picker.component';
import { EducationalLevel } from 'src/app/model/educational-level';

@Component({
  selector: 'app-misdatos',
  templateUrl: './misdatos.component.html',
  styleUrls: ['./misdatos.component.scss'],
  standalone: true,
  imports: [IonHeader, TranslateModule, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonItem, IonLabel, IonInput, IonTextarea, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonContent,
     IonCardContent, IonFab, IonFabButton, IonFabList, CommonModule, FormsModule, DatePickerComponent, IonSelect, IonSelectOption]
})
export class MisdatosComponent implements OnInit {
  usuario: User;
  selectedImage: string | ArrayBuffer | null = null;
  dateOfBirth: string = '';
  users: User[] = [];
  educationalLevels: EducationalLevel[] = [];

  constructor(private authService: AuthService, private databaseService: DatabaseService) {
    this.usuario = new User();
  }

  ngOnInit() {
    this.educationalLevels = EducationalLevel.getLevels();
  
    this.authService.readAuthUser().then((usuario) => {
      this.usuario = usuario ? usuario : new User();
      
      // Asegura que el nivel educacional esté siempre definido.
      if (!this.usuario.educationalLevel) {
        this.usuario.educationalLevel = EducationalLevel.getLevels()[0]; // Asignar el primer nivel por defecto
      } else {
        if (typeof this.usuario.educationalLevel === 'number') {
          this.usuario.educationalLevel = EducationalLevel.findLevel(this.usuario.educationalLevel) || EducationalLevel.getLevels()[0];
        }
      }
    });
  }

  compareEducationalLevels(e1: EducationalLevel, e2: EducationalLevel): boolean {
    return e1 && e2 ? e1.id === e2.id : e1 === e2;
  }

  async guardarDatos() {
    // Asegura que la fecha de nacimiento esté en el formato correcto
    if (this.usuario.dateOfBirth && typeof this.usuario.dateOfBirth === 'string') {
      this.usuario.dateOfBirth = new Date(this.usuario.dateOfBirth);
    }

    if (this.usuario.dateOfBirth instanceof Date) {
      const isoString = this.convertDateToISOString(this.usuario.dateOfBirth);
      this.usuario.dateOfBirth = new Date(isoString);
    }

    // Verificar si el nivel educativo es válido antes de guardarlo
    if (!this.usuario.educationalLevel || !this.usuario.educationalLevel.id) {
      this.usuario.educationalLevel = EducationalLevel.getLevels()[0];  // Asignar valor predeterminado si no hay nivel
    }

    const educationalLevelId = this.usuario.educationalLevel ? this.usuario.educationalLevel.id : EducationalLevel.getLevels()[0].id;

    try {
      // Guardar usuario en la base de datos
      await this.databaseService.saveUser(this.usuario);
      await this.authService.saveAuthUser(this.usuario);
      showToast('Datos guardados correctamente');
    } catch (error) {
      showToast('Error al guardar los datos');
      console.error(error);
    }
  }

  // Método convertDateToISOString: convertir la fecha a formato ISO
  convertDateToISOString(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);  // Asegura que el mes tenga dos dígitos
    const day = ('0' + date.getDate()).slice(-2);  // Asegura que el día tenga dos dígitos
    return `${year}-${month}-${day}`;  // Devuelve la fecha en formato YYYY-MM-DD
  }
}


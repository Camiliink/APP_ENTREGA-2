import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './services/database.service'; // Asegúrate de importar el servicio


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
    this.initializeDataBase();
  }

  async initializeDataBase() {
    try {
      await this.databaseService.initializeDataBase(); // Llama a tu servicio para inicializar la base de datos
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

}

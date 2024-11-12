import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { GeoService } from 'src/app/services/geo.service';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    HeaderComponent,
    FooterComponent,
  ]
})
export class MapPage implements OnInit {

  map: L.Map | null = null;
  addressName: string = '';
  distance: number = 0; // Cambié el tipo de distancia a number para almacenar solo el valor
  duration: number = 0; // Nueva variable para almacenar la duración

  constructor(
    private geo: GeoService, 
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMap();
    this.fixLeafletIconPath();
  }

  async loadMap() {
    await this.geo.getCurrentPosition().then((position: { lat: number, lng: number } | null) => {
      if (position) {
        this.map = L.map('mapId').setView([position.lat, position.lng], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        
        this.goToMyPosition();
      } else {
        console.log('Unknown geographical position');
      }
    }).catch((error) => {
      console.log('Error getting geographical position:', error);
    });
  }

  goToDUOC() {
    this.goToPosition(-33.44703, -70.65762, 15, 'Instituto DUOC Padre Alonso de Ovalle');
  }

  async goToMyPosition() {
    this.geo.getCurrentPosition().then((position: { lat: number, lng: number } | null) => {
      if (position) {
        this.goToPosition(position.lat, position.lng, 15, 'My location');
      }
    });
  }

  goToPosition(lat: number, lng: number, zoom: number, popupText: string) {
    if (this.map) {
      this.map.setView([lat, lng], zoom);
      const marker = L.marker([lat, lng]).addTo(this.map);
      marker.bindPopup(popupText).openPopup();
    }
  }

  async getMyAddress(lat: number, lng: number) {
    this.geo.getPlaceFromCoordinates(lat, lng).subscribe({
      next: (value: any) => {
        this.addressName = value.display_name;
      },
      error: (error: any) => {
        console.log('Error getting address:', error);
        this.addressName = '';
      }
    });
  }

  showRouteToDuoc() {
    this.geo.getCurrentPosition().then((position: { lat: number, lng: number } | null) => {
      if (position) {
        this.goToPosition(position.lat, position.lng, 15, 'My location');
        this.getRoute({ lat: position.lat, lng: position.lng }, { lat: -33.44703, lng: -70.65762 }, 'walking');
      }
    });
  }

  getRoute(start: { lat: number, lng: number }, end: { lat: number, lng: number }, mode: 'driving' | 'walking') {
    const url = `https://router.project-osrm.org/route/v1/${mode}/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
    console.log('Route URL:', url);
  
    this.http.get(url).subscribe((response: any) => {
      if (this.map) {
        const routeCoords = response.routes[0].geometry.coordinates;
        const routeLatLngs = routeCoords.map((coord: [number, number]) => [coord[1], coord[0]]);
  
        const routeLine = L.polyline(routeLatLngs, { color: 'blue', weight: 5 }).addTo(this.map);
        this.map.fitBounds(routeLine.getBounds());
  
        // Almacena solo los valores de distancia y duración
        this.distance = response.routes[0].distance / 1000; // Distancia en kilómetros
        this.duration = response.routes[0].duration / 60;   // Duración en minutos
      }
    });
  }

  fixLeafletIconPath() {
    const iconDefault = L.icon({
      iconUrl: 'assets/leaflet/images/marker-icon.png',
      shadowUrl: 'assets/leaflet/images/marker-shadow.png',
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  navigateToMyData() {
    this.router.navigate(['/my-data']);
  }
}

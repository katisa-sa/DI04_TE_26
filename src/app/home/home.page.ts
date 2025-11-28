import { Component } from '@angular/core';
import { GestionApi } from '../services/gestion-api';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  backgroundColorCat: string[] = ['rgba(255, 99, 132, 0.2)','rgba(255, 159, 64, 0.2)','rgba(255, 205, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(54, 162, 235, 0.2)','rgba(153, 102, 255, 0.2)','rgba(201, 203, 207, 0.2)'];
  borderColorCat: string[] =['rgb(255, 99, 132)','rgb(255, 159, 64)','rgb(255, 205, 86)','rgb(75, 192, 192)','rgb(54, 162, 235)','rgb(153, 102, 255)','rgb(201, 203, 207)'];
  categorias: string[] = ["business","entertainment","general","technology","health","science","sports"];
  //Inicializamos la variable con el valor por defecto "bar-chart"
  tipoDeChartSeleccionado: string = "bart-chart";
  
  
  
  constructor( private gestionServiceApi: GestionApi) {}

    ngOnInit() {
    //Mediante el array de categorias, llamamos a la API una vez por cada categoría.
    this.categorias.forEach(categoria => {
      this.gestionServiceApi.cargarCategoria(categoria);
    });
  }

    segmentChanged(event: any) {
    
    this.tipoDeChartSeleccionado = event.detail.value;
    this.categorias.forEach(categoria => {
      this.gestionServiceApi.cargarCategoria(categoria);
    });
  }
}

import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { GestionApi } from 'src/app/services/gestion-api';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
  standalone: false
})
export class PieChartComponent  implements OnInit {

  //Pasamos solo el valor de los colores de fondo desde la page home.
  @Input() backgroundColorCat: string[] = [];
  
   // Atributo que almacena los datos del chart
  public chart!: Chart;

   //Crearemos un objeto para poder mostrar los valores de categoria y totalResults que se recibiran desde la api  public apiData: { categoria: string; totalResults: number }[] = [];
  public apiData: { categoria: string; totalResults: number }[] = [];

  constructor(private el: ElementRef, private renderer: Renderer2, private gestionServiceApi: GestionApi) { }

  ngOnInit(): void { 
    console.log("Ejecuta pie-chart");
    this.inicializarChart();

    //Nos suscribimos al observable de tipo BehaviorSubject y cuando este emita un valor, recibiremos una notificación con el nuevo valor.
    this.gestionServiceApi.datos$.subscribe((datos) => {
      if (datos != undefined) {
        //Cuando recibimos un valor actualizamos los arrays de nombre y valor de categorias, para guardar el nombre y su valor en las mismas posiciones del array.
        this.actualizarDatosChart(datos.categoria, datos.totalResults);
        //Actualizamos el chart con los nuevos valores cada vez que recibimos un valor.
        this.actualizarChart();
      }
    });
  }

  ngOnDestroy(): void {
    this.destruirChart();
  }
  
  private inicializarChart() {
    const datasetsByCompany: { 
        data: number[]; 
        backgroundColor: string[]; 
      }[]= [];
  
      // Creamos la gráfica
    const canvas = this.renderer.createElement('canvas');
    this.renderer.setAttribute(canvas, 'id', 'pieChart');
  
    // Añadimos el canvas al div con id "ontenedor-barchart"
    const container = this.el.nativeElement.querySelector('#contenedor-piechart');
    this.renderer.appendChild(container, canvas);
  
    this.chart = new Chart(canvas, {
      type: 'pie' as ChartType, // tipo de la gráfica 
      data: {
        labels: [], // etiquetas vacías inicialmente
        datasets: datasetsByCompany, // datasets vacíos inicialmente
      }
    });
      //Ancho y alto de canvas
    this.chart.canvas.width = 100;
    this.chart.canvas.height = 100;
  }
  
  // Método para actualizar el chart con los nuevos datos
  private actualizarDatosChart(categoria: string, totalResults: number) {
    this.apiData.push({ categoria, totalResults });
  }

  private actualizarChart() {
    const datasetsByCompany: { 
      [key: string]: { 
        label: string; 
        data: number[]; 
        backgroundColor: string[]; 
     } 
    } = {};

    this.apiData.forEach((row: { categoria: string; totalResults: number }, index: number)=> {
      const categoria = row.categoria;
      const totalResults = row.totalResults;

      if (!datasetsByCompany[categoria]) {
        datasetsByCompany[categoria] = {
          label: 'Valores de ' + categoria,
          data: [],
          backgroundColor: [this.backgroundColorCat[index]]
      };
    }
      //Asociamos los valores al dataSetByCompany  
      datasetsByCompany[categoria].data[index] = totalResults;
      datasetsByCompany[categoria].backgroundColor[index] = this.backgroundColorCat[index];
    });
    
    this.chart.data.labels = [];
    
    this.apiData.forEach((row: { categoria: string; totalResults: number }) => {
      if (this.chart.data.labels){
        this.chart.data.labels.push(row.categoria);
      }
    });

    this.chart.data.datasets = Object.values(datasetsByCompany);
    this.chart.update();
  }

  destruirChart() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

}

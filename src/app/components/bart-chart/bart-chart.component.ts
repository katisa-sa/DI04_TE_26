import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { GestionApi } from 'src/app/services/gestion-api';

@Component({
  selector: 'app-bart-chart',
  templateUrl: './bart-chart.component.html',
  styleUrls: ['./bart-chart.component.scss'],
  standalone: false
})
export class BartChartComponent  implements OnInit {
  // Pasamos estos 2 valores desde la page home. 
  @Input() backgroundColorCat: string[] = [];
  @Input() borderColorCat: string[] = [];

   // Atributo que almacena los datos del chart
  public chart!: Chart;
  
  //Crearemos un objeto para poder mostrar los valores de categoria y totalResults que se recibiran desde la api  public apiData: { categoria: string; totalResults: number }[] = [];
  public apiData: { categoria: string; totalResults: number }[] = [];
  
  constructor(private el: ElementRef, private renderer: Renderer2, private gestionServiceApi: GestionApi) { }

  ngOnInit() : void {
    console.log("Ejecuta bar-chart");
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

  // Método para actualizar el chart con los nuevos datos
  private actualizarDatosChart(categoria: string, totalResults: number) {
    const datosExisten = this.apiData.find(data => data.categoria === categoria);
    if (!datosExisten) {
      // Si no existe, actualizamos el totalResults
    this.apiData.push({ categoria, totalResults });
    }
  }

  // Método para actualizar el chart con colores, texto y valores
  private actualizarChart() {
    const datasetsByCompany: { 
      [key: string]: { 
        label: string; 
        data: number[]; 
        backgroundColor: string[]; 
        borderColor: string[]; 
        borderWidth: number 
      } 
    } = {};
    this.apiData.forEach((row: { categoria: string; totalResults: number }, index: number)=> {
      const categoria = row.categoria;
      const totalResults = row.totalResults;

      if (!datasetsByCompany[categoria]) {
        datasetsByCompany[categoria] = {
          label: 'Valores de ' + categoria,
          data: [],
          backgroundColor: [this.backgroundColorCat[index]],
          borderColor: [this.borderColorCat[index]],
          borderWidth: 1
        };
      }
    //Asociamos los valores al dataSetByCompany  
    datasetsByCompany[categoria].data[index] = totalResults;
    datasetsByCompany[categoria].backgroundColor[index] = this.backgroundColorCat[index];
    datasetsByCompany[categoria].borderColor[index] = this.borderColorCat[index];
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

  private inicializarChart() {
    const datasetsByCompany: { 
        label: string; 
        data: number[]; 
        backgroundColor: string[]; 
        borderColor: string[]; 
        borderWidth: number;
      }[]= [];
  
    // Creamos la gráfica
    const canvas = this.renderer.createElement('canvas');
    this.renderer.setAttribute(canvas, 'id', 'barChart');
  
    // Añadimos el canvas al div con id "ontenedor-barchart"
    const container = this.el.nativeElement.querySelector('#contenedor-barchart');
    this.renderer.appendChild(container, canvas);
  
    this.chart = new Chart(canvas, {
      type: 'bar' as ChartType, // tipo de la gráfica 
      data: {
        labels: [], // etiquetas vacías inicialmente
        datasets: datasetsByCompany // datasets vacíos inicialmente
      }, // datos 
      options: { // opciones de la gráfica
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            labels: {
              boxWidth: 0,
              font: {
                size: 16,
                weight: 'bold'
              }
            },
          }
        },
      }
    });
    //Ancho y alto de canvas
    this.chart.canvas.width = 100;
    this.chart.canvas.height = 100;
  }


}

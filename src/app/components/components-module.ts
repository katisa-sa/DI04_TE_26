import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BartChartComponent } from './bart-chart/bart-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';



@NgModule({
  declarations: [BartChartComponent, LineChartComponent, PieChartComponent],
  imports: [
    CommonModule
  ],
  exports: [BartChartComponent, LineChartComponent, PieChartComponent]  
})
export class ComponentsModule { }

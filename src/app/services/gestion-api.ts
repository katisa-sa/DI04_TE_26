import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RespuestaNoticia } from '../interfaces/respuesta-noticia';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class GestionApi {

  private datosSubject: BehaviorSubject<{ categoria: string; totalResults: number }|undefined> = new BehaviorSubject<{ categoria: string; totalResults: number }|undefined>(undefined);
  public datos$: Observable<{ categoria: string; totalResults: number }|undefined> = this.datosSubject.asObservable();
  
  constructor(private leerArticulosServicioHttp: HttpClient) { }

  public cargarCategoria(categoria: string) {
    //Realizamos la llamada api y la recogemos en un observable de tipo RespuestaNoticias
    let respuesta: Observable<RespuestaNoticia> = this.leerArticulosServicioHttp.get<RespuestaNoticia>( environment.apiUrl + "/top-headlines?country=us&category=" + categoria + "&apiKey=" + environment.apiKey);
    console.log("respuesta: "+respuesta);
    respuesta.subscribe( data => {
      if (data && data.totalResults !== undefined) {
        //Mediante datosSubject.next, avisamos a todos los suscriptores (en este caso datos$) de que hemos recibido un nuevo valor.
        this.datosSubject.next({ categoria: categoria, totalResults: data.totalResults });
        
      } else {
        console.error('La propiedad totalResults no está definida en la respuesta:', data);
      }  
    });
  }
}

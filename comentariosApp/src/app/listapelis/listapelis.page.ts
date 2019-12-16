import { Component, OnInit, ViewChild } from '@angular/core';
import { RemoteApiService } from '../remoteapi.service';
import { NavController, LoadingController, AlertController, IonSegment, IonSlide, Platform } from '@ionic/angular';
import { Constantes } from '../constantes';
import { Login } from '../login/login';
import { Peli } from './peli';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { OpcionesCarrusel } from './opciones-carrusel';

@Component({
  selector: 'app-listapelis',
  templateUrl: './listapelis.page.html',
  styleUrls: ['./listapelis.page.scss'],
  providers: [RemoteApiService]
})
export class ListapelisPage implements OnInit {

  lista_pelis: Array<Peli>;
  login:Login;
  elementoEspera: HTMLIonLoadingElement;
  esperando: boolean;
  opciones_carrusel:OpcionesCarrusel;

  
  constructor(public platform:Platform, public servicio_remoto:RemoteApiService, public nc:NavController, public lc:LoadingController, public ac:AlertController) { 
    this.opciones_carrusel = new OpcionesCarrusel();
    let str_cred:string = window.localStorage.getItem(Constantes.CLAVE_CREDENCIALES);
    console.log ("credenciales recuperadas " + str_cred);
    this.login= JSON.parse(str_cred);

    this.platform.backButton.subscribe(() => {
     
        this.nc.navigateForward('login');
        //navigator['app'].exitApp();
      }
    );
    

  }

  ngOnInit() {
    console.log ("ngOnInit ListapelisPage");
    this.mostrarEspera();
    this.servicio_remoto.getPelis(this.login.token).subscribe(
      resp_ok => {
        let respuesta_http : HttpResponse<Array<Peli>> = resp_ok as  HttpResponse<Array<Peli>>;
        this.lista_pelis = respuesta_http.body;
        this.lista_pelis.map(peli => console.log (peli.ruta + " " +peli.idfoto + " " +peli.titulo));
        this.ocultarEspera();
      }, resp_ko => {
        console.log ("Error al recuperar la lista de películas");
        this.informarErrorPelis(<HttpErrorResponse>resp_ko);
        this.ocultarEspera();
      }
    )
  }

  cambioVista(evento) {
    console.log('Segment changed', evento.target);
    let is:IonSegment  = <IonSegment> evento.target;
    console.log (is.value);
    this.opciones_carrusel.setAnimacion(is.value);
    
  }

  public peliTocada(peli:Peli):void
  {
    console.log ("peli tocada " + peli.titulo);
    let str_peli_json : string = JSON.stringify(peli);
    window.sessionStorage.setItem(Constantes.CLAVE_PELIS, str_peli_json );
    this.nc.navigateForward('comentarios');
  }
  public async informarErrorPelis (error:HttpErrorResponse):Promise<void>
  {

    let alert : HTMLIonAlertElement = await this.ac.create({
      header: error.statusText + " " + error.status,
      message: '¡Error al recupera la lista de pelis! Inténtelo de nuevo',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            console.log('se cierra el diálogo');
          }
        }
      ]
    });

     await alert.present();
  }

  public async ocultarEspera():Promise<void> {
    console.log("ocultandoEspera  ...");
    this.esperando = false;
    //SI LA COSA TARDA BASTANTE, SE HACE DISMISS DESDE AQUÍ SE HA PRESENTADO
    if (this.elementoEspera)
    {
      console.log("La tx termina después de mostrarse el elemento ");
      await this.elementoEspera.dismiss();
  } else {
    console.log("El elemento espera NO existe");
  }
  
}

public async mostrarEspera():Promise<void> {
  this.esperando = true;
  console.log("Mostrando espera ...");
  this.elementoEspera = await this.lc.create({
    message: 'Cargando fotos del servidor'
  });
  console.log("elemento espera creado ...");
  await this.elementoEspera.present();
  console.log("elemento espera presentado ...");
  if (!this.esperando)
  {
    //SI LA COSA TARDA MUY POCO, CUANDO SE HA PRESENTADO YA HA ACABADO
    //CUANDO EL ELMENTO TERMINA DE PRESENTARSE, YA HA ACABADO :)
    console.log("esperando == false la tx ha terminado antes de mostrarse el elemento");
    await this.elementoEspera.dismiss();
  }

}


}

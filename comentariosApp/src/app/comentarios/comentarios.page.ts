import { Component, OnInit } from '@angular/core';
import { RemoteApiService } from '../remoteapi.service';
import { Peli } from '../listapelis/peli';
import { Constantes } from '../constantes';
import { LoadingController, AlertController, ToastController, IonItemSliding, IonTextarea, PopoverController, NavController, Platform } from '@ionic/angular';
import { Login } from '../login/login';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Comentario } from './comentario';
import { NuevoComentarioRequest } from './nuevo-comentario-request';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.page.html',
  styleUrls: ['./comentarios.page.scss'],
  providers: [RemoteApiService]
})
export class ComentariosPage implements OnInit {

  peli:Peli;
  login:Login;
  esperando:boolean;
  elementoEspera: HTMLIonLoadingElement;
  lista_comentarios: Array<Comentario>;



  constructor(public platform:Platform, public servicio_remoto:RemoteApiService, public lc:LoadingController, public ac:AlertController, public tc:ToastController, public nc:NavController) { 

    let peli_json:string =  window.sessionStorage.getItem(Constantes.CLAVE_PELIS);
    this.peli = JSON.parse(peli_json);
    console.log ("cargando comentarios de ..." + peli_json);

    let crendeciales:string =  window.localStorage.getItem(Constantes.CLAVE_CREDENCIALES);
    this.login = JSON.parse(crendeciales);
    console.log ("crendeciales ..." + crendeciales);
  
  }


  ngOnInit() {
    console.log ("obteniendo comentarios ...");
    this.mostrarEspera("Obteniendo comentarios");
    this.servicio_remoto.getComentariosPeli(this.login.token, this.peli.idfoto).subscribe(
      resp_ok => {
        let respuesta_http : HttpResponse<Array<Comentario>> = resp_ok as  HttpResponse<Array<Comentario>>;
        if (respuesta_http.status==200)
        {
          this.lista_comentarios = respuesta_http.body;
          this.lista_comentarios.map(comentario => console.log (comentario.texto + " " +comentario.id + " " +comentario.autor + " " +comentario.momento));
        } else if (respuesta_http.status==204)
        {
          console.log ("Pelicula sin comentarios");
          //this.informarPeliSinComentarios();
        }
        this.ocultarEspera();
      }, resp_ko => {
        console.log ("Error al recuperar la lista de comentarios");
        //this.informarErrorComentarios(<HttpErrorResponse>resp_ko);
        this.ocultarEspera();
      }
    );
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

public async mostrarEspera(mensaje:string):Promise<void> {
  this.esperando = true;
  console.log("Mostrando espera ...");
  this.elementoEspera = await this.lc.create({
    message: mensaje
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

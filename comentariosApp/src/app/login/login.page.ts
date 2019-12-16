import { Component, OnInit } from '@angular/core';
import { Login } from './login';
import { RemoteApiService } from '../remoteapi.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { Constantes } from '../constantes';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: [RemoteApiService]
})
export class LoginPage implements OnInit {

  constructor(public platform:Platform, public servicio_remoto:RemoteApiService, public ac:AlertController, public nc:NavController) 
  { 
    this.login = new Login();
    /*this.platform.backButton.subscribe(() => {
     
        navigator['app'].exitApp();
      }
    );*/
  }

  login:Login;

  ngOnInit() {
    
  }

  acceder (datos:Login):void
  {
    console.log (" Nombre " + datos.nombre);
    console.log (" Pwd " + datos.pwd);

    this.servicio_remoto.postLogin(datos).subscribe (
      resp_ok => {
        console.log ("respuesta ok");
        let resp_login : HttpResponse<Login>;
        resp_login = resp_ok as HttpResponse<Login>;
        let login_resp : Login = resp_login.body;
        let str_login : string = JSON.stringify(login_resp);
        console.log ("login resp " + str_login);
        window.localStorage.setItem(Constantes.CLAVE_CREDENCIALES, str_login);
        console.log ("Credenciales almancenadas...transitando");
        this.nc.navigateForward('listapelis');
      },
      resp_ko => {
        this.informarErrorLogin (resp_ko as HttpErrorResponse);
      }
    )
  }

  async informarErrorLogin (error:HttpErrorResponse ):Promise<void>
  {

    let alert : HTMLIonAlertElement = await this.ac.create({
      header: error.statusText + " " + error.status,
      message: '¡Error en la validación! Inténtelo de nuevo',
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
}

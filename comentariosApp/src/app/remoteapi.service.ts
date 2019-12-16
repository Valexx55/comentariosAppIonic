import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Login } from './login/login';
import { Observable } from 'rxjs';
import { NuevoComentarioRequest } from './comentarios/nuevo-comentario-request';


@Injectable({
  providedIn: 'root'
})
export class RemoteApiService {


  public static readonly DIR_SERVIDOR = "10.1.2.10:8081";
  public static readonly DIR_SERVCIO_LOGIN = "http://"+RemoteApiService.DIR_SERVIDOR+"/cfticionic/usuariocftic";
  public static readonly DIR_SERVCIO_GET_PELIS = "http://"+RemoteApiService.DIR_SERVIDOR+"/cfticionic/fotos?key=";
  public static readonly DIR_SERVCIO_GET_COMENTARIOS = "http://"+RemoteApiService.DIR_SERVIDOR+"/cfticionic/comentarios/foto";
  public static readonly DIR_SERVCIO_POST_COMENTARIO = "http://"+RemoteApiService.DIR_SERVIDOR+"/cfticionic/comentario";
  public static readonly DIR_SERVCIO_DELETE_COMENTARIO = "http://"+RemoteApiService.DIR_SERVIDOR+"/cfticionic/comentario";


  constructor(public httpcliente: HttpClient) { }

  public postLogin (login:Login) : Observable<Object>
  {
    let resp_servidor : Observable<Object>;
    let cabecera:HttpHeaders;
    let json_login:string;

      json_login = JSON.stringify(login);
      console.log ("llamando POST " + RemoteApiService.DIR_SERVCIO_LOGIN + " Login js " + json_login);
      cabecera = new HttpHeaders().set('Content-type','application/json'); 
      resp_servidor = this.httpcliente.post (RemoteApiService.DIR_SERVCIO_LOGIN, json_login, {headers:cabecera, observe:"response"})

    return resp_servidor;
  }

  public getPelis (token: string):Observable<Object>
    {
      let resp_servidor : Observable<Object>;
      let dir_serv : string;

        dir_serv = RemoteApiService.DIR_SERVCIO_GET_PELIS+token;
        console.log ("llamadno GET " + dir_serv);
        resp_servidor = this.httpcliente.get (dir_serv, {observe:"response"});
      
      return resp_servidor;
    }

    public getComentariosPeli (token: string, idfoto:number):Observable<Object>
    {
      let resp_servidor : Observable<Object>;
      let parametros: HttpParams;

        parametros = new HttpParams().set('key', token).set('idfoto', ''+idfoto);
        console.log ("llamadno GET " + RemoteApiService.DIR_SERVCIO_GET_COMENTARIOS + " Token " + token +" " + idfoto);
        resp_servidor = this.httpcliente.get (RemoteApiService.DIR_SERVCIO_GET_COMENTARIOS, {observe:"response", params:parametros});
      
      return resp_servidor;
    }


    public postComentarioPeli (ncr:NuevoComentarioRequest):Observable<Object>
    {
      let resp_servidor : Observable<Object>;
      let json_comentario:string;
      let cabecera: HttpHeaders;

        json_comentario = JSON.stringify(ncr);  
        console.log ("llamadno POST " + RemoteApiService.DIR_SERVCIO_POST_COMENTARIO + " json comentario " + json_comentario);
        cabecera = new HttpHeaders().set('Content-type','application/json'); 
        resp_servidor = this.httpcliente.post (RemoteApiService.DIR_SERVCIO_POST_COMENTARIO, json_comentario, {headers:cabecera, observe:"response"});
      
      return resp_servidor;
    }

    public deleteComentarioPeli (token: string, idcomentario:number, nombre:string):Observable<Object>
    {
      let resp_servidor : Observable<Object>;
      let parametros: HttpParams;

        parametros = new HttpParams().set('key', token).set('idcomentario', ''+idcomentario).set('nombre', nombre);
        console.log ("llamadno DELETE " + RemoteApiService.DIR_SERVCIO_DELETE_COMENTARIO + " Token " + token +" IDCOMENTARIO " + idcomentario + " NOMBRE " + nombre);
        resp_servidor = this.httpcliente.delete (RemoteApiService.DIR_SERVCIO_DELETE_COMENTARIO, {observe:"response", params:parametros});
      
      return resp_servidor;
    }
}

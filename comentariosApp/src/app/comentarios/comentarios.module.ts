import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComentariosPageRoutingModule } from './comentarios-routing.module';

import { ComentariosPage } from './comentarios.page';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComentariosPageRoutingModule,
    HttpClientModule
  ],
  declarations: [ComentariosPage]
})
export class ComentariosPageModule {}

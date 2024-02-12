import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudMaterialModule } from '../modules/crud-material/crud-material.module';
import { UnidadesCentroRoutingModule } from './unidades-centro-routing.module';
import { UnidadesCentroComponent } from './unidades-centro.component';
import { AddUnidadesCentroComponent } from './add-unidades-centro/add-unidades-centro.component';
import { DeleteUnidadesCentroComponent } from './delete-unidades-centro/delete-unidades-centro.component';
import { EditUnidadesCentroComponent } from './edit-unidades-centro/edit-unidades-centro.component';
import {DatosUnidadesCentroModule } from './datos-basicos-unidades-centro/datos-unidades-centro.module';



@NgModule({
  declarations: [
    UnidadesCentroComponent,
    AddUnidadesCentroComponent,
    DeleteUnidadesCentroComponent,
    EditUnidadesCentroComponent],
  imports: [
    CommonModule,
    CrudMaterialModule,
    UnidadesCentroRoutingModule,
    DatosUnidadesCentroModule
  ]
})
export class UnidadesCentroModule { }

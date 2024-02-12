import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudMaterialModule } from 'src/app/modules/crud-material/crud-material.module';
import { EditarUnidadesCentroComponent } from './editar-unidades-centro/editar-unidades-centro.component';
import { AlumnadoUnidadesCentroComponent } from './alumnado-unidades-centro/alumnado-unidades-centro.component';
import { DatosUnidadesCentroComponent } from './datos-unidades-centro.component';
import { DatosUnidadesCentroRoutingModule } from './datos-unidades-centro-routing.module';
import { AlumnadoUnidadesCentroModule } from './alumnado-unidades-centro/alumnado-unidades-centro.module';
import { EditarUnidadesCentroModule } from './editar-unidades-centro/editar-unidades-centro.module';



@NgModule({
  declarations: [DatosUnidadesCentroComponent],
  imports: [
    CommonModule,
    CrudMaterialModule,
    DatosUnidadesCentroRoutingModule,
    AlumnadoUnidadesCentroModule,
    EditarUnidadesCentroModule
  ]
})
export class DatosUnidadesCentroModule { }

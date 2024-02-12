import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditarUnidadesCentroComponent } from './editar-unidades-centro.component';
import { CrudMaterialModule } from 'src/app/modules/crud-material/crud-material.module';
import { EditarUnidadesCentroRoutingModule } from './editar-unidades-centro-routing.module';



@NgModule({
  declarations: [EditarUnidadesCentroComponent],
  imports: [
    CommonModule,
    CrudMaterialModule,
    EditarUnidadesCentroRoutingModule
  ]
})
export class EditarUnidadesCentroModule { }

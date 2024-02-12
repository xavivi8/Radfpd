import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VacantesRoutingModule } from './vacantes-routing.module';
import { VacantesComponent } from './vacantes.component';
import { DeleteVacanteComponent } from './components/delete-vacante/delete-vacante.component';
import { EditVacanteComponent } from './components/edit-vacante/edit-vacante.component';
import { AddVacanteComponent } from './components/add-vacante/add-vacante.component';
import { CrudMaterialModule } from '../modules/crud-material/crud-material.module';


@NgModule({
  declarations: [
    VacantesComponent,
    AddVacanteComponent,
    DeleteVacanteComponent,
    EditVacanteComponent],
  imports: [
    CommonModule,
    VacantesRoutingModule,
    CrudMaterialModule
  ]
})
export class VacantesModule { }

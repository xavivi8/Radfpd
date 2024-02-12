import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudMaterialModule } from 'src/app/modules/crud-material/crud-material.module';
import { AddAlumnoComponent } from './components/add-alumno/add-alumno.component';
import { DeleteAlumnoComponent } from './components/delete-alumno/delete-alumno.component';
import { EditAlumnoComponent } from './components/edit-alumno/edit-alumno.component';
import { AlumnadoUnidadesCentroRoutingModule } from './alumnado-unidades-centro-routing.module';
import { AlumnadoUnidadesCentroComponent } from './alumnado-unidades-centro.component';



@NgModule({
  declarations: [AlumnadoUnidadesCentroComponent ,AddAlumnoComponent, DeleteAlumnoComponent,EditAlumnoComponent],
  imports: [
    CommonModule,
    AlumnadoUnidadesCentroRoutingModule,
    CrudMaterialModule
  ]
})
export class AlumnadoUnidadesCentroModule { }

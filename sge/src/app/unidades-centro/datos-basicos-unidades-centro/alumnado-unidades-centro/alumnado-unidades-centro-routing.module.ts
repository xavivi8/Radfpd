import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlumnadoUnidadesCentroComponent } from './alumnado-unidades-centro.component';


const routes: Routes = [
  {
    path: '',
    component: AlumnadoUnidadesCentroComponent
  }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlumnadoUnidadesCentroRoutingModule { }

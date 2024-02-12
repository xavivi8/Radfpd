import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosUnidadesCentroComponent } from './datos-unidades-centro.component';
import { EditarUnidadesCentroComponent } from './editar-unidades-centro/editar-unidades-centro.component';

const routes: Routes = [
  {
    path: '',
    component: DatosUnidadesCentroComponent,
    redirectTo: 'datos-unidades-centro'
  },
  {
    path: 'editar-unidades-centro',
    loadChildren: () => import('./editar-unidades-centro/editar-unidades-centro.module').then(m => m.EditarUnidadesCentroModule),
    outlet: 'sidebar'
  },
  {
    path: 'alumnado-unidades-centro',
    loadChildren: () => import('./alumnado-unidades-centro/alumnado-unidades-centro.module').then(m => m.AlumnadoUnidadesCentroModule),
    outlet: 'sidebar'
  },];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatosUnidadesCentroRoutingModule { }

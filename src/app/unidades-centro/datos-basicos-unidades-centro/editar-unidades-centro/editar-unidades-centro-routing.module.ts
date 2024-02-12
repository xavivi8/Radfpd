import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditarUnidadesCentroComponent } from './editar-unidades-centro.component';


const routes: Routes = [
  {
    path: '',
    component: EditarUnidadesCentroComponent
    /* redirectTo: 'editar-unidades-centro' */
  }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditarUnidadesCentroRoutingModule { }

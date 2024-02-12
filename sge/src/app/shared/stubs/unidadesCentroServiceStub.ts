import { UnidadesCentro } from './../interfaces/unidades-centro';
import { Observable, of } from 'rxjs';

export class UnidadesCentroServiceStub {
    getAllRolesMenu(): Observable<UnidadesCentro[]> {
    return of([
        {
            id_unidad_centro: 'string',
            unidad_centro: 'string',
            id_ciclo: 'number',
            id_rol: 'string',
            observaciones: 'string'
        }]);
  }

  addRolMenu() {
    return of('exito');
  }

  editRolMenu() {
    return of('exito');
  }

  deleteRolMenu() {
    return of('exito');
  }

  getRolMenu(): UnidadesCentro {
    return  {
      id_unidad_centro: 'string',
      unidad_centro: 'string',
      id_ciclo: 'number',
      id_rol: 'string',
      observaciones: 'string'
    };
  }
}

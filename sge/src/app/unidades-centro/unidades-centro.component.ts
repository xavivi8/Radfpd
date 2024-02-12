import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { FormControl } from '@angular/forms';
import { Permises } from '../shared/interfaces/api-response';

import { UnidadesCentro } from '../shared/interfaces/unidades-centro';
import { UnidadesCentroService } from '../services/unidades-centro.service';
import { Entidad } from '../shared/interfaces/entidad';
import { EntidadesService } from '../services/entidades.service';
// import { AddUnidadComponent } from './add-unidad/add-unidad.component';
// import { EditUnidadComponent } from './edit-unidad/edit-unidad.component';
// import { DeleteUnidadComponent } from './delete-unidad/delete-unidad.component';

import { SelectionModel } from '@angular/cdk/collections';
import { AddUnidadesCentroComponent } from './add-unidades-centro/add-unidades-centro.component';
import { EditUnidadesCentroComponent } from './edit-unidades-centro/edit-unidades-centro.component';
import { DeleteUnidadesCentroComponent } from './delete-unidades-centro/delete-unidades-centro.component';
import { DatosUnidadesCentroComponent } from './datos-basicos-unidades-centro/datos-unidades-centro.component';

@Component({
  selector: 'app-unidades-centros',
  templateUrl: './unidades-centro.component.html',
  styleUrls: ['./unidades-centro.component.scss']
})
export class UnidadesCentroComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource: MatTableDataSource<UnidadesCentro> = new MatTableDataSource();

  idUnidadCentroFilter = new FormControl();
  unidadCentroFilter = new FormControl();
  idCicloFilter = new FormControl();
  observacionesFilter = new FormControl();

  permises: Permises;

  selection: SelectionModel<UnidadesCentro>;
  unidad: UnidadesCentro;

  displayedColumns: string[];
  private filterValues = { idUnidadCentroFilter: '', unidadCentroFilter: '', idCicloFilter: '', observacionesFilter: '' };

  constructor(
    public dialog: MatDialog,
    private unidadesCentroService: UnidadesCentroService,
    private overlay: Overlay
  ) { }

  ngOnInit(): void {
    this.getUnidades();
    this.createFilter();
    this.onChanges();


  }

  async datosUnidadesCentro(entidad: Entidad) {
    const ENTIDAD = entidad;


    if (ENTIDAD) {
      const dialogRef = this.dialog.open(DatosUnidadesCentroComponent, {
        width: '70em',
        maxWidth: '70em',
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        disableClose: true,
        data: ENTIDAD
      });
    }
}


  async getUnidades() {
    const RESPONSE = await this.unidadesCentroService.getAllUnidadesCentro().toPromise();
    this.permises = RESPONSE.permises;

    if (RESPONSE.ok) {
      this.unidadesCentroService.unidad = RESPONSE.data as UnidadesCentro[];
      this.displayedColumns = ['id_unidad_centro', 'unidad_centro', 'id_ciclo', 'observaciones', 'actions'];
      this.dataSource.data = this.unidadesCentroService.unidad;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = this.createFilter();
      this.selection = new SelectionModel<UnidadesCentro>(false, [this.unidad]);

      this.onChanges();
    }
  }

  async addUnidadCentro() {
    const dialogRef = this.dialog.open(AddUnidadesCentroComponent, { scrollStrategy: this.overlay.scrollStrategies.noop(), disableClose: true });
    const RESULT = await dialogRef.afterClosed().toPromise();
    if (RESULT) {
      if (RESULT.ok) {
        this.unidadesCentroService.unidad.push(RESULT.data);
        this.dataSource.data = this.unidadesCentroService.unidad;
        this.ngOnInit();
      }
    }
  }

  async editUnidadCentro(unidad: UnidadesCentro) {
     const dialogRef = this.dialog.open(EditUnidadesCentroComponent, { data: unidad, scrollStrategy: this.overlay.scrollStrategies.noop(), disableClose: true });
     const RESULT = await dialogRef.afterClosed().toPromise();
     if (RESULT) {
       if (RESULT.ok) {
         this.unidadesCentroService.editUnidadCentro(RESULT.data);
         this.dataSource.data = this.unidadesCentroService.unidad;
         this.ngOnInit();
       }
     }
  }

  async deleteUnidadCentro(unidad: UnidadesCentro) {
     const dialogRef = this.dialog.open(DeleteUnidadesCentroComponent, { data: unidad, scrollStrategy: this.overlay.scrollStrategies.noop() });
     const RESULT = await dialogRef.afterClosed().toPromise();
     if (RESULT) {
       if (RESULT.ok) {
         this.unidadesCentroService.deleteUnidadCentro(RESULT.data);
         this.dataSource.data = this.unidadesCentroService.unidad;
         this.ngOnInit();
       }
     }
  }

  createFilter(): (unidad: UnidadesCentro, filter: string) => boolean {
    const filterFunction = (unidad: UnidadesCentro, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);

      return unidad.id_unidad_centro.toString().indexOf(searchTerms.id_unidad) !== -1
        && unidad.id_ciclo.toString().indexOf(searchTerms.fk_entidad.toLowerCase()) !== -1
        && unidad.unidad_centro.toLowerCase().indexOf(searchTerms.fk_ciclo.toLowerCase()) !== -1
        && unidad.observaciones.toLowerCase().indexOf(searchTerms.unidad.toLowerCase()) !== -1;
      // TODO Arreglar esto
    };

    return filterFunction;
  }

  onChanges() {
    this.idUnidadCentroFilter.valueChanges.subscribe(value => {
      this.filterValues.idUnidadCentroFilter = value;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.unidadCentroFilter.valueChanges
      .subscribe(value => {
        this.filterValues.unidadCentroFilter = value;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      });

    this.idCicloFilter.valueChanges
      .subscribe(value => {
        this.filterValues.idCicloFilter = value;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      });

    this.observacionesFilter.valueChanges
      .subscribe(value => {
        this.filterValues.observacionesFilter = value;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      });

  }
}

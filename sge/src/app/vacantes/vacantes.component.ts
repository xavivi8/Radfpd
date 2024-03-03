import { Component, OnInit, ViewChild } from '@angular/core';
import { Vacante } from './interfaces/vacantes.interfaces';
import { Alumno } from '../unidades-centro/datos-basicos-unidades-centro/alumnado-unidades-centro/interfaces/alumno';
import { Overlay } from '@angular/cdk/overlay';
import { UnidadesCentroService } from '../services/unidades-centro.service';
import { VacanteService } from './services/vacantes.service';
import { MatDialog } from '@angular/material/dialog';
import { Permises } from '../shared/interfaces/api-response';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UnidadCentro } from '../shared/interfaces/unidad-centro';
import { DeleteVacanteComponent } from './components/delete-vacante/delete-vacante.component';
import { EditVacanteComponent } from './components/edit-vacante/edit-vacante.component';
import { AddVacanteComponent } from './components/add-vacante/add-vacante.component';

@Component({
  selector: 'app-vacantes',
  templateUrl: './vacantes.component.html',
  styleUrls: ['./vacantes.component.scss']
})
export class VacantesComponent implements OnInit {

  vacantes: Vacante[] = [];
  unidades: UnidadCentro[];
  unidadCentroSeleccionada: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource: MatTableDataSource<Vacante> = new MatTableDataSource();

  idVacanteFilter = new FormControl();
  entidadFilter = new FormControl();
  idUnidadCentroFilter = new FormControl();
  numAlumnosFilter = new FormControl();

  permises: Permises;

  displayedColumns: string[] = [
    "id_vacante",
    "entidad",
    "id_unidad_centro",
    "unidad_centro",
    "num_alumnos",
    "elegidos_total",
    "actions",
  ];

  private filterValues = {
    id_vacante: "",
    entidad: "",
    id_unidad_centro: "",
    num_alumnos: "",
  };

  constructor(
    public dialog: MatDialog,
    private vacanteService: VacanteService,
    private servicioUnidadesCentro: UnidadesCentroService,
    private overlay: Overlay
  ) { }

  /**
   *
   */
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Vacante>();
    this.getVacantes();
    this.getUnidadesCentro();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.createFilter();
    this.onChanges();
  }

  /**
   *
   */
  async getUnidadesCentro() {
    const RESPONSE = await this.servicioUnidadesCentro
      .getAllUnidadesCentro()
      .toPromise();
    if (RESPONSE.ok) {
      this.unidades = RESPONSE.data as UnidadCentro[];
    }
  }

  /**
   *
   * @param {number} id_unidad_centro
   * @returns {string}
   */
  getNombreUnidadCentroSeleccionada(id_unidad_centro: number): string {
    const unidadSeleccionada = this.unidades.find(unidad => unidad.id_unidad_centro === id_unidad_centro);
    return unidadSeleccionada ? unidadSeleccionada.unidad_centro : '';
  }

  /**
   *
   */
  async getVacantes() {
    const RESPONSE = await this.vacanteService.getVacantes().toPromise();
    this.permises = RESPONSE.permises;

    if (RESPONSE.ok) {
      this.vacantes = RESPONSE.data as Vacante[];

      for (const vacante of this.vacantes) {
        await this.getAlumnosSeleccionados(vacante);
      }

      this.dataSource.data = this.vacantes;
    }
  }

  /**
   *
   * @param {Vacante} vacante
   */
  async getAlumnosSeleccionados(vacante: Vacante) {
    const RESPONSE = await this.vacanteService.getListadoAlumnos(vacante.id_unidad_centro).toPromise();
    if (RESPONSE.ok) {
      const alumnosSeleccionados: Alumno[] = RESPONSE.data.filter(alumno => alumno.estado === 1);
      vacante.elegidos_total = `${alumnosSeleccionados.length}/${vacante.num_alumnos}`;
    }
  }

  /**
   *
   */
  async addVacante() {
    const dialogRef = this.dialog.open(AddVacanteComponent, {
      scrollStrategy: this.overlay.scrollStrategies.noop(),
    });
    const RESULT = await dialogRef.afterClosed().toPromise();
    if (RESULT && RESULT.ok) {
      this.getVacantes();
    }
  }

  /**
   *
   * @param {Vacante} vacante
   */
  async editVacante(vacante: Vacante) {
    const dialogRef = this.dialog.open(EditVacanteComponent, {
      data: vacante,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
    });
    const RESULT = await dialogRef.afterClosed().toPromise();
    if (RESULT && RESULT.ok) {
      this.getVacantes();
    }
  }

  /**
   *
   * @param {Vacante} vacante
   */
  async deleteVacante(vacante: Vacante) {
    const dialogRef = this.dialog.open(DeleteVacanteComponent, {
      data: vacante,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
    });
    const RESULT = await dialogRef.afterClosed().toPromise();
    if (RESULT && RESULT.ok) {
      this.getVacantes();
    }
  }

  /**
   *
   * @returns {boolean}
   */
  createFilter(): (vacante: Vacante, filter: string) => boolean {
    const filterFunction = (vacante: Vacante, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);

      return (
        vacante.id_vacante.toString().indexOf(searchTerms.id_vacante) !== -1 &&
        vacante.entidad.toLowerCase().indexOf(searchTerms.entidad.toLowerCase()) !== -1 &&
        vacante.id_unidad_centro.toString().indexOf(searchTerms.id_unidad_centro.toLowerCase()) !== -1 &&
        vacante.num_alumnos.toString().indexOf(searchTerms.num_alumnos.toLowerCase()) !== -1
      );
    };

    return filterFunction;
  }

  /**
   *
   */
  onChanges() {
    this.idVacanteFilter.valueChanges.subscribe((value) => {
      this.filterValues.id_vacante = value;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.entidadFilter.valueChanges.subscribe((value) => {
      this.filterValues.entidad = value;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.idUnidadCentroFilter.valueChanges.subscribe((value) => {
      this.filterValues.id_unidad_centro = value;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.numAlumnosFilter.valueChanges.subscribe((value) => {
      this.filterValues.num_alumnos = value;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });
  }

}

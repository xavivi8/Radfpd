import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Alumno } from 'src/app/shared/interfaces/alumno';
import { Entidad } from 'src/app/shared/interfaces/entidad';
import { UnidadCentro } from 'src/app/shared/interfaces/unidad-centro';
import { CLOSE, INVALID_FORM } from 'src/app/shared/messages';
import { Vacante } from '../../interfaces/vacantes.interfaces';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UnidadesCentroService } from 'src/app/services/unidades-centro.service';
import { EntidadesService } from 'src/app/services/entidades.service';
import { VacanteService } from '../../services/vacantes.service';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-edit-vacante',
  templateUrl: './edit-vacante.component.html',
  styleUrls: ['./edit-vacante.component.scss']
})
export class EditVacanteComponent implements OnInit {

  vacanteForm: FormGroup;
  entidades: Entidad[];
  unidades: UnidadCentro[];

  alumnadoUnidadElegida: Alumno[];
  alumnosSeleccionados: Alumno[];
  cantidadSeleccionadosVacante: number; // = alumnosSeleccionados.lenght
  @ViewChild('numAlumnosSelect') numAlumnosSelect: MatSelect; // Select para el num_alumnos
  num_alumnos = new FormControl(this.vacante.num_alumnos, Validators.required); // Control para el número total de alumnos
  alumnosSeleccionadosControl = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<EditVacanteComponent>,
    private servicioVacante: VacanteService,
    private servicioEntidades: EntidadesService,
    private servicioUnidadesCentro: UnidadesCentroService,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public vacante: Vacante
  ) {
    this.alumnadoUnidadElegida = [];
    this.alumnosSeleccionados = [];
    // Inicializar a 0 la cantidad de alumnos elegidos para esa vacante
    this.cantidadSeleccionadosVacante = 0;
  }

  /**
   * Método que se ejecuta al inicializar el componente
   */
  ngOnInit(): void {
    this.vacanteForm = new FormGroup({
      id_vacante: new FormControl(this.vacante.id_vacante),
      id_entidad: new FormControl(this.vacante.entidad, Validators.required),
      id_unidad_centro: new FormControl(this.vacante.id_unidad_centro, Validators.required),
      num_alumnos: this.num_alumnos,
      alumnadoUnidad: new FormControl(this.alumnadoUnidadElegida),
      alumnosSeleccionados: new FormControl(this.alumnosSeleccionados),
      elegidos_total: new FormControl(`${this.cantidadSeleccionadosVacante}/${this.vacante.num_alumnos}`),
    });

    this.num_alumnos.valueChanges.subscribe(() => this.actualizarElegidosTotal());
    this.vacanteForm.get('alumnosSeleccionados').valueChanges.subscribe(() => this.actualizarElegidosTotal());

    this.getEntidades();
    this.getUnidadesCentro();
    this.getAlumnosUnidadElegida(this.vacante.id_unidad_centro);
  }

  /**
   * Método para actualizar el estado de las opciones del MatSelect según el número de alumnos seleccionados
   */
  actualizarEstadoOptions(): void {
    const numAlumnosTotal = this.num_alumnos.value;
    const numAlumnosSeleccionados = this.alumnosSeleccionadosControl.value;
    for (let i = 0; i < numAlumnosTotal; i++) {
      const option = this.numAlumnosSelect.options.find(opt => opt.value === i);
      if (option) option.disabled = i < numAlumnosSeleccionados;
    }
  }

  /**
   * Método para generar opciones para el número de alumnos a seleccionar
   * @returns {number[]} Lista de opciones
   */
  generarOpciones(): number[] {
    const numAlumnosSeleccionados = this.alumnosSeleccionados.length;
    const maximoAlumnos = 20;
    return Array.from({ length: maximoAlumnos - numAlumnosSeleccionados + 1 }, (_, i) => numAlumnosSeleccionados + i);
  }

  /**
   * Método para calcular la cantidad de alumnos seleccionados
   * @returns {number} Cantidad de alumnos seleccionados
   */
  calcularCantidadSeleccionados(): number {
    return this.alumnosSeleccionados.length;
  }

  /**
   * Método para actualizar el campo 'elegidos_total' en el formulario
   */
  actualizarNumAlumnosSeleccionados(): void {
    const alumnosSeleccionados = this.vacanteForm.get('alumnosSeleccionados').value;
    this.alumnosSeleccionados = alumnosSeleccionados;
    this.num_alumnos.setValue(alumnosSeleccionados.length);
    this.actualizarElegidosTotal();
  }

  /**
   * Método para actualizar el campo 'elegidos_total' en el formulario
   */
  actualizarElegidosTotal() {
    const cantidadSeleccionadosVacante = this.alumnosSeleccionados.length;
    const numAlumnosTotal = this.num_alumnos.value;
    this.vacanteForm.get('elegidos_total').setValue(`${cantidadSeleccionadosVacante}/${numAlumnosTotal}`);
  }

  /**
   * Método para obtener la lista de alumnos disponibles en la unidad seleccionada
   * @param {number} id_unidad_centro ID de la unidad de centro
   */
  async getAlumnosUnidadElegida(id_unidad_centro: number) {
    const { ok, data } = await this.servicioVacante.getListadoAlumnos(id_unidad_centro).toPromise();
    if (ok) {
      data.forEach(alumno => {
        if (alumno['estado'] === 0) {
          this.alumnadoUnidadElegida.push(alumno);
        } else {
          this.alumnosSeleccionados.push(alumno);
          this.cantidadSeleccionadosVacante++;
        }
      });
      this.actualizarElegidosTotal();
    }
  }

  /**
   * Método para obtener la lista de alumnos disponibles en la unidad seleccionada
   * @param {number} id_unidad_centro ID de la unidad de centro
   */
  async onChangeNumAlumnos() {
    const numAlumnosSeleccionados = this.alumnosSeleccionados.length;
    const numAlumnosTotal = this.num_alumnos.value;

    if (numAlumnosTotal < numAlumnosSeleccionados) {
      this.snackBar.open('Elija un valor igual o mayor a los alumnos seleccionados.', '', { duration: 3000 });
      this.vacanteForm.get('num_alumnos').setValue(numAlumnosSeleccionados);
      return;
    }

    this.actualizarElegidosTotal();
  }

  /**
   * Confirma la edición de la vacante
   */
  async confirmEdit() {
    if (this.vacanteForm.valid) {
      const vacante = this.vacanteForm.value;
      const idsAlumnos = vacante.alumnosSeleccionados.map(alumno => alumno.id);
      const [resp, resp2] = await Promise.all([
        this.servicioVacante.editVacante(vacante).toPromise(),
        this.servicioVacante.insertarAlumnosSeleccionados(vacante.id_vacante, idsAlumnos).toPromise()
      ]);
      const response = resp.ok ? resp : resp2;
      this.snackBar.open(response.message, CLOSE, { duration: 5000 });
      this.dialogRef.close({ ok: response.ok, data: response.data });
    } else {
      this.snackBar.open(INVALID_FORM, CLOSE, { duration: 5000 });
      this.dialogRef.close({ ok: false });
    }
  }

  /**
   * Selecciona un alumno para la vacante
   * @param {Alumno} alumno Alumno seleccionado
   * @returns {Promise<void>}
   */
  async seleccionarAlumno(alumno: Alumno) {
    if (this.alumnosSeleccionados.length >= this.vacanteForm.get('num_alumnos').value) {
      this.snackBar.open('Ha alcanzado el máximo de alumnos.', 'OK', { duration: 3000 });
      return;
    }

    this.alumnosSeleccionados.push(alumno);
    this.cantidadSeleccionadosVacante++;
    const index = this.alumnadoUnidadElegida.indexOf(alumno);
    if (index !== -1) this.alumnadoUnidadElegida.splice(index, 1);
    this.actualizarElegidosTotal();
  }

  /**
   * Quita un alumno de la vacante
   * @param {Alumno} alumno Alumno a quitar
   */
  async quitarAlumno(alumno: Alumno) {
    const index = this.alumnosSeleccionados.indexOf(alumno);
    if (index !== -1) this.alumnosSeleccionados.splice(index, 1);
    this.cantidadSeleccionadosVacante--;
    this.alumnadoUnidadElegida.push(alumno);
    this.actualizarElegidosTotal();
  }

  /**
   * Obtiene la lista de entidades
   */
  async getEntidades() {
    const { ok, data } = await this.servicioEntidades.getAllEntidades().toPromise();
    if (ok) this.entidades = data as Entidad[];
  }

  /**
   * Obtiene la lista de unidades de centro
   */
  async getUnidadesCentro() {
    const { ok, data } = await this.servicioUnidadesCentro.getAllUnidadesCentro().toPromise();
    if (ok) this.unidades = data as UnidadCentro[];
  }

  /**
   * Obtiene el nombre de la unidad de centro seleccionada
   * @returns {string} Nombre de la unidad de centro seleccionada
   */
  getNombreUnidadCentroSeleccionada(): string {
    const idSeleccionado = this.vacanteForm.get('id_unidad_centro').value;
    const unidadSeleccionada = this.unidades.find(unidad => unidad.id_unidad_centro === idSeleccionado);
    return unidadSeleccionada ? unidadSeleccionada.unidad_centro : '';
  }

  /**
   * Cierra el diálogo sin realizar cambios
   */
  onNoClick(): void {
    this.dialogRef.close({ ok: false });
  }
}

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

  ngOnInit(): void {
    this.num_alumnos = new FormControl(this.vacante.num_alumnos, Validators.required),

    this.vacanteForm = new FormGroup({
      id_vacante: new FormControl(this.vacante.id_vacante),
      entidad: new FormControl(this.vacante.entidad, Validators.required),
      id_unidad_centro: new FormControl(this.vacante.id_unidad_centro,Validators.required),
      num_alumnos: this.num_alumnos,
      alumnadoUnidad: new FormControl(this.alumnadoUnidadElegida),
      alumnosSeleccionados: new FormControl(this.alumnosSeleccionados),
      elegidos_total: new FormControl(`${this.calcularCantidadSeleccionados()}/${this.vacante.num_alumnos}`), // Inicializar el campo elegidos_total
    });

   // Suscribirse a los cambios en el número total de alumnos
    this.num_alumnos.valueChanges.subscribe(() => {
      this.actualizarElegidosTotal();
    });

    // Observar cambios en la lista de alumnos seleccionados
    this.vacanteForm.get("alumnosSeleccionados").valueChanges.subscribe(() => {
      this.actualizarElegidosTotal(); // Actualizar el valor de 'alumnosSeleccionados' cuando cambia la lista de alumnos seleccionados
    });

    this.getEntidades();
    this.getUnidadesCentro();
    this.getAlumnosUnidadElegida(this.vacante.id_unidad_centro);
  }

  // Método para actualizar el estado de las opciones del mat-select
  actualizarEstadoOptions(): void {
    const numAlumnosTotal = this.num_alumnos.value;
    const numAlumnosSeleccionados = this.alumnosSeleccionadosControl.value;

    // Deshabilitar las opciones del select que son menores que la cantidad de alumnos seleccionados
    for (let i = 0; i < numAlumnosTotal; i++) {
      const option = document.getElementById(`num_alumnos-option-${i}`) as HTMLOptionElement;
      if (option) {
        option.disabled = i < numAlumnosSeleccionados;
      }
    }
  }

  // Método para mostrar  en el mat-selector solamente opciones que sean mayor
  // o igual al núm de alumnos seleccionados
  generarOpciones(): number[] {
    const numAlumnosSeleccionados = this.alumnosSeleccionados.length;
    const maximoAlumnos = 20; // Número máximo de alumnos permitidos

    // Generar las opciones del select desde numAlumnosSeleccionados hasta el maximoAlumnos
    const opciones = [];
    for (let i = numAlumnosSeleccionados; i <= maximoAlumnos; i++) {
      opciones.push(i);
    }
    return opciones;
  }

  // Método para calcular la cantidad de alumnos seleccionados
  calcularCantidadSeleccionados(): number {
    return this.alumnosSeleccionados.length;
  }

  // Método para actualizar la cantidad de alumnos seleccionados
  actualizarNumAlumnosSeleccionados(): void {
    const alumnosSeleccionados = this.vacanteForm.get("alumnosSeleccionados").value;
    this.alumnosSeleccionados = alumnosSeleccionados;

    // Actualizar el valor del controlador numAlumnosControl
    this.num_alumnos.setValue(alumnosSeleccionados.length);

    // Actualizar el valor de 'elegidos_total' en el formulario
    this.actualizarElegidosTotal();
  }

  // Método para actualizar el valor del campo 'elegidos_total'
  actualizarElegidosTotal() {
    const cantidadSeleccionadosVacante = this.alumnosSeleccionados.length;
    const numAlumnosTotal = this.num_alumnos.value; // Obtiene el valor actualizado del FormControl
    this.vacanteForm.get("elegidos_total").setValue(`${cantidadSeleccionadosVacante}/${numAlumnosTotal}`);
  }

  async getAlumnosUnidadElegida(id_unidad_centro: number) {
    const RESPONSE = await this.servicioVacante.getListadoAlumnos(id_unidad_centro).toPromise();
    if (RESPONSE.ok) {
      RESPONSE.data.forEach((alumno) => {
        if (alumno["estado"] == 0) {
          this.alumnadoUnidadElegida.push(alumno);
        } else {
          this.alumnosSeleccionados.push(alumno);
          // Se incrementa el contador de elegidos
          this.cantidadSeleccionadosVacante++;
        }
      });

      // Actualizar el valor del campo 'elegidos_total' en el formulario
      this.actualizarElegidosTotal();
    }
  }

  // Método para manejar el cambio en el campo num_alumnos, y controlar que sea
  // igual o mayor al número de alumnos seleccionados
  async onChangeNumAlumnos() {
    console.log('onChangeNumAlumnos triggered');
    const numAlumnosSeleccionados = this.vacanteForm.get('alumnosSeleccionados').value.length;
    const numAlumnosTotal = this.vacanteForm.get('num_alumnos').value;

    if (numAlumnosTotal < numAlumnosSeleccionados) {
      // Si el valor seleccionado es menor que la cantidad de alumnos ya seleccionados, mostrar un snackbar
      this.snackBar.open('Elija un valor igual o mayor a los alumnos seleccionados.', '', { duration: 3000 });
      // Revertir el cambio seleccionando la cantidad actual de alumnos seleccionados
      this.vacanteForm.get('num_alumnos').setValue(numAlumnosSeleccionados);
      return;
    }

    // Actualizar el valor del campo 'elegidos_total' en el formulario
    this.actualizarElegidosTotal();
  }

  async confirmEdit() {
    if (this.vacanteForm.valid) {
      const vacante = this.vacanteForm.value;

      // Obtener el array de IDs de los alumnos seleccionados
      const idsAlumnos: number[] = vacante.alumnosSeleccionados.map(
        (alumno) => {
          return alumno.id_alumno;
        }
      );

      const RESP = await this.servicioVacante.editVacante(vacante).toPromise();
      if (RESP.ok) {
        const RESP2 = await this.servicioVacante
          .insertarAlumnosSeleccionados(vacante.id_vacante, idsAlumnos)
          .toPromise();
        this.snackBar.open(RESP.message, CLOSE, { duration: 5000 });
        this.dialogRef.close({ ok: RESP.ok, data: RESP.data });
      } else {
        this.snackBar.open(RESP.message, CLOSE, { duration: 5000 });
      }
    } else {
      this.snackBar.open(INVALID_FORM, CLOSE, { duration: 5000 });
    }
  }

  async seleccionarAlumno(alumno: Alumno) {
    if (this.alumnosSeleccionados.length >= this.vacanteForm.get('num_alumnos').value) {
      // Si se alcanza el máximo de alumnos permitidos, mostrar un snackbar
      this.snackBar.open('Ha alcanzado el máximo de alumnos.', 'OK', { duration: 3000 });
      return;
    }

    // Si aún no se ha alcanzado el límite, se agrega el alumno a la lista de seleccionados
    this.alumnosSeleccionados.push(alumno);
    // Se incrementa el contador de elegidos
    this.cantidadSeleccionadosVacante++;

    // Se elimina el alumno de la lista de la unidad (ya está seleccionado)
    const index = this.alumnadoUnidadElegida.indexOf(alumno);
    if (index !== -1) {
      this.alumnadoUnidadElegida.splice(index, 1);
    }

    // Se actualiza el valor de elegidos_total en el formulario
    this.actualizarElegidosTotal();
  }


  async quitarAlumno(alumno: Alumno) {
    // Se quita el alumno de la lista de seleccionados
    const index = this.alumnosSeleccionados.indexOf(alumno);
    if (index !== -1) {
      this.alumnosSeleccionados.splice(index, 1);
    }
    // Se descuenta el contador de elegidos
    this.cantidadSeleccionadosVacante--;

    // Se devuelve a lista de la unidad
    this.alumnadoUnidadElegida.push(alumno);

    // Se actualiza el valor de elegidos_total en el formulario
    this.actualizarElegidosTotal();
  }

  async getEntidades() {
    const RESPONSE = await this.servicioEntidades.getAllEntidades().toPromise();
    if (RESPONSE.ok) {
      this.entidades = RESPONSE.data as Entidad[];
    }
  }

  async getUnidadesCentro() {
    const RESPONSE = await this.servicioUnidadesCentro
      .getAllUnidadesCentro()
      .toPromise();
    if (RESPONSE.ok) {
      this.unidades = RESPONSE.data as UnidadCentro[];
    }
  }

  // Método para mostrar el nombre de la unidad_centro correspondiente al id_unidad_centro elegido
  getNombreUnidadCentroSeleccionada(): string {
    const idSeleccionado = this.vacanteForm.get('id_unidad_centro').value;
    const unidadSeleccionada = this.unidades.find(unidad => unidad.id_unidad_centro === idSeleccionado);
    return unidadSeleccionada ? unidadSeleccionada.unidad_centro : '';
  }

  onNoClick(): void {
    this.dialogRef.close({ ok: false });
  }

}

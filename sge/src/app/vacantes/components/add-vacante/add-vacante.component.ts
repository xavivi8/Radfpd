import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EntidadesService } from 'src/app/services/entidades.service';
import { UnidadesCentroService } from 'src/app/services/unidades-centro.service';
import { Entidad } from 'src/app/shared/interfaces/entidad';
import { UnidadCentro } from 'src/app/shared/interfaces/unidad-centro';
import { CLOSE, INVALID_FORM } from 'src/app/shared/messages';
import { VacanteService } from '../../services/vacantes.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-vacante',
  templateUrl: './add-vacante.component.html',
  styleUrls: ['./add-vacante.component.scss']
})
export class AddVacanteComponent implements OnInit {

  vacanteForm: FormGroup;
  entidades: Entidad[];
  unidades: UnidadCentro[];

  constructor(
    public dialogRef: MatDialogRef<AddVacanteComponent>,
    private servicioVacante: VacanteService,
    private servicioEntidades: EntidadesService,
    private servicioUnidadesCentro: UnidadesCentroService,
    public snackBar: MatSnackBar
  ) { }

  /**
   * Se ejecuta al iniciar el componente.
   * Inicializa el formulario y carga los datos necesarios.
   */
  ngOnInit() {
    this.vacanteForm = new FormGroup({
      id_vacante: new FormControl(0),
      entidad: new FormControl(null, Validators.required),
      id_unidad_centro: new FormControl(null, Validators.required),
      num_alumnos: new FormControl(null, Validators.required),
    });
    this.loadData();
  }

  /**
   * Carga los datos necesarios para el formulario.
   * Utiliza async/await para esperar las respuestas de las solicitudes HTTP.
   */
  async loadData() {
    try {
      // Se espera a que ambas llamadas asíncronas se completen y se almacenan las respuestas en un array.
      const [entidadesResponse, unidadesResponse] = await Promise.all([
        this.servicioEntidades.getAllEntidades().toPromise(), // Llamada al servicio para obtener entidades.
        this.servicioUnidadesCentro.getAllUnidadesCentro().toPromise() // Llamada al servicio para obtener unidades de centro.
      ]);

      // Si la respuesta de entidades es exitosa, se guardan los datos en un array
      if (entidadesResponse.ok) {
        this.entidades = entidadesResponse.data as Entidad[];
      }

      // Si la respuesta de unidades es exitosa, se guardan los datos en un array
      if (unidadesResponse.ok) {
        this.unidades = unidadesResponse.data as UnidadCentro[];
      }
    } catch (error) { // Captura cualquier error ocurrido durante las llamadas a los servicios.
      console.error('Error al cargar datos:', error); // Imprime el error en la consola.
      // Muestra una notificación al usuario indicando que hubo un error al cargar los datos.
      this.snackBar.open('Error al cargar datos', CLOSE, { duration: 5000 });
    }
  }

  /**
   * Confirma la adición de la vacante.
   * Valida el formulario y realiza la solicitud HTTP para agregar la vacante.
   */
  async confirmAdd() {
    if (this.vacanteForm.valid) {
      const vacante = this.vacanteForm.value;
      try {
        const response = await this.servicioVacante.addVacante(vacante).toPromise();
        this.snackBar.open(response.message, CLOSE, { duration: 5000 });
        this.dialogRef.close({ ok: response.ok, data: response.data });
      } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        this.snackBar.open('Error al procesar la solicitud', CLOSE, { duration: 5000 });
      }
    } else {
      this.snackBar.open(INVALID_FORM, CLOSE, { duration: 5000 });
      this.dialogRef.close({ ok: false });
    }
  }

  /**
   * Cierra el diálogo sin realizar ninguna acción.
   */
  onNoClick(): void {
    this.dialogRef.close({ok: false});
  }

}

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

  constructor(public dialogRef: MatDialogRef<AddVacanteComponent>,
              private servicioVacante: VacanteService,
              private servicioEntidades: EntidadesService,
              private servicioUnidadesCentro: UnidadesCentroService,
              public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.vacanteForm = new FormGroup({
      id_vacante: new FormControl(0),
      entidad: new FormControl(null, Validators.required),
      id_unidad_centro: new FormControl(null, Validators.required),
      num_alumnos: new FormControl(null, Validators.required),
    });
    console.log("Es una add vacante"+this.vacanteForm.value)
    this.getEntidades();
    this.getUnidadesCentro();
  }

  async getEntidades() {
    const RESPONSE = await this.servicioEntidades.getAllEntidades().toPromise();
    if (RESPONSE.ok) {
      this.entidades = RESPONSE.data as Entidad[];
    }
  }

  async getUnidadesCentro() {
    const RESPONSE = await this.servicioUnidadesCentro.getAllUnidadesCentro().toPromise();
    if (RESPONSE.ok) {
      this.unidades = RESPONSE.data as UnidadCentro[];
    }
  }

  async confirmAdd() {
    console.log(this.vacanteForm.valid);
    if (this.vacanteForm.valid) {
      // Obtiene los datos del formulario
      const vacante = this.vacanteForm.value;
      try {
        // Realiza la solicitud para agregar la vacante y espera la respuesta
        const response = await this.servicioVacante.addVacante(vacante).toPromise();
        console.log(response);

        // Verifica si la respuesta es exitosa (ok === true)
        if (response.ok) {
          // Muestra un mensaje de éxito y cierra el diálogo con la respuesta del servidor
          this.snackBar.open(response.message, CLOSE, { duration: 5000 });
          this.dialogRef.close({ ok: response.ok, data: response.data });
        } else {
          // Muestra un mensaje de error en caso de una respuesta no exitosa
          this.snackBar.open(response.message, CLOSE, { duration: 5000 });
        }
      } catch (error) {
        // Captura y maneja cualquier error de la solicitud HTTP
        console.error('Error al procesar la solicitud:', error);
        this.snackBar.open('Error al procesar la solicitud', CLOSE, { duration: 5000 });
      }
    } else {
      // Muestra un mensaje si el formulario no es válido
      this.snackBar.open(INVALID_FORM, CLOSE, { duration: 5000 });
      this.dialogRef.close({ ok: false });
    }
  }

  onNoClick(): void {
    console.log(this.vacanteForm.value);
    this.dialogRef.close({ok: false});
  }

}

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
    if (this.vacanteForm.valid) {
      const vacante = this.vacanteForm.value;
      console.log(this.vacanteForm.value);
      const RESP = await this.servicioVacante.addVacante(vacante).toPromise();
      if (RESP.ok) {
        this.snackBar.open(RESP.message, CLOSE, { duration: 5000 });
        this.dialogRef.close({ok: RESP.ok, data: RESP.data});
      } else {
        this.snackBar.open(RESP.message, CLOSE, { duration: 5000 });
      }
    } else {
      this.snackBar.open(INVALID_FORM, CLOSE, { duration: 5000 });
    }
  }

  onNoClick(): void {
    console.log(this.vacanteForm.value);
    this.dialogRef.close({ok: false});
  }

}

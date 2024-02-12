import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { INVALID_FORM, CLOSE } from '../../shared/messages';
import { UnidadesCentroService } from 'src/app/services/unidades-centro.service';
import { UnidadesCentro } from 'src/app/shared/interfaces/unidades-centro';

@Component({
  selector: 'app-add-unidades-centro',
  templateUrl: './add-unidades-centro.component.html',
  styleUrls: ['./add-unidades-centro.component.scss']
})
export class AddUnidadesCentroComponent implements OnInit {

  unidadCentroForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<AddUnidadesCentroComponent>,
    private snackBar: MatSnackBar,
    private servicioRoles: UnidadesCentroService
) {

}

  ngOnInit(): void {
    this.unidadCentroForm = new FormGroup({
      unidad_centro: new FormControl(null, Validators.required),
      id_ciclo: new FormControl(null, Validators.required),
      observaciones: new FormControl(null)
    });
  }

  async confirmAdd() {
    if (this.unidadCentroForm.valid) {
      const unidadCentro = this.unidadCentroForm.value as UnidadesCentro;

      const RESP = await this.servicioRoles.addUnidadCentro(unidadCentro).toPromise();
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

  onNoClick() {
    this.dialogRef.close({ok: false});
  }
}

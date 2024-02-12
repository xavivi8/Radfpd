import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from 'src/app/shared/interfaces/usuario';
import { Rol } from 'src/app/shared/interfaces/rol';
import {CLOSE, INVALID_FORM} from '../../shared/messages';
import { UnidadesCentroService } from 'src/app/services/unidades-centro.service';
import { UnidadesCentro } from 'src/app/shared/interfaces/unidades-centro';

@Component({
  selector: 'app-edit-unidad-centro',
  templateUrl: './edit-unidades-centro.component.html',
  styleUrls: ['./edit-unidades-centro.component.scss']
})
export class EditUnidadesCentroComponent implements OnInit {

  editUnidadCentro: FormGroup;

  constructor(public dialogRef: MatDialogRef<EditUnidadesCentroComponent>,
              private servicioEditUnidadCentro: UnidadesCentroService,
              public snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public unidadCentro: UnidadesCentro
  ) { }

  ngOnInit() {

    this.editUnidadCentro = new FormGroup({ // Campos del formulario de edición
      id_unidad_centro: new FormControl(this.unidadCentro.id_unidad_centro),
      unidad_centro: new FormControl(null, [Validators.required]),
      id_ciclo: new FormControl(null, [Validators.required]),
      observaciones: new FormControl(null)
    });

    //this.getRoles();
  }

  async confirmAdd() {
    if (this.editUnidadCentro.valid) {
      const unidadCentro = this.editUnidadCentro.value;

      const RESP = await this.servicioEditUnidadCentro.editUnidadCentro(unidadCentro).toPromise();
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
    this.dialogRef.close({ok: false});
  }

}

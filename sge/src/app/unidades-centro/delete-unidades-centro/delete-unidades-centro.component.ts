import { Component, Inject, OnInit } from '@angular/core';
import { UnidadesCentroService } from 'src/app/services/unidades-centro.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UnidadesCentro } from '../../shared/interfaces/unidades-centro';
import { CLOSE } from '../../shared/messages';

@Component({
  selector: 'app-delete-unidades-centro',
  templateUrl: './delete-unidades-centro.component.html',
  styleUrls: ['./delete-unidades-centro.component.scss']
})
export class DeleteUnidadesCentroComponent implements OnInit {
  unidadCentro: UnidadesCentro;

  constructor(public dialogRef: MatDialogRef<DeleteUnidadesCentroComponent>,
    @Inject(MAT_DIALOG_DATA) public unidadCentros: UnidadesCentro,
    public servicioRoles: UnidadesCentroService,
    private snackBar: MatSnackBar
) { }

  ngOnInit(): void {

  }
  onNoClick(): void {
    this.dialogRef.close({ok: false});
  }

  async confirmDelete() {
    const RESP = await this.servicioRoles.deleteUnidadCentro(this.unidadCentros.id_unidad_centro).toPromise();
    if (RESP.ok) {
      this.snackBar.open(RESP.message, CLOSE, { duration: 5000 });
      this.dialogRef.close({ok: RESP.ok, data: RESP.data});
    } else {
      this.snackBar.open(RESP.message, CLOSE, { duration: 5000 });
    }
  }

}

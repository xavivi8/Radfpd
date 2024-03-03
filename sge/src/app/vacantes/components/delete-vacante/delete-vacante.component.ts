import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Vacante } from '../../interfaces/vacantes.interfaces';
import { VacanteService } from '../../services/vacantes.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CLOSE } from 'src/app/shared/messages';

@Component({
  selector: 'app-delete-vacante',
  templateUrl: './delete-vacante.component.html',
  styleUrls: ['./delete-vacante.component.scss']
})
export class DeleteVacanteComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteVacanteComponent>,
    @Inject(MAT_DIALOG_DATA) public vacante: Vacante,
    private vacanteService: VacanteService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  /**
   * Método asincrónico para eliminar una vacante.
   */
  async deleteVacante() {
    const RESP = await this.vacanteService.deleteVacante(this.vacante.id_vacante).toPromise();
    if (RESP.ok) {
      this.snackBar.open(RESP.message, CLOSE, { duration: 5000 });
      this.dialogRef.close({ok: RESP.ok, data: RESP.data});
    } else {
      this.snackBar.open(RESP.message, CLOSE, { duration: 5000 });
    }
  }

  /**
   * Método para cerrar el diálogo sin eliminar la vacante.
   */
  onNoClick() {
    this.dialogRef.close({ok: false});
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CLOSE } from 'src/app/shared/messages';
import { Alumno } from '../../interfaces/alumno';
import { AlumnoService } from '../../services/alumno.service';

@Component({
  selector: 'app-delete-alumno',
  templateUrl: './delete-alumno.component.html',
  styleUrls: ['./delete-alumno.component.scss']
})
export class DeleteAlumnoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteAlumnoComponent>,
    @Inject(MAT_DIALOG_DATA) public alumno: Alumno,
    public alumnoService: AlumnoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close({ ok: false });
  }

  async confirmDelete() {
    const RESPONSE = await this.alumnoService.deleteAlumno(this.alumno.id).toPromise();

    if (RESPONSE.ok) {
      this.snackBar.open(RESPONSE.message, CLOSE, { duration: 5000 });
      this.dialogRef.close({ ok: RESPONSE.ok, data: RESPONSE.data });
    } else {
      this.snackBar.open(RESPONSE.message, CLOSE, { duration: 5000 });
    }
  }

}

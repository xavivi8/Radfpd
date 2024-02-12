import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivationStart, Router, RouterOutlet } from '@angular/router';
import { EntidadesService } from '../../services/entidades.service';
import { DatosEditarEntidad } from '../../shared/interfaces/datos-editar-entidad';
import { CLOSE } from '../../shared/messages';
import { UnidadesCentro } from 'src/app/shared/interfaces/unidades-centro';
import { UnidadesCentroService } from 'src/app/services/unidades-centro.service';
import { DatosEditarUnidadesCentro } from 'src/app/shared/interfaces/datos-editar-unidades-centro';


@Component({
  selector: 'app-datos-entidad',
  templateUrl: './datos-unidades-centro.component.html',
  styleUrls: ['./datos-unidades-centro.component.scss']
})
export class DatosUnidadesCentroComponent implements OnInit {

  @ViewChild(RouterOutlet, {static: false}) outlet: RouterOutlet;
  rutaSeleccionada: string;
  lastRoute = '';
  entidadForm: FormGroup;

  constructor(
            private router: Router,
            @Inject(MAT_DIALOG_DATA) public datosEditarUnidadesCentro: DatosEditarUnidadesCentro,
            @Inject(MAT_DIALOG_DATA) public datosUnidadCentro: UnidadesCentro,
            private entidadService: UnidadesCentroService,
            private snackBar: MatSnackBar,
            public dialogRef: MatDialogRef<DatosUnidadesCentroComponent>,
            ) { }

  ngOnInit(): void {
    this.rutaSeleccionada = this.router.url.substring(1);
    this.rutaSeleccionada = this.rutaSeleccionada.split('/')[0];
    this.router.navigate([`/${ this.rutaSeleccionada }`, { outlets: { sidebar: 'editar-unidades-centro' } }]);

    this.router.events.subscribe(e => {
      if (e instanceof ActivationStart && e.snapshot.outlet !== this.lastRoute) {
        this.lastRoute = this.rutaSeleccionada;
        this.outlet.deactivate();
      }
    });
    this.entidadService.setUnidadCentro(this.datosUnidadCentro);
  }

  navega(ruta: string) {
    this.router.navigate([`/${ this.rutaSeleccionada }`, { outlets: { sidebar: ruta } }]);
  }

  async save() {
      const RESPONSE = await this.entidadService.editUnidadCentro(this.entidadService.unidades).toPromise();
      console.log(this.entidadService.unidades)
      if (RESPONSE.ok) {
        this.snackBar.open(RESPONSE.message, CLOSE, { duration: 5000 });
        this.dialogRef.close({ok: RESPONSE.ok, entidad: this.datosEditarUnidadesCentro.unidadCentro});
        //this.entidadService.entidades = (await this.entidadService.getAllEntidades().toPromise()).data;
      } else {
        this.snackBar.open(RESPONSE.message, CLOSE, { duration: 5000 });
      }
    }

  onNoClick() {
    this.dialogRef.close({entidad: this.datosEditarUnidadesCentro.unidadCentro});
  }
}

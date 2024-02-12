import { Component, OnInit } from '@angular/core';
import { UnidadesCentroService } from 'src/app/services/unidades-centro.service';
import { CiclosService } from '../../../services/ciclos.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UnidadesCentro } from '../../../shared/interfaces/unidades-centro';
import { Ciclo } from 'src/app/shared/interfaces/ciclo';
import { DatosUnidadesCentroComponent } from '../datos-unidades-centro.component';

@Component({
  selector: 'app-editar-unidades-centro',
  templateUrl: './editar-unidades-centro.component.html',
  styleUrls: ['./editar-unidades-centro.component.scss']
})
export class EditarUnidadesCentroComponent implements OnInit {

  datosForm: FormGroup;
  unidadesCentro: UnidadesCentro;
  ciclos: Ciclo[]

  constructor(
    public unidadCentroService: UnidadesCentroService,
    private CiclosService: CiclosService,
    private datosUnidadCentro: DatosUnidadesCentroComponent
  ) {
  //  this.unidadesCentro = datosUnidadCentro.datosEditarUnidadesCentro; // El mayor palo que he visto en mi vida
  }

  ngOnInit(): void {
    this.setForm();
    this.getCiclos();
    this.datosForm.valueChanges.subscribe(form =>{
      const CILOSENCONTRADOS = this.ciclos.find(ciclo => ciclo.id_ciclo === form.id_ciclo);

      form.ciclo = CILOSENCONTRADOS ? CILOSENCONTRADOS.ciclo : ''
      this.unidadCentroService.setDatosBasicosUnidadesCentro(form);
    })
  }

  setForm(){
    console.log(this.unidadCentroService.unidades,"asddddddddddddddd")
    this.datosForm = new FormGroup({


      id_unidad_centro: new FormControl(this.unidadCentroService.unidades.id_unidad_centro, Validators.required),
      unidad_centro: new FormControl(this.unidadCentroService.unidades.unidad_centro, Validators.required),
      id_ciclo: new FormControl(this.unidadCentroService.unidades.id_ciclo, Validators.required),
      observaciones: new FormControl(this.unidadCentroService.unidades.observaciones),
    })
  }

  async getCiclos(){
    const RESPONSE = await this.CiclosService.getAllCiclos().toPromise()

    if (RESPONSE.ok){
      this.ciclos = RESPONSE.data as Ciclo[];
    }
  }

}

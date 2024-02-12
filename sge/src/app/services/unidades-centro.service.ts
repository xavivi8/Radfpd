import { Injectable } from '@angular/core';
import { Unidad } from '../shared/interfaces/unidad';
import { ApiResponse } from '../shared/interfaces/api-response';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../shared/common.service';
import { URL_API } from 'src/environments/environment';
import { UnidadesCentro } from '../shared/interfaces/unidades-centro';

const ENDPOINT = 'unidades_centro';


@Injectable({
  providedIn: 'root'
})
export class UnidadesCentroService {

  unidad: UnidadesCentro[];
  unidades: UnidadesCentro;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  get() {
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, { headers: this.commonService.headers });
  }

  getUnidadesCentro(idEntidad: number) {
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php?entidad=${idEntidad}`, { headers: this.commonService.headers });
  }

  getAllUnidadesCentro() {
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, { headers: this.commonService.headers });
  }

  addUnidadCentro(unidad: UnidadesCentro) {
    const body = JSON.stringify(unidad);
    return this.http.post<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, body, { headers: this.commonService.headers });
  }

  editUnidadCentro(unidad: UnidadesCentro) {
    const body = JSON.stringify(unidad);
    return this.http.put<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, body, { headers: this.commonService.headers });
  }

  deleteUnidadCentro(id: number|string) {
    return this.http.delete<ApiResponse>(`${URL_API}/${ENDPOINT}.php?id=${id}`, {headers: this.commonService.headers });
  }

  //
  setDatosBasicosUnidadesCentro(formEntidad: any) {

    this.unidades.id_unidad_centro = formEntidad.id_unidad_centro
    this.unidades.unidad_centro = formEntidad.unidad_centro
    this.unidades.id_ciclo = formEntidad.id_ciclo
    this.unidades.observaciones = formEntidad.observaciones


  }

  setUnidadCentro(unidadCentro: UnidadesCentro) {
    this.unidades = unidadCentro
  }

  editUnidadesCentro(unidades: UnidadesCentro) {
    const body = JSON.stringify(unidades);
    return this.http.put<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, body, { headers: this.commonService.headers });
  }
}

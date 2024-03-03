import { Injectable } from "@angular/core";
import { Vacante } from "../interfaces/vacantes.interfaces";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "src/app/shared/common.service";
import { URL_API } from "src/environments/environment";
import { ApiResponse } from "src/app/shared/interfaces/api-response";

const ENDPOINT = 'vacantes';


@Injectable({
  providedIn: 'root'
})
export class VacanteService {

  vacante: Vacante[];

  constructor(
        private http: HttpClient,
        private commonService: CommonService
    ) { }

  /**
   * Método que obtiene la lista de vacantes desde el servidor
   * @returns {ApiResponse} Respuesta del servidor que contiene la lista de vacantes
   */
  getVacantes() {
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, { headers: this.commonService.headers });
  }

  /**
   * Método que agrega una vacante
   * @param vacante Vacante
   * @returns {ApiResponse}
   */
  addVacante(vacante: Vacante) {
    const body = JSON.stringify(vacante);
    return this.http.post<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, body, { headers: this.commonService.headers });
  }

  /**
   * Método que edita una vacante
   * @param vacante Vacante
   * @returns {ApiResponse}
   */
  editVacante(vacante: Vacante) {
    const body = JSON.stringify(vacante);
    return this.http.put<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, body, { headers: this.commonService.headers });
  }

  /**
   * Método que elimina una vacante
   * @param id_vacante ID de la vacante
   * @returns {ApiResponse}
   */
  deleteVacante(id_vacante: number|string) {
    return this.http.delete<ApiResponse>(`${URL_API}/${ENDPOINT}.php?id_vacante=${id_vacante}`, {headers: this.commonService.headers });
  }

  /**
   * Método que devuelve los alumnos de una unidad_centro,
   * contiene una propiedad 'estado' que indica si ha sido seleccionado para una vacante (1) o no (0)
   * @param {number} id_unidad_centro ID de la unidad_centro
   * @returns {ApiResponse}
   */
  getListadoAlumnos(id_unidad_centro: number) {
    const body = JSON.stringify({ id_unidad_centro: id_unidad_centro });
    return this.http.post<ApiResponse>(`${URL_API}/${ENDPOINT}.php?opcion=buscar`, body, { headers: this.commonService.headers });
  }

  /**
   * Mñetodo que inserta los alumnos seleccionados en la vacante en la tabla sgi_vacantes_X_alumnos
   * @param {number} id_vacante ID de la vacante
   * @param {number[]} idAlumnos ID de los alumnos
   * @returns {ApiResponse}
   */
  insertarAlumnosSeleccionados(id_vacante: number, idAlumnos: number[]) {
    const body = JSON.stringify({ id_vacante: id_vacante, alumnosSeleccionados: idAlumnos });
    return this.http.post<ApiResponse>(`${URL_API}/${ENDPOINT}.php?opcion=alumnado`, body, { headers: this.commonService.headers });
  }
}

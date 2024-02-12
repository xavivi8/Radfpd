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

  getVacantes() {
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, { headers: this.commonService.headers });
  }

  addVacante(vacante: Vacante) {
    const body = JSON.stringify(vacante);
    return this.http.post<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, body, { headers: this.commonService.headers });
  }

  editVacante(vacante: Vacante) {
    const body = JSON.stringify(vacante);
    return this.http.put<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, body, { headers: this.commonService.headers });
  }

  deleteVacante(id_vacante: number|string) {
    return this.http.delete<ApiResponse>(`${URL_API}/${ENDPOINT}.php?id_vacante=${id_vacante}`, {headers: this.commonService.headers });
  }

  // Método que devuelve los alumnos de una unidad_centro,
  // contiene una propiedad 'estado' que indica si ha sido seleccionado para una vacante (1) o no (0)
  getListadoAlumnos(id_unidad_centro: number) {
    const body = JSON.stringify({ id_unidad_centro: id_unidad_centro });
    return this.http.post<ApiResponse>(`${URL_API}/${ENDPOINT}.php?opcion=buscar`, body, { headers: this.commonService.headers });
  }

  // Mñetodo que inserta los alumnos seleccionados en la vacante en la tabla sgi_vacantes_X_alumnos
  insertarAlumnosSeleccionados(id_vacante: number, idAlumnos: number[]) {
    const body = JSON.stringify({ id_vacante: id_vacante, alumnosSeleccionados: idAlumnos });
    return this.http.post<ApiResponse>(`${URL_API}/${ENDPOINT}.php?opcion=alumnado`, body, { headers: this.commonService.headers });
  }
}

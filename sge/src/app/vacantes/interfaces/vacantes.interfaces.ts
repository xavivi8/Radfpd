export interface Vacante {
  id_vacante: number;
  entidad: string;
  id_unidad_centro: number;
  num_alumnos: number;
  // Puede ser null al principio
  elegidos_total: string | null;
}

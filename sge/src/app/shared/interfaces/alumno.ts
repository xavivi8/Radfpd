export interface Alumno {
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  id: number;
  linkedin?: string;
  nivelIngles: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  minusvalia: number;
  otraFormacion?: string;
}

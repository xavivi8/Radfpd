import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fecha'
})
export class FechaPipe implements PipeTransform {

  transform(mysqlDate: string): number {
    const mysqlDateObj = new Date(mysqlDate);
    const fechaActual = new Date();


    const diffMs = fechaActual.getTime() - mysqlDateObj.getTime();


    const ano = 1000 * 60 * 60 * 24 * 365.25;
    const edad = diffMs / ano;

    return Math.floor(edad);
  }
}

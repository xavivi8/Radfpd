import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linkedinUrlValidator'
})
export class LinkedinUrlValidatorPipe implements PipeTransform {

  transform(url: string): boolean {

    const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]{5,30}\/?$/;


    return linkedinRegex.test(url);
  }
}

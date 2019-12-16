import { Directive, Attribute, forwardRef } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[igual][ngModel]',
  providers: [
      { provide: NG_VALIDATORS, useExisting: forwardRef(() => ValidacionIgualDirective), multi: true }
  ]
})
export class ValidacionIgualDirective implements Validator {

  constructor( @Attribute('igual') public attr_igual: string) { }

  validate(input_pwd: AbstractControl): ValidationErrors {
    let validation_error: ValidationErrors = null;
    
      let pwd = input_pwd.value; //esta es la pwd
      let nombre = input_pwd.root.get(this.attr_igual).value;//este es el valor del atributo igual (el nombre)

      console.log ("Pasa por el validador");
      console.log ("e = " + nombre);
      console.log ("v = " + pwd);
      if ((nombre !== pwd)) {
        console.log ("Son distintos");
        validation_error = {
          igual: false
        };
      }

    return validation_error;
}
}

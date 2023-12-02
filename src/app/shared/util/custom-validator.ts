import { AbstractControl, FormGroup } from '@angular/forms';

export class CustomValidator {

  /**
   * Custom message for the inputs error of form.
  */
  messageValidation: any = {
    'required': 'Este campo es obligatorio',
    'minLength': 'Este campo debe contener mas de 4 caracteres',
    'maxLength': 'Este campo debe contener menos de 29 caracteres',
    'passwordMatch': 'Las contraseñas no coinciden',
    'pattern': 'No es el formato solicitado',
    'email': 'El campo debe contener un correo electrónico valido',
  };

  constructor() { }

  public validateMatchPassword(control: AbstractControl) {
    const password = control.get('passwordNew')?.value;
    const passwordConfirm = control.get('passwordConfirm')?.value;
    // Compare if the password match
    if (password !== passwordConfirm) {
      control.get('passwordConfirm')?.setErrors({ NoPasswordMatch: true })
    }
  }
  public validateMatchPasswordCredential(control: AbstractControl) {
    const password = control.get('password')?.value;
    const passwordConfirm = control.get('passwordConfirm')?.value;

    // Compare if the password match
    if (password !== passwordConfirm) {
      control.get('passwordConfirm')?.setErrors({ NoPasswordMatch: true })
    }
  }

  /**
   * Muestra y valida el respectivo error del input.
   * 
   * @param {String} controlName - Atributo name del campo.
   * @param {FormGroup} formGroup - Padre del formulario, debe ser un objeto de FormGroup.
   * @return {String} Mensaje de error.
  */
  public getError(controlName: string, formGroup: FormGroup): string {
    let error = '';
    const fieldName = formGroup.get(controlName);
    if (fieldName?.touched && fieldName.errors != null) {
      error = JSON.stringify(fieldName.errors);

      if (fieldName.errors["required"]) {
        error = this.messageValidation.required;
      } else if (fieldName.errors['minlength']) {
        error = this.messageValidation.minLength;
      } else if (fieldName.errors['maxlength']) {
        error = `Este campo debe contener máximo ${ fieldName.errors['maxlength'].requiredLength } caracteres`;
      } else if (fieldName.errors['NoPasswordMatch']) {
        error = this.messageValidation.passwordMatch;
      } else if (fieldName.errors['pattern']) {
        error = this.messageValidation.pattern;
      } else if (fieldName.errors['email']) {
        error = this.messageValidation.email;
      }

      this.addClassToError(controlName, true);
    } else {
      this.addClassToError(controlName, false);
    }
    return error;
  }

  /**
   * Agrega o remueve la clase para mostrar el error
   * dependiendo del caso
   *
   * @param {*} controlName - Atributo name del campo.
   * @param {boolean} showError - Valida cual es la acción a tomar `mostrar` | `ocultar`
   * @memberof CustomValidator
   */
  public addClassToError(controlName: any, showError: boolean) {
    const inputElement = document.querySelector(`[formControlName='${controlName}']`)
    const parentInput = inputElement?.closest('.o-form__field');
    if (parentInput) {
      if (showError) {
        parentInput.classList.add("is-field-error")
      } else {
        parentInput.classList.remove("is-field-error")
      }
    }
  }

}

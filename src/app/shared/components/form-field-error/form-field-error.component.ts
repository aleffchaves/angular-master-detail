import {Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'form-field-error',
  template: `
    <p class="text-danger">
      {{errorMessage}}
    </p>
  `,
  styleUrls: ['./form-field-error.component.css']
})
export class FormFieldErrorComponent {

  @Input('form-control') formControl!: FormControl;

  public get errorMessage(): string | null {

    if (this.verifyIfIsValidAndTouchedFormControl()) {
      return this.getErrorMessage();
    } else {
      return null;
    }
  }

  verifyIfIsValidAndTouchedFormControl(): boolean {
    return this.formControl?.invalid && this.formControl?.touched;
  }

  private getErrorMessage(): string | null {

    if (this.formControl.errors?.['required']) {

      return "Dado Obrigatório";

    } else if (this.formControl.errors?.['email']) {
      return "Formato de email inválido";

    } else if (this.formControl.errors?.['minlength']) {
      const minlength = this.formControl.errors?.['minlength']?.['requiredLength'];

      return `Deve ter no mínimo ${minlength} caracteres`;

    } else if (this.formControl.errors?.['maxlength']) {
      const maxlength = this.formControl.errors?.['maxlength']?.['requiredLength'];

      return `Deve ter no mínimo ${maxlength} caracteres`;
    }

    return null;
  }
}





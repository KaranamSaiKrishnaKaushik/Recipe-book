import { FormGroup } from '@angular/forms';

export function passwordMatchValidator(form: FormGroup) {
  const newPassword = form.get('newPassword')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;
  return newPassword === confirmPassword ? null : { passwordMismatch: true };
}
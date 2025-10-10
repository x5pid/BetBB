import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../shared/ui/card/card.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { InputComponent } from '../../shared/ui/input/input.component';
import { FormComponent } from '../../shared/ui/form/form.component';

@Component({
  selector: 'app-forgot-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardComponent,
    ButtonComponent,
    InputComponent,
    FormComponent
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  private _fb = inject(FormBuilder);

  form = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  isSubmitted = signal(false);
  formErrorMessage = signal<string | null>(null);
  constructor() { }

  onSubmit() {
    if (!this.form.invalid) {
      this.form.markAllAsTouched();
      this.formErrorMessage.set('Veuillez corriger les champs invalides.');
      this.isSubmitted.set(false);
      // this.form.get('email')?.setErrors({ backend: 'Email invalide selon le serveur' });
      return;
    }

    this.formErrorMessage.set(null); // Pas d’erreur = pas de bandeau
    this.isSubmitted.set(true);
    // Envoyer les données…
  }
}

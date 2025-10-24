import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CardComponent } from '../../shared/ui/card/card.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { InputComponent } from '../../shared/ui/input/input.component';
import { FormComponent } from '../../shared/ui/form/form.component';
import { AuthService } from '../../core/services/auth.service';
import { Email } from '../../core/models/auth.model';

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
  private _service = inject(AuthService);
  private _router = inject(Router);

  isSubmitted = signal(false);
  countdown = signal(10);

  form = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  intervalId?: number;

  constructor() {
    effect(()=> {
      if(this.isSubmitted() && !this.intervalId){
        this.intervalId = setInterval(() => {
          const value = this.countdown();
          if (value > 0) {
            this.countdown.set(value - 1);
          } else {
            clearInterval(this.intervalId);
            this._router.navigate(['/login']); // page de redirection
          }
        }, 1000);
      }
    })
  }

  onSubmit() {
    if (this.form.valid) {
      const email = this.form.value as Email;
      this._service.forgetPassword(email);
    }
    this.isSubmitted.set(true);
  }
}

import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
/*UI*/
import { CardComponent } from '../../shared/ui/card/card.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { InputComponent } from '../../shared/ui/input/input.component';
import { FormComponent } from '../../shared/ui/form/form.component';
import { MessageComponent } from '../../shared/ui/message/message';

/*SERVICE*/
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardComponent,
    ButtonComponent,
    InputComponent,
    FormComponent,
    MessageComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private _fb = inject(FormBuilder);
  private _authService = inject(AuthService);

  private _router = inject(Router);
  private isAuthenticated = this._authService.isAuthenticated;

  isSubmitted = this._authService.token.loading;
  error = this._authService.token.error;

  form = this._fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      if (this.isAuthenticated()) {
        this._router.navigate(['/folders']);
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const { email, password } = this.form.value;
      if (!email || !password) return;
      this._authService.login(email,password);
    }
  }

}

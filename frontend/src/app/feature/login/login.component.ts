import { Component, computed, effect, inject, OnDestroy, Signal, signal } from '@angular/core';
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
import { Subject, Subscription } from 'rxjs';

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

  readonly msgMiss = "Veuillez renseigner ce champ.";

  isSubmitted = this._authService.token.loading;
  error = this._authService.token.error;
  isError = computed(()=> !!this.error());

  form = this._fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  private _msgEmptyEmail = signal(false);
  msgEmptyEmail = this._msgEmptyEmail.asReadonly();

  private _msgEmptyPassword = signal(false);
  msgEmptyPassword = this._msgEmptyPassword.asReadonly();

  private _focusEmail$ = new Subject<void>();
  focusEmail$ = this._focusEmail$.asObservable();

  private _focusPassword$ = new Subject<void>();
  focusPassword$ = this._focusPassword$.asObservable();

  constructor() {
    effect(() => {
      if (this.isAuthenticated()) {
        this._router.navigate(['/bet']);
      }
    });
  }

  onEmailBlur(){
    this._msgEmptyEmail.set(false);
  }
  onEmailChange(newValue: string) {
    if(newValue) this._msgEmptyEmail.set(false);
  }

  onPasswordBlur(){
    this._msgEmptyEmail.set(false);
  }
  onPasswordChange(newValue: string) {
    if(newValue) this._msgEmptyPassword.set(false);
  }

  onSubmit() {

    if (this.form.valid) {
      const { email, password } = this.form.value;
      if (!email || !password) return;
      this._authService.login(email,password);
      this.form.controls["password"].reset();
    }else{
      if(this.form.controls['email'].invalid){
        this._msgEmptyEmail.set(true);
        this._focusEmail$.next();
      } else if(this.form.controls['password'].invalid){
        this._msgEmptyPassword.set(true);
        this._focusPassword$.next();
      }
    }
  }

}

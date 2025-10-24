import { Component, inject, signal, effect, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { catchError, finalize, map, Observable, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
/*UI*/
import { CardComponent } from '../../shared/ui/card/card.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { InputComponent } from '../../shared/ui/input/input.component';
import { FormComponent } from '../../shared/ui/form/form.component';
import { AuthService } from '../../core/services/auth.service';
import { ValidationService } from '../../core/services/validate.service';
import { RegisterPayload } from '../../core/models/auth.model';
/*SERVICE*/
// import { AuthService } from '../../../../core/services/auth.service';
// import { ValidationService } from '../../../../core/services/validate.service';
/*MODEL*/
// import { RegisterPayload } from '../../../../models/auth.model';
// import { ApiErrorResponse } from '../../../../models/error.model';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardComponent,
    ButtonComponent,
    InputComponent,
    FormComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private _fb = inject(FormBuilder);
  private _service = inject(AuthService);
  private _serviceValidate = inject(ValidationService);
  private _router = inject(Router);

  readonly passordInfo = "Password should be at least 15 characters OR at least 8 characters including a number and a lowercase letter.";
  readonly usernameInfo = "Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.";

  //#region Form Initialization
  form = this._fb.group({
    email: this._fb.control('',
      {
        validators: [Validators.required],
        asyncValidators: [this.emailValidator.bind(this)],
        updateOn: 'blur',
      }
    ),
    password: this._fb.control('',
      {
        validators: [Validators.required],
        asyncValidators: [this.passwordValidator.bind(this)],
        updateOn: 'blur',
      }
    ),
    username: this._fb.control('',
      {
        validators: [Validators.required],
        asyncValidators: [this.usernameValidator.bind(this)],
        updateOn: 'blur',
      }
    ),
  });
  //#endregion

  //#region Validator
  emailValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return this._serviceValidate.validateEmail(control.value).pipe(
      map(() => null),
      catchError(error => {
        const message = error?.error?.errors?.email || 'Erreur inconnue';
        return of({ invalidEmail: message });
      })
    );
  }

  passwordValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return this._serviceValidate.validatePassword(control.value).pipe(
      map(() => null),
      catchError(error => {
        const message = error?.error?.errors?.password || 'Erreur inconnue';
        return of({ invalidPassword: message });
      })
    );
  }

  usernameValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return this._serviceValidate.validateUsername(control.value).pipe(
      map(() => null),
      catchError(error => {
        const message = error?.error?.errors?.username || 'Erreur inconnue';
        return of({ invalidUsername: message });
      })
    );
  }
  //#endregion

  //#region Form Error

  readonly emailStatus = toSignal(this.form.controls['email'].statusChanges, {
    initialValue: this.form.controls['email'].status
  });

  readonly emailTouched = toSignal(this.form.controls['email'].valueChanges.pipe(
    map(() => this.form.controls['email'].touched)
  ), { initialValue: this.form.controls['email'].touched });

  readonly emailErrorMessage = computed(() => {
    this.emailStatus(); // 👈 Dépendance obligatoire pour réactivité
    this.emailTouched(); // 👈 Dépendance obligatoire pour réactivité
    const control = this.form.controls['email'];
    const errors = control.errors;
    if (!errors || !control.touched) return '';

    // Gestion automatique des erreurs
    if (errors['invalidEmail']) return errors['invalidEmail'];
    if (errors['required']) return 'Email cannot be blank';

    return '';
  });

  readonly passwordStatus = toSignal(this.form.controls['password'].statusChanges, {
    initialValue: this.form.controls['password'].status
  });

  readonly passwordTouched = toSignal(this.form.controls['password'].valueChanges.pipe(
    map(() => this.form.controls['password'].touched)
  ), { initialValue: this.form.controls['password'].touched });

  readonly passwordErrorMessage = computed(() => {
    this.passwordStatus(); // 👈 Dépendance obligatoire pour réactivité
    this.passwordTouched(); // 👈 Dépendance obligatoire pour réactivité
    const control = this.form.controls['password'];
    const errors = control.errors;
    if (!errors || !control.touched) return '';

    // Gestion automatique des erreurs
    if (errors['invalidPassword']) return errors['invalidPassword'];
    if (errors['required']) return 'Password cannot be blank';

    return '';
  });

  readonly usernameStatus = toSignal(this.form.controls['username'].statusChanges, {
    initialValue: this.form.controls['username'].status
  });

  readonly usernameTouched = toSignal(this.form.controls['username'].valueChanges.pipe(
    map(() => this.form.controls['username'].touched)
  ), { initialValue: this.form.controls['username'].touched });

  readonly usernameErrorMessage = computed(() => {
    this.usernameStatus(); // 👈 Dépendance obligatoire pour réactivité
    this.usernameTouched(); // 👈 Dépendance obligatoire pour réactivité
    const control = this.form.controls['username'];
    const errors = control.errors;
    if (!errors || !control.touched) return '';

    // Gestion automatique des erreurs
    if (errors['invalidUsername']) return errors['invalidUsername'];
    if (errors['required']) return 'Username cannot be blank';

    return '';
  });

  //#endregion

  isSubmitted = this._service.registration.loading;
  success = this._service.registration.success;
  countdown = signal(10);

  intervalId?: number;

  constructor() {
    effect(() =>{
      if (this.success()) {
        if(!this.intervalId){
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
      }
    });
  }

  onSubmit() {
    if(this.form.valid){
      const payload = this.form.value as RegisterPayload;
      this._service.register(payload);
    }else {
      this.form.markAllAsTouched();
      this.form.controls['email'].markAsTouched();
      this.form.controls['password'].markAsTouched();
      this.form.controls['username'].markAsTouched();
      this.form.controls['email'].updateValueAndValidity();
      this.form.controls['password'].updateValueAndValidity();
      this.form.controls['username'].updateValueAndValidity();
    }
  }

}

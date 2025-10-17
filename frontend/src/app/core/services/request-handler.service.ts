import { Injectable, signal, Signal } from '@angular/core';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { ErrorResponse } from '../models/error.model';
import { HttpErrorResponse } from '@angular/common/http';

export interface RequestState<T> {
  loading: Signal<boolean>;
  error: Signal<ErrorResponse | null>;
  data: Signal<T | null>;
}

@Injectable({ providedIn: 'root' })
export class RequestHandlerService {

  createRequestState<T>()
  {
    const loading = signal(false);
    const error = signal<string | null>(null);
    const data = signal<T | null>(null);
    const success = signal(false);

    function run(
      obs$: Observable<T>,
      options?: {
        onSuccess?: (res: T) => void;
        onError?: (err: ErrorResponse) => ErrorResponse | null;
      }
    ) {
      success.set(false);
      loading.set(true);
      error.set(null);

      obs$
        .pipe(
          catchError((err: HttpErrorResponse) => {
            const errorReponse = ErrorResponse.fromError(err)
            const msg = options?.onError?.(errorReponse) ??  errorReponse;
            error.set(msg.detail);
            return throwError(() => err);
          }),
          finalize(() => loading.set(false))
        )
        .subscribe({
          next: res => {
            success.set(true);
            data.set(res);
            options?.onSuccess?.(res);
          }
        });
    }

    function reset() {
      loading.set(false);
      error.set(null);
      data.set(null);
    }

    function updateData(newData: T) {
      data.set(newData);
    }

    return {
      state: {
        loading: loading.asReadonly(),
        error: error.asReadonly(),
        data: data.asReadonly(),
        success: success.asReadonly(),
      },
      run,
      updateData,
      reset,
    };
  }
}

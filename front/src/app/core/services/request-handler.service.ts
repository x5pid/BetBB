import { Injectable, signal, Signal } from '@angular/core';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { ApiError, ApiErrorResponse } from '../models/error.model';

export interface RequestState<T> {
  loading: Signal<boolean>;
  error: Signal<ApiErrorResponse | null>;
  data: Signal<T | null>;
}

@Injectable({ providedIn: 'root' })
export class RequestHandlerService {

  createRequestState<T>()
  {
    const loading = signal(false);
    const error = signal<ApiErrorResponse | null>(null);
    const data = signal<T | null>(null);
    const success = signal(false);

    function run(
      obs$: Observable<T>,
      options?: {
        onSuccess?: (res: T) => void;
        onError?: (err: ApiErrorResponse) => ApiErrorResponse | null;
      }
    ) {
      success.set(false);
      loading.set(true);
      error.set(null);

      obs$
        .pipe(
          catchError((err: any) => {
            const apiError = ApiErrorResponse.fromError(err?.error);
            const msg = options?.onError?.(apiError) ??  apiError;
            error.set(msg);
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

import { signal, Signal, WritableSignal } from '@angular/core';
import { finalize, Observable } from 'rxjs';

type RequestState<T> = {
  loading: WritableSignal<boolean>;
  error: WritableSignal<string | null>;
  data: WritableSignal<T | null>;
};

export abstract class ApiStateService<T> {
  protected requestStates: Record<string, RequestState<T>> = {};

  protected initState(key: string) {
    if (!this.requestStates[key]) {
      this.requestStates[key] = {
        loading: signal(false),
        error: signal(null),
        data: signal(null),
      };
    }
  }

  protected handleRequest(key: string, request$: Observable<T>) {
    this.initState(key);
    this.requestStates[key].loading.set(true);
    this.requestStates[key].error.set(null);

    request$
      .pipe(finalize(() => this.requestStates[key].loading.set(false)))
      .subscribe({
        next: res => this.requestStates[key].data.set(res),
        error: err => this.requestStates[key].error.set(err.message || 'Erreur inconnue'),
      });
  }

  protected setData(key: string, value: T) {
    this.initState(key);
    this.requestStates[key].data.set(value);
  }

  protected setLoading(key: string, value: boolean) {
    this.initState(key);
    this.requestStates[key].loading.set(value);
  }

  protected setError(key: string, error: string | null) {
    this.initState(key);
    this.requestStates[key].error.set(error);
  }
}

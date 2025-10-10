import { HttpClient } from "@angular/common/http";
import { inject, signal } from "@angular/core";
import { finalize, Observable } from "rxjs";
import { API_URL } from "../../tokens";

export abstract class BaseService<T> {
  private _http = inject(HttpClient);
  private readonly _apiUrl = inject(API_URL);
  protected baseUrl = `${this._apiUrl}/${this.getEndpoint()}`;

  protected readonly _loading = signal(false);
  public readonly loading = this._loading.asReadonly(); // exposé readonly

  constructor(){}

  protected abstract getEndpoint(): string;

  getAll(): Observable<T[]> {
    this._loading.set(true);
    return this._http.get<T[]>(this.baseUrl).pipe(
      finalize(() => this._loading.set(false))
    );
  }

  getById(id: number): Observable<T> {
    return this._http.get<T>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<T>): Observable<T> {
    return this._http.post<T>(this.baseUrl, data);
  }

  update(id: number, data: Partial<T>): Observable<T> {
    return this._http.put<T>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this._http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

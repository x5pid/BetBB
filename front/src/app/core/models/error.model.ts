
export interface ApiError {
  detail: ApiFieldError[];
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export class ApiErrorResponse {
  private _detail: ApiFieldError[];

  constructor(detail: ApiFieldError[] = []) {
    this._detail = detail;
  }

  static fromError(error: ApiError): ApiErrorResponse {
    const detail = error?.detail;
    if (Array.isArray(detail) && detail.every(e => typeof e.field === 'string' && typeof e.message === 'string')) {
      return new ApiErrorResponse(detail);
    }
    return ApiErrorResponse.create('inconnue', 'Erreur inconnue');
  }

  // Ajoute une nouvelle erreur au tableau detail
  static create(field: string, message: string): ApiErrorResponse {
    return new ApiErrorResponse([{ field, message }]);
  }

  // Récupère tous les messages sous forme de tableau
  getMessages(): string[] {
    return this._detail.map(e => e.message);
  }

  // Récupère un message d'erreur pour un champ précis
  getMessageForField(field: string): string | undefined {
    const error = this._detail.find(e => e.field === field);
    return error ? error.message : undefined;
  }

  // Vérifie s'il y a une erreur pour un champ donné
  hasError(field: string): boolean {
    return this._detail.some(e => e.field === field);
  }

  // Récupère tous les messages sous forme d'une seule string concaténée
  toString(separator: string = ', '): string {
    return this.getMessages().join(separator);
  }
}

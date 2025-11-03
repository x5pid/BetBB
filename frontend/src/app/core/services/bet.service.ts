import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../tokens';
import { RequestHandlerService } from './request-handler.service';

@Injectable({
  providedIn: 'root'
})
export class BetService {
  private _http = inject(HttpClient);
  private readonly _apiUrl = inject(API_URL);
  private _requestHandler = inject(RequestHandlerService);

  private readonly _bet = this._requestHandler.createRequestState<Bet[]>();
  bet = this._bet?.state;

  private readonly _bets = this._requestHandler.createRequestState<Bet[]>();
  bets = this._bets?.state;

  private readonly _createBet = this._requestHandler.createRequestState<Bet>();
  createBet = this._createBet?.state;

  constructor() {}

  createBetMe(bet: CreateBetRequest) {
    const req$ = this._http.post<Bet>(`${this._apiUrl}/bets/me`, bet);
    this._createBet.run(req$);
  }

  getBetMe() {
    const req$ = this._http.get<Bet[]>(`${this._apiUrl}/bets/me`);
    this._bet.run(req$);
  }

  getBetAll() {
    const req$ = this._http.get<Bet[]>(`${this._apiUrl}/bets`);
    this._bets.run(req$);
  }

}

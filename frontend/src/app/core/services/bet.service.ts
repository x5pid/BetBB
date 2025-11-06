import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../tokens';
import { RequestHandlerService } from './request-handler.service';
import { Observable } from 'rxjs';
import { Bet, BetStatResponse, BetUserResponse, CreateBetRequest } from '../models/bet.model';

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

  private readonly _gender = this._requestHandler.createRequestState<string[]>();
  gender = this._gender?.state;

  private readonly _symbolicObject= this._requestHandler.createRequestState<string[]>();
  symbolicObject = this._symbolicObject?.state;

  private readonly _betStats = this._requestHandler.createRequestState<BetStatResponse>();
  betStats = this._betStats?.state;

  private readonly _userBetStats = this._requestHandler.createRequestState<BetUserResponse>();
  userBetStats = this._userBetStats?.state;

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

  getGender() {
    const req$ = this._http.get<string[]>(`${this._apiUrl}/genres`);
    this._gender.run(req$);
  }

  getSymbolicObject() {
    const req$ = this._http.get<string[]>(`${this._apiUrl}/symbolic-objects`);
    this._symbolicObject.run(req$);
  }

  getBetStats() {
    const req$ = this._http.get<BetStatResponse>(`${this._apiUrl}/bets/stats`);
    this._betStats.run(req$);
  }

  getUserBetStats() {
    const req$ = this._http.get<BetUserResponse>(`${this._apiUrl}/bets/user`);
    this._userBetStats.run(req$);
  }
}

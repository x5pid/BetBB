import { Component, computed, inject, signal } from '@angular/core';
import { BetForm } from './bet-form/bet-form';
import { BetStat } from './bet-stat/bet-stat';
import { BetSvgBebe } from './bet-svg-bebe/bet-svg-bebe';
import { BetSvgPig } from './bet-svg-pig/bet-svg-pig';
import { BetService } from '../../core/services/bet.service';

@Component({
  selector: 'app-bet',
  imports: [
    BetForm,
    BetStat,
    BetSvgBebe,
    BetSvgPig,
  ],
  templateUrl: './bet.html',
  styleUrl: './bet.scss'
})
export class Bet {
  private _serviceBet = inject(BetService);

  bet = this._serviceBet.bet;
  bets = this._serviceBet.bets;
  betStats = this._serviceBet.betStats;
  userBetStats = this._serviceBet.userBetStats;

  constructor(){
    this._serviceBet.getBetMe();
    this._serviceBet.getBetAll();
    this._serviceBet.getBetStats();
    this._serviceBet.getUserBetStats();
  }
}

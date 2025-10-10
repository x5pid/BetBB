import { Component, signal } from '@angular/core';
import { BetForm } from './bet-form/bet-form';
import { BetStat } from './bet-stat/bet-stat';
import { BetSvgBebe } from './bet-svg-bebe/bet-svg-bebe';
import { BetSvgPig } from './bet-svg-pig/bet-svg-pig';

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

  // Odds
  oddsBoy = signal(2.00);
  oddsGirl = signal(1.00);
  // Total
  totalBoy = signal(0);
  totalGirl = signal(0);
  userTotal = signal(0);
}

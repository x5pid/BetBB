import { Component, computed, inject } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { BetForm } from './bet-form/bet-form';
import { BetStat } from './bet-stat/bet-stat';
import { BetService } from '../../../core/services/bet.service';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bet-detail',
  imports: [
    MatBottomSheetModule,
    BetStat,
    DecimalPipe,
  ],
  templateUrl: './bet-detail.html',
  styleUrl: './bet-detail.scss'
})
export class BetDetail {
  private _bottomSheet = inject(MatBottomSheet);
  private _serviceBet = inject(BetService);
  private _router = inject(Router);
  // Bet Stats
  private _betStats = this._serviceBet.betStats?.data;
  betStatsSuccess = this._serviceBet.betStats?.success;
  betStatsLoading = this._serviceBet.betStats?.loading;
  // User Bet Stats
  private _userBetStats = this._serviceBet.userBetStats?.data;
  userBetStatsSuccess = this._serviceBet.userBetStats?.success;
  userBetStatsLoading = this._serviceBet.userBetStats?.loading;
  //History
  betMe = this._serviceBet.bet;
  betMeData = this.betMe.data;
  betMeLoading = this.betMe.loading;
  betMeSuccess = this.betMe.success;
  // Odds
  oddsBoy = computed(() => this._betStats()?.boy_odds ?? 1.00);
  oddsGirl = computed(() => this._betStats()?.girl_odds ?? 1.00);

  isMyBet = computed(() => {
    const history = this.betMeData();
    if (!history) return false;
    return history.length > 0;
  });

  //Potential
  potencial = computed(() => {
    const stats = this._userBetStats();
    if (!stats) return 0;
    const amount = Number(stats.amount) || 0;
    const odds = stats.gender === 'Fille' ? this.oddsGirl() : this.oddsBoy();
    return amount * odds;
  });

  userAmount = computed(() => {
    const stats = this._userBetStats();
    if (!stats) return 0;
    return Number(stats.amount) || 0;
  });
  userGender = computed(() => {
    const stats = this._userBetStats();
    if (!stats) return '';
    return stats.gender;
  });

  openSheet(){
    this._bottomSheet.open(BetForm);
  }

  navigateToHistory(){
    this._router.navigate(['/bet/history']);
  }
}



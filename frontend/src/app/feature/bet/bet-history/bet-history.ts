import { Component, inject } from '@angular/core';
import { BetService } from '../../../core/services/bet.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-bet-history',
  imports: [
    DatePipe
  ],
  templateUrl: './bet-history.html',
  styleUrl: './bet-history.scss'
})
export class BetHistory {
  private _serviceBet = inject(BetService);

  betMe = this._serviceBet.bet;
  betMeData = this.betMe.data;
  betMeLoading = this.betMe.loading;
  betMeSuccess = this.betMe.success;
}



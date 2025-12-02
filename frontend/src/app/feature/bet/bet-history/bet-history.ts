import { Component, inject } from '@angular/core';
import { BetService } from '../../../core/services/bet.service';
import { DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bet-history',
  imports: [
    DatePipe,
    MatIcon
  ],
  templateUrl: './bet-history.html',
  styleUrl: './bet-history.scss'
})
export class BetHistory {
  private _serviceBet = inject(BetService);
  private _router = inject(Router);

  betMe = this._serviceBet.bet;
  betMeData = this.betMe.data;
  betMeLoading = this.betMe.loading;
  betMeSuccess = this.betMe.success;

  navigateToBet(){
    this._router.navigate(['/bet']);
  }
}



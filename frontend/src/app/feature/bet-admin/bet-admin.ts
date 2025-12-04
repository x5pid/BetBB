import { Component, inject } from '@angular/core';
import { BetService } from '../../core/services/bet.service';
import { DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bet-admin',
  imports: [
    DatePipe,
  ],
  templateUrl: './bet-admin.html',
  styleUrl: './bet-admin.scss'
})
export class BetAdmin {
  private _serviceBet = inject(BetService);

  bets = this._serviceBet.bets;
  betsData = this.bets.data;
  betsLoading = this.bets.loading;
  betsSuccess = this.bets.success;

  constructor(){
    this._serviceBet.getBetAll();
  }

}



import { Component, inject } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { BetForm } from './bet-form/bet-form';
import { BetStat } from './bet-stat/bet-stat';

@Component({
  selector: 'app-bet-detail',
  imports: [
    MatBottomSheetModule,
    BetStat
  ],
  templateUrl: './bet-detail.html',
  styleUrl: './bet-detail.scss'
})
export class BetDetail {
  private _bottomSheet = inject(MatBottomSheet);

  openSheet(){
    this._bottomSheet.open(BetForm);
  }
}



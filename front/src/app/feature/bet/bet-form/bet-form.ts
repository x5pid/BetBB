import { Component, computed, input, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CoinDropDirective } from './coin-drop.directive';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bet-form',
  imports: [
    DecimalPipe,
    CoinDropDirective,
    FormsModule
  ],
  templateUrl: './bet-form.html',
  styleUrl: './bet-form.scss'
})
export class BetForm {
  // Odds
  oddsBoy = input.required<number>();
  oddsGirl = input.required<number>();
  // Total
  totalBoy = input.required<number>();
  totalGirl = input.required<number>();
  userTotal = input.required<number>();

  // Form
  userStake = signal(5) ;
  selectedChoiceBebe = signal<string>('boy'); // valeur initiale

  // Potential
  potential = computed(() => {
    const userStake = this.userStake();
    if(userStake && userStake > 0){
      const odds = this.selectedChoiceBebe() == 'boy' ? this.oddsBoy() : this.oddsGirl() ;
      return userStake * odds;
    }
    return 0;
  });


  constructor() {
  }

  onStakeChange(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.userStake.set(Number(inputValue));
  }

  onChoiceChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedChoiceBebe.set(value);
  }

  onSubmit(event: Event) {
  }
}

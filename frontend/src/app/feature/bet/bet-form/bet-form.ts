import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CoinDropDirective } from './coin-drop.directive';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BetService } from '../../../core/services/bet.service';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { FormComponent } from '../../../shared/ui/form/form.component';

@Component({
  selector: 'app-bet-form',
  imports: [
    DecimalPipe,
    CoinDropDirective,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    //CardComponent,
    // ButtonComponent,
    // InputComponent,
    FormComponent
  ],
  templateUrl: './bet-form.html',
  styleUrl: './bet-form.scss'
})
export class BetForm {
  private _serviceBet = inject(BetService);
  private _fb = inject(FormBuilder);

  private _gender = this._serviceBet.gender;
  genders = this._gender.data;
  private _isGender = this._gender.success;

  private _symbolicObject = this._serviceBet.symbolicObject;
  symbolicObject = this._symbolicObject.data;
  private _hasSymbolicObject = this._symbolicObject.success;

  form = this._fb.group({
    amount: [1, [Validators.required]],
    gender: ['', [Validators.required]],
    symbolic_object: ['', [Validators.required]],
  });

  constructor() {
    effect(()=>{
      if(this._isGender()){
        const list = this.genders();
        const value = list && list.length > 0 ? list[0] : '';
        this.form.controls['gender'].setValue(value);
      }
    });
  }


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




  onStakeChange(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.userStake.set(Number(inputValue));
  }

  onChoiceChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedChoiceBebe.set(value);
  }

  onSubmit() {
    if(this.form.valid){

    }
  }
}

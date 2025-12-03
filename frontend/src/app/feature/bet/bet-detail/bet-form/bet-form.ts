import { Component, computed, effect, inject, input, Optional, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CoinDropDirective } from './coin-drop.directive';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BetService } from '../../../../core/services/bet.service';
import { CreateBetRequest } from '../../../../core/models/bet.model';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { FormComponent } from '../../../../shared/ui/form/form.component';
import { MatDialogRef } from '@angular/material/dialog';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-bet-form',
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
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
  private _symbolicObjectData = this._symbolicObject.data;
  private _hasSymbolicObject = this._symbolicObject.success;

  // Mapper les objets symboliques avec leur classe d'icône
  symbolicObjectWithClass = computed(() => {
    const objects = this._symbolicObjectData();
    if (!objects) return [];

    const iconMap: { [key: string]: string } = {
      'Peluche': '🧸',
      'Sucette': '🍭',
      'Biberon': '🍼',
      'Jouet': '🎠'
    };

    return objects.map(object => ({
      value: object,
      icon: iconMap[object] || ''
    }));
  });

  form = this._fb.group({
    amount: [5, [Validators.required, Validators.min(1)]],
    gender: ['', [Validators.required]],
    symbolic_object: ['', [Validators.required]],
  });

  constructor(
    @Optional() private dialogRef?: MatDialogRef<BetForm>,
    @Optional() private bottomSheetRef?: MatBottomSheetRef<BetForm>
  ) {
    effect(()=>{
      if(this._isGender()){
        const list = this.genders();
        const value = list && list.length > 0 ? list[0] : '';
        this.form.controls['gender'].setValue(value);
      }
    });
    effect(()=>{
      if(this._hasSymbolicObject()){
        const list = this._symbolicObjectData();
        const value = list && list.length > 0 ? list[0] : '';
        this.form.controls['symbolic_object'].setValue(value);
      }
    });

    this._serviceBet.getGender();
    this._serviceBet.getSymbolicObject();
  }
  // Bet Stats
  private _betStats = this._serviceBet.betStats?.data;
  betStatsSuccess = this._serviceBet.betStats?.success;
  betStatsLoading = this._serviceBet.betStats?.loading;
  // User Bet Stats
  private _userBetStats = this._serviceBet.userBetStats?.data;
  userBetStatsSuccess = this._serviceBet.userBetStats?.success;
  userBetStatsLoading = this._serviceBet.userBetStats?.loading;

  // Odds
  oddsBoy = computed(() => this._betStats()?.boy_odds ?? 1.00);
  oddsGirl = computed(() => this._betStats()?.girl_odds ?? 1.00);
  // Total
  totalBoy = computed(() => this._betStats()?.boy_total ?? 0);
  totalGirl = computed(() => this._betStats()?.girl_total ?? 0);
  userTotal = computed(() => this._userBetStats()?.amount ?? 0);
  userGender = computed(() => this._userBetStats()?.gender ?? '_');

  // Form
  userStake = signal(5) ;
  selectedChoiceBebe = signal<string>(''); // valeur initiale

  // Potential
  potential = computed(() => {
    const userStake = this.userStake();
    if(userStake && userStake > 0){
      const odds = this.selectedChoiceBebe() == 'boy' ? this.oddsBoy() : this.oddsGirl() ;
      return (userStake * odds).toFixed(2);
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
      const formValue = this.form.value;
      const betRequest: CreateBetRequest = {
        amount: Number(formValue.amount),
        gender: formValue.gender!,
        symbolic_object: formValue.symbolic_object!
      };

      this._serviceBet.createBetMe(betRequest);
      this.close();
    }
  }

  close(): void {
    if (this.dialogRef) {
      this.dialogRef.close('success');
    } else if (this.bottomSheetRef) {
      this.bottomSheetRef.dismiss('success');
    }
  }
}

import { Injectable, signal, computed } from '@angular/core';

export interface TutorialStep {
  id: string;
  selector: string; // Sélecteur CSS pour l'élément à mettre en surbrillance
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  offset?: { x: number; y: number };
}

@Injectable({
  providedIn: 'root'
})
export class TutorialService {
  private _isActive = signal<boolean>(false);
  private _currentStepIndex = signal<number>(0);
  private _steps = signal<TutorialStep[]>([]);

  isActive = this._isActive.asReadonly();
  currentStepIndex = this._currentStepIndex.asReadonly();
  steps = this._steps.asReadonly();

  currentStep = computed(() => {
    const index = this._currentStepIndex();
    const steps = this._steps();
    return steps[index] || null;
  });

  isFirstStep = computed(() => this._currentStepIndex() === 0);
  isLastStep = computed(() => {
    const index = this._currentStepIndex();
    const steps = this._steps();
    return index === steps.length - 1;
  });

  start(steps: TutorialStep[]): void {
    this._steps.set(steps);
    this._currentStepIndex.set(0);
    this._isActive.set(true);
  }

  next(): void {
    const currentIndex = this._currentStepIndex();
    const steps = this._steps();
    if (currentIndex < steps.length - 1) {
      this._currentStepIndex.set(currentIndex + 1);
    }
  }

  previous(): void {
    const currentIndex = this._currentStepIndex();
    if (currentIndex > 0) {
      this._currentStepIndex.set(currentIndex - 1);
    }
  }

  stop(): void {
    this._isActive.set(false);
    this._currentStepIndex.set(0);
    this._steps.set([]);
  }

  goToStep(index: number): void {
    if (index >= 0 && index < this._steps().length) {
      this._currentStepIndex.set(index);
    }
  }
}


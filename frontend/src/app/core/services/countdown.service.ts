import { inject, Injectable } from '@angular/core';
import { signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CountDownService {
  
  private readonly endDate = new Date('2025-12-06T9:00:00').getTime();

  // Signal du temps courant
  now = signal(Date.now());

  // On met à jour le signal toutes les secondes
  constructor() {
    setInterval(() => {
      this.now.set(Date.now());
    }, 1000);
  }

  // Signal calculé
  //isEnded = computed(() => this.now() >= this.endDate);
  isEnded = signal(true);

}

import { Component, inject } from "@angular/core";
import { Countdown } from "../../shared/components/countdown/countdown";
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [
    Countdown,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private _router = inject(Router);

  constructor() {
  }

  goToPage() {
    this._router.navigate(['/login']);
  }

}

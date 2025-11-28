import { Component, inject } from "@angular/core";
import { Countdown } from "../countdown/countdown";
import { MatButton } from "@angular/material/button";
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [
    Countdown,
    MatButton
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

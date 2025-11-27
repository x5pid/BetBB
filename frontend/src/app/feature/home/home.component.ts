import { Component } from "@angular/core";
import { Countdown } from "../countdown/countdown";
import { MatButton } from "@angular/material/button";

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

  constructor() {
  }
}

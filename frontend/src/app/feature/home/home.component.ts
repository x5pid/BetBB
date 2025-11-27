import { Component } from "@angular/core";
import { Countdown } from "../countdown/countdown";

@Component({
  selector: 'app-home',
  imports: [
    Countdown
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor() {
  }
}

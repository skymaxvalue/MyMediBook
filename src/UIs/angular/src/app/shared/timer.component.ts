import { Component, OnInit, OnDestroy } from "@angular/core";


@Component({
  selector: "app-timer",
  templateUrl: "./timer.component.html",
  styleUrls: [],
  standalone: true,
  imports: [],
})
export class TimerComponent implements OnInit, OnDestroy {
  interval: any;
  years: number = 0;
  months: number = 0;
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  getTime = () => {
    const currentDateTime = new Date();
    this.years = currentDateTime.getFullYear();
    this.months = currentDateTime.getMonth() + 1;
    this.days = currentDateTime.getDate();
    this.hours = currentDateTime.getHours();
    this.minutes = currentDateTime.getMinutes();
    this.seconds = currentDateTime.getSeconds();
  };

  ngOnInit() {
    this.interval = setInterval(() => {
      this.getTime();
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}

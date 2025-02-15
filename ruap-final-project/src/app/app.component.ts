import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Data, RouterOutlet } from '@angular/router';
import Papa from 'papaparse';
import { PrimeNG } from 'primeng/config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private primeng: PrimeNG) {}

  ngOnInit() {
    this.primeng.ripple.set(true);
  }
}

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Data, RouterOutlet } from '@angular/router';
import Papa from 'papaparse';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.httpClient
      .get('assets/salary_data_cleaned.csv', { responseType: 'text' })
      .subscribe((csvData) => {
        const parsed = Papa.parse<Data>(csvData, {
          delimiter: ',',
          header: true,
        });

        const { data } = parsed;
        console.log(data[0]);
      });
  }
}

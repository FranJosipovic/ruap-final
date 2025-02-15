import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Papa from 'papaparse';

type Data = {
  'Job Title': string;
  Rating: number;
  'Company Name': string;
  Location: string;
  Headquarters: string;
  Size: string;
  Founded: number;
  'Type of ownership': string;
  Industry: string;
  Sector: string;
  hourly: number;
  employer_provided: number;
  avg_salary: number;
  company_txt: string;
  job_state: string;
  same_state: number;
  age: number;
  python_yn: number;
  R_yn: number;
  spark: number;
  aws: number;
  excel: number;
};

@Component({
  selector: 'app-upitnik',
  standalone: true,
  imports: [],
  templateUrl: './upitnik.component.html',
  styleUrl: './upitnik.component.scss',
})
export class UpitnikComponent implements OnInit {
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

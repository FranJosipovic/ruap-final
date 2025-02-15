import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Papa from 'papaparse';
import { StepperModule } from 'primeng/stepper';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Select } from 'primeng/select';

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
  same_state: boolean;
  age: number;
  python_yn: boolean;
  R_yn: boolean;
  spark: boolean;
  aws: boolean;
  excel: boolean;
};

@Component({
  selector: 'app-upitnik',
  standalone: true,
  imports: [StepperModule, CommonModule, SelectModule, FormsModule, Select],
  templateUrl: './upitnik.component.html',
  styleUrl: './upitnik.component.scss',
})
export class UpitnikComponent implements OnInit {
  activeStep: number = 1;

  public jobs: any[] = [];
  public selectedJob: string | undefined;

  public companies: any[] = [];
  public selectedCompany: string | undefined;

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.httpClient
      .get('assets/salary_data_cleaned.csv', { responseType: 'text' })
      .subscribe((csvData) => {
        const parsed = Papa.parse<Data>(csvData, {
          delimiter: ',',
          header: true,
          dynamicTyping: true,
        });

        const { data } = parsed;

        const uniqueJobTitles = [
          ...new Set(data.map((row) => row['Job Title'])),
        ];

        this.jobs = uniqueJobTitles.map((job) => ({ label: job, value: job }));

        const uniqueCompanies = [
          ...new Set(data.map((row) => row.company_txt)),
        ];

        this.companies = uniqueCompanies.map((company) => ({
          label: company,
          value: company,
        }));

        console.log(this.jobs);
        console.log(this.companies);
      });
  }
}

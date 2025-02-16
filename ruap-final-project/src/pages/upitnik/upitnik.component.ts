import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Papa from 'papaparse';
import { StepperModule } from 'primeng/stepper';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Select } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumber } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { Observable, timeout, timer } from 'rxjs';
import { ProgressSpinner } from 'primeng/progressspinner';

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
  imports: [
    StepperModule,
    CommonModule,
    SelectModule,
    FormsModule,
    Select,
    CheckboxModule,
    InputNumber,
    ButtonModule,
    ProgressSpinner,
  ],
  templateUrl: './upitnik.component.html',
  styleUrl: './upitnik.component.scss',
})
export class UpitnikComponent implements OnInit {
  activeStep: number = 1;

  public jobs: any[] = [];
  public selectedJob: string | undefined;

  public companies: any[] = [];
  public locations: any[] = [];
  public sizes: any[] = [];
  public ownershipTypes: any[] = [];
  public industries: any[] = [];
  public sectors: any[] = [];

  public selectedLocation: string | undefined;
  public selectedSize: string | undefined;
  public selectedOwnershipType: string | undefined;
  public selectedIndustry: string | undefined;
  public selectedSector: string | undefined;
  public sameState: boolean = false;

  public userAge: number | undefined;
  public skills = {
    python: false,
    r: false,
    aws: false,
    excel: false,
    spark: false,
  };
  public isSenior: boolean = false;

  public isCalculating = false;

  public successfullyCalculated: boolean | undefined;

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

        const filterInvalidValues = (value: string | number) =>
          value && value !== 'Unknown' && value !== -1;

        const uniqueJobTitles = [
          ...new Set(
            data.map((row) => row['Job Title']).filter(filterInvalidValues)
          ),
        ];

        this.jobs = uniqueJobTitles.map((job) => ({ label: job, value: job }));

        const uniqueCompanies = [
          ...new Set(
            data.map((row) => row.company_txt).filter(filterInvalidValues)
          ),
        ];

        this.companies = uniqueCompanies.map((company) => ({
          label: company,
          value: company,
        }));

        const uniqueLocations = [
          ...new Set(
            data.map((row) => row.Location).filter(filterInvalidValues)
          ),
        ];

        this.locations = uniqueLocations.map((location) => ({
          label: location,
          value: location,
        }));

        const uniqueSizes = [
          ...new Set(data.map((row) => row.Size).filter(filterInvalidValues)),
        ];

        this.sizes = uniqueSizes.map((size) => ({
          label: size,
          value: size,
        }));

        const uniqueOwnershipTypes = [
          ...new Set(
            data
              .map((row) => row['Type of ownership'])
              .filter(filterInvalidValues)
          ),
        ];

        this.ownershipTypes = uniqueOwnershipTypes.map((type) => ({
          label: type,
          value: type,
        }));

        const uniqueIndustries = [
          ...new Set(
            data.map((row) => row.Industry).filter(filterInvalidValues)
          ),
        ];

        this.industries = uniqueIndustries.map((industry) => ({
          label: industry,
          value: industry,
        }));

        const uniqueSectors = [
          ...new Set(data.map((row) => row.Sector).filter(filterInvalidValues)),
        ];

        this.sectors = uniqueSectors.map((sector) => ({
          label: sector,
          value: sector,
        }));

        console.log(this.jobs);
        console.log(this.companies);
        console.log(this.locations);
        console.log(this.sizes);
        console.log(this.ownershipTypes);
        console.log(this.industries);
        console.log(this.sectors);
      });
  }

  onFinishStepper() {}

  get canGoToPage2() {
    return this.selectedJob !== undefined;
  }

  get canGoToPage3() {
    return this.userAge !== undefined;
  }

  get canSubmit() {
    return (
      this.selectedLocation !== undefined &&
      this.selectedSize !== undefined &&
      this.selectedOwnershipType !== undefined &&
      this.selectedIndustry !== undefined &&
      this.selectedSector !== undefined
    );
  }

  onSubmit() {
    this.isCalculating = true;
    timer(5000).subscribe(() => {
      this.isCalculating = false;
      this.successfullyCalculated = true;
    });
  }

  calculateAgain() {
    window.location.reload();
  }
}

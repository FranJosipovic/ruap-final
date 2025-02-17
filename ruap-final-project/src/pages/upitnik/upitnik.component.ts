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
import { timer } from 'rxjs';
import { ProgressSpinner } from 'primeng/progressspinner';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MenuModule } from 'primeng/menu';
import { MlConnectorService, MlRequest } from './services/ml-connector.service';

type Data = {
  'Job Title': string;
  Location: string;
  Headquarters: string;
  Size: string;
  'Type of ownership': string;
  Industry: string;
  Sector: string;
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
    InputGroupAddonModule,
    MenuModule,
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

  public companyRevenue: string | undefined;
  public companyRevenueOptions: { label: string; value: string }[] = [
    { label: 'Unknown / Non-Applicable', value: 'Unknown / Non-Applicable' },
    {
      label: 'Less than $1 million (USD)',
      value: 'Less than $1 million (USD)',
    },
    { label: '$5 to $10 million (USD)', value: '$5 to $10 million (USD)' },
    { label: '$10 to $25 million (USD)', value: '$10 to $25 million (USD)' },
    { label: '$25 to $50 million (USD)', value: '$25 to $50 million (USD)' },
    {
      label: '$100 to $500 million (USD)',
      value: '$100 to $500 million (USD)',
    },
    {
      label: '$500 million to $1 billion (USD)',
      value: '$500 million to $1 billion (USD)',
    },
    { label: '$1 to $2 billion (USD)', value: '$1 to $2 billion (USD)' },
    { label: '$2 to $5 billion (USD)', value: '$2 to $5 billion (USD)' },
    { label: '$5 to $10 billion (USD)', value: '$5 to $10 billion (USD)' },
    { label: '$10+ billion (USD)', value: '$10+ billion (USD)' },
  ];

  public userAge: number | undefined;
  public skills = {
    python: false,
    r: false,
    aws: false,
    excel: false,
    spark: false,
  };

  public isCalculating = false;

  public successfullyCalculated: boolean | undefined;

  constructor(
    private httpClient: HttpClient,
    private mlConnectorService: MlConnectorService
  ) {}

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

  public estimatedSalary: number | undefined;

  onSubmit() {
    this.isCalculating = true;

    let request: MlRequest = {
      input_data: {
        columns: [
          'Job Title',
          'Location',
          'Size',
          'Type of ownership',
          'Industry',
          'Sector',
          'Revenue',
          'age',
          'python_yn',
          'R_yn',
          'spark',
          'aws',
          'excel',
        ],
        index: [120],
        data: [
          [
            this.selectedJob!,
            this.selectedLocation!,
            this.selectedSize!,
            this.selectedOwnershipType!,
            this.selectedIndustry!,
            this.selectedSector!,
            this.companyRevenue!,
            this.userAge!,
            this.skills.python ? 1 : 0,
            this.skills.r ? 1 : 0,
            this.skills.spark ? 1 : 0,
            this.skills.aws ? 1 : 0,
            this.skills.excel ? 1 : 0,
          ],
        ],
      },
    };

    this.mlConnectorService.calculate(request).subscribe({
      next: (data) => {
        console.log(data);
        this.estimatedSalary = Math.floor(data[0]);
        this.isCalculating = false;
        this.successfullyCalculated = true;
      },
      error: (err) => {
        this.isCalculating = false;
        this.successfullyCalculated = false;
      },
    });
  }

  calculateAgain() {
    window.location.reload();
  }
}

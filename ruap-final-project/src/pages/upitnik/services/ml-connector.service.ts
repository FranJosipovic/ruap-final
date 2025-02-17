import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MlConnectorService {
  constructor(private httpClient: HttpClient) {}

  calculate(mlRequest: MlRequest): Observable<any> {
    const requestHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization:
        'Bearer 3lxV28bNSV2Vg75GrRP4jDX3kUjzQLBssZXZGWOCQsHnuBCgYMnZJQQJ99BBAAAAAAAAAAAAINFRAZML42Ih',
      'azureml-model-deployment': 'avgsalarypredic24-1',
    });

    return this.httpClient
      .post('/api', mlRequest, { headers: requestHeaders })
      .pipe(
        map((res) => {
          console.log(res);
          return res;
        }),
        catchError((err) => {
          throw err;
        })
      );
  }
}

export interface MlRequest {
  input_data: {
    columns: string[];
    index: number[];
    data: (string | number)[][];
  };
}

export interface MlResponse {
  value: string;
}

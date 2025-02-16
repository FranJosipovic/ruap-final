import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MlConnectorService {
  constructor(private httpClient: HttpClient) {}

  calculate(mlRequest: MlRequest): Observable<any> {
    const requestHeaders = new Headers({ 'Content-Type': 'application/json' });
    const apiKey =
      '3lxV28bNSV2Vg75GrRP4jDX3kUjzQLBssZXZGWOCQsHnuBCgYMnZJQQJ99BBAAAAAAAAAAAAINFRAZML42Ih';
    requestHeaders.append('Authorization', 'Bearer ' + apiKey);
    requestHeaders.append('azureml-model-deployment', 'avgsalarypredic24-1');

    return this.httpClient
      .post(
        'https://ruap-project-ws-fswlr.francecentral.inference.ml.azure.com/score',
        mlRequest
      )
      .pipe(
        map((res) => {
          console.log(res);
          return res;
        })
      );
  }
}

export interface MlRequest {
  inputData: {
    columns: string[];
    index: string[];
    data: any[];
  };
}

export interface MlResponse {
  value: string;
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { constants } from '@env/constants';
import { Credentials } from '@app/core';


export interface ValidateSSNData {
  data: ValidateSSNDataContent[];
  response: string;
}

export interface ValidateSSNDataContent {
  accountSubType: string;
  accountType: string;
  address: string;
  agency: string;
  ban: string;
  banStatus: string;
  efectivedate: string;
  generalDescription: string;
  lifelineActivationDate: string;
  name: string;
  ssn: string;
  subscriberNumber: string;
  subscriberStatus: string;
  system: string;
}

const validateSSNDataKey = 'validateSSNData';

@Injectable()
export class UsfServiceService {
  constructor(private http: HttpClient) { }

  validateSSN(data: any): Observable<any> {
     // return this.http.post<any>('http://wslifeusf.claropr.com/Service/svc/1/VALIDATE_SSN.MCAPI', data, {
     //   observe: 'response'
     // });
    return this.http.post<any>(constants.API_PATH, data, { observe: 'response' });
  }

  public getValidateSSNData(): ValidateSSNData | null {
    let validateSSNData: ValidateSSNData;
    validateSSNData = JSON.parse(sessionStorage.getItem(validateSSNDataKey))
    return validateSSNData;
  }

  public setValidateSSNData(validateSSNData?: ValidateSSNData) {
    if (validateSSNData) {
      sessionStorage.setItem(validateSSNDataKey, JSON.stringify(validateSSNData));
    } else {
      sessionStorage.removeItem(validateSSNDataKey);
    }
  }

}

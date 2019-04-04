import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { constants } from '@env/constants';
import { Credentials } from '@app/core';


export interface ValidateSSNData {
  data: ValidateSSNDataContent[];
  response: string;
  CASENUMBER: number;
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

export interface DataObjectAddress {
  CASENUMBER: string;
  CUSTOMERADDRESS: string;
  CUSTOMERLASTNAME: string;
  CUSTOMERNAME: string;
  DOB: string;
  SSN: string;
  SUGGESTADDRESS: string;
}

const validateSSNDataKey = 'validateSSNData';
const dataObjectAddressKey = 'dataObjectAddress';

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
    validateSSNData = JSON.parse(sessionStorage.getItem(validateSSNDataKey));
    return validateSSNData;
  }

  public setValidateSSNData(validateSSNData?: ValidateSSNData) {
    if (validateSSNData) {
      sessionStorage.setItem(validateSSNDataKey, JSON.stringify(validateSSNData));
    } else {
      sessionStorage.removeItem(validateSSNDataKey);
    }
  }

  public getDataObjectAddress(): DataObjectAddress[] | null {
    let dataObjectAddress: DataObjectAddress[];
    dataObjectAddress = JSON.parse(sessionStorage.getItem(dataObjectAddressKey));
    return dataObjectAddress;
  }

  public setDataObjectAddress(dataObjectAddress?: DataObjectAddress[]) {
    if (dataObjectAddress) {
      sessionStorage.setItem(dataObjectAddressKey, JSON.stringify(dataObjectAddress));
    } else {
      sessionStorage.removeItem(dataObjectAddressKey);
    }
  }

  validateAddress(data: any): Observable<any> {
    // return this.http.post<any>('http://wslifeusf.claropr.com/Service/svc/1/ADDRESSVALIDATION.MCAPI', data, {
    //   observe: 'response'
    // });
    return this.http.post<any>(constants.API_PATH, data, { observe: 'response' });
  }

  subscriberVerification(data: any): Observable<any> {
    // return this.http.post<any>('http://wslifeusf.claropr.com/Service/svc/1/subscriber/SUBSCRIBER_VERIFICATION.MCAPI', data, {
    //   observe: 'response'
    // });
    return this.http.post<any>(constants.API_PATH, data, { observe: 'response' });
  }

}

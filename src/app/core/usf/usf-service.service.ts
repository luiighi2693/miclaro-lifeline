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

export interface PeopleData {
  number: number;
  money: string;
}

export interface DataAgencyMoneySelection {
  agency : string;
  ldiRestriction: boolean;
  peopleDataSelectedNumber: number;
  peopleDataSelected: PeopleData;
  earningsValidation: boolean;
  lifelineProgramInscription: boolean;
  aceptationTerm: boolean;
}

const validateSSNDataKey = 'validateSSNData';
const dataObjectAddressKey = 'dataObjectAddress';
const requiredDocumentsKey = 'requiredDocuments';
const dataAgencyMoneySelectionKey = 'dataAgencyMoneySelection';
const ssnKey = 'ssn';

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

  public getSnn(): string | null {
    let ssn: string;
    ssn = JSON.parse(sessionStorage.getItem(ssnKey));
    return ssn;
  }

  public setSsn(ssn?: string) {
    if (ssn) {
      sessionStorage.setItem(ssnKey, JSON.stringify(ssn));
    } else {
      sessionStorage.removeItem(ssnKey);
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



  public getRequiredDocumentData(): string[] | null {
    let requiredDocuments: string[];
    requiredDocuments = JSON.parse(sessionStorage.getItem(requiredDocumentsKey));
    return requiredDocuments;
  }

  setRequiredDocumentData(requiredDocuments: any) {
    if (requiredDocuments) {
      sessionStorage.setItem(requiredDocumentsKey, JSON.stringify(requiredDocuments));
    } else {
      sessionStorage.removeItem(requiredDocumentsKey);
    }
  }

  public getDataAgencyMoneySelection(): DataAgencyMoneySelection | null {
    let dataAgencyMoneySelection: DataAgencyMoneySelection;
    dataAgencyMoneySelection = JSON.parse(sessionStorage.getItem(dataAgencyMoneySelectionKey));
    return dataAgencyMoneySelection;
  }

  setDataAgencyMoneySelection(dataAgencyMoneySelection: DataAgencyMoneySelection) {
    if (dataAgencyMoneySelection) {
      sessionStorage.setItem(dataAgencyMoneySelectionKey, JSON.stringify(dataAgencyMoneySelection));
    } else {
      sessionStorage.removeItem(dataAgencyMoneySelectionKey);
    }
  }

  uploadDocument(data: any): Observable<any> {
    // return this.http.post<any>('http://wslife00042ws.claroinfo.com/Service/svc/1/UpdloadDocument.MCAPI', data, {
    //   observe: 'response'
    // });
    return this.http.post<any>(constants.API_PATH, data, { observe: 'response' });
  }

  retrieveDocument(data: any): Observable<any> {
    // return this.http.post<any>('http://wslife00042ws.claroinfo.com/Service/svc/1/RetrieveDocument.MCAPI', data, {
    //   observe: 'response'
    // });
    return this.http.post<any>(constants.API_PATH, data, { observe: 'response' });
  }

  deleteDocument(data: any): Observable<any> {
    // return this.http.post<any>('http://wslife00042ws.claroinfo.com/Service/svc/1/DeleteDocument.MCAPI', data, {
    //   observe: 'response'
    // });
    return this.http.post<any>(constants.API_PATH, data, { observe: 'response' });
  }

  createNewAccount(data: any): Observable<any> {
    // return this.http.post<any>('http://wslife00042ws.claroinfo.com/Service/svc/1/CREATENEWACCOUNT.MCAPI', data, {
    //   observe: 'response'
    // });
    return this.http.post<any>(constants.API_PATH, data, { observe: 'response' });
  }
}

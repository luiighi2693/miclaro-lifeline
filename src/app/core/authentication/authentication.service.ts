import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { constants } from '@env/constants';

export interface Credentials {
  [x: string]: any;
  // Customize received credentials here
  username: string;
  token: string;
}

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
}

const credentialsKey = 'credentials';

/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {
  private _credentials: Credentials | null;

  constructor(private http: HttpClient) {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<any> {
    // Replace by proper authentication call
    const data = {
      userName: context.username,
      Password: context.password,
      method: 'loginAdMcapi',
      token: '123456'
    };

    return this.http.post<any>('http://wslifeusf.claropr.com/Service/svc/1/LOGINAD.MCAPI', data, {
      observe: 'response'
    });
    // return this.http.post<any>(constants.API_PATH, data, { observe: 'response' });
    // this.setCredentials(data, context.remember);
    // return of(data);
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.setCredentials();
    return of(true);
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }

  public getCredentials(): Credentials | null {
    return this._credentials;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   * @param remember True to remember credentials across sessions.
   */
  public setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }

  validateSSN(context: Object) {
    // Set the Data Format
    const data = {
      USER_ID: 11,
      CUSTOMER_NAME: 'Jhonny',
      CUSTOMER_MN: 'C',
      CUSTOMER_LAST: 'Ferraz',
      CUSTOMER_SSN: '0581552714',
      CUSTOMER_DOB: '1974-3-1',
      GENDER: '1',
      CUSTOMER_ID_TYPE: '1',
      ID_NUMBER: '890980980808',
      DTS_EXP: '2021-3-1',
      DEP_APPLICATION: '',
      PHONE_1: '',
      COMUNICATION: '',
      Home: 1
    };
    return this.http.post('http://wslifeusf.claropr.com/Service/svc/1/LOGINAD.MCAPI', data);
  }
}

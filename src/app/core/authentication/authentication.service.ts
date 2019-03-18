import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { constants } from '@env/constants';
import { Router } from '@angular/router';
declare let alertify: any;

export interface Credentials {
  [x: string]: any;
  // Customize received credentials here
  username: string;
  token: string;
  timeLogin: Date;
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
  private _max_min_inactive = 3;

  constructor(private http: HttpClient, private router: Router) {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      const resp_temp = JSON.parse(savedCredentials);
      resp_temp.timeLogin = new Date();
      this._credentials = resp_temp;
      console.log(this._credentials);
      // this._credentials = JSON.parse(savedCredentials);
    }

    // Para que quede verificando el tiempo se session cada vez que pase 1 min
    // si pasa de X minutos en session  hay que sacarlo
    setInterval(() => {
      if (this.getMinutesInSessionI() >= this._max_min_inactive) {
        // si alcanzo el Limite permitido
        // y si no esta en /login es que se va a mostrar
        if (router.url !== '/login') {
          console.log(`Han transcurrido ${this.getMinutesInSessionI()} Min con la session inactiva`);

          alertify.alert(
            'Sesión Inactiva',
            // tslint:disable-next-line:max-line-length
            'No hemos detectado actividad en los últimos ' +
              this._max_min_inactive +
              ' minutos. Por favor inicie nuevamente ingresando su nombre de usuario y contraseña.',
            function() {
              // alertify.success('Ok');
              this._credentials = null;
              // this.router.navigate(['/login'], { replaceUrl: true });
              router.navigateByUrl('/');
            }
          );
        }
      } else if (this.getTimeLogin === undefined || this._credentials === null) {
        // this.router.navigate(['/login'], { replaceUrl: true });
        router.navigateByUrl('/');
      }
    }, 60000);
    // 60.000 milisegundos Referentes a 1 min
  }

  validaSessionActiva() {
    if (this._credentials === null || this.getTimeLogin === undefined || this._credentials === null) {
      // this.router.navigate(['/login'], { replaceUrl: true });
      this.router.navigateByUrl('/');
      return 0;
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

    // return this.http.post<any>('http://wslifeusf.claropr.com/Service/svc/1/LOGINAD.MCAPI', data, {
    //   observe: 'response'
    // });
    return this.http.post<any>(constants.API_PATH, data, { observe: 'response' });
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
   * Retorna el tiempo en que se identifico
   * @return Object Type Date
   */
  public getTimeLogin(): Date {
    if (this.credentials === null) {
      return new Date('01/01/1900'); // se manda una fecha expirada cuando no tenga session activa
    } else {
      return this.credentials.timeLogin;
    }
  }

  /**
   * Retorna el tiempo de MINUTOS en de session Transcurrido
   * @return number
   */
  public getMinutesInSessionI(): number {
    if (this.getTimeLogin() !== undefined) {
      return new Date(new Date().getTime() - this.getTimeLogin().getTime()).getMinutes();
    } else {
      return 0;
    }
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
}

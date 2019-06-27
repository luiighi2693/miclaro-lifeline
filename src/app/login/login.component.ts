import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, AuthenticationService } from '@app/core';

const log = new Logger('Login');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  version: string = environment.version;
  error = '';
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.authenticationService.logout();
  }

  login() {
    if (!this.loginForm.invalid && !this.isLoading) {
      this.isLoading = true;
      this.authenticationService
        .login(this.loginForm.value)
        .pipe(
          finalize(() => {
            this.loginForm.markAsPristine();
            this.isLoading = false;
          })
        )
        .subscribe(
          credentials => {
            log.debug(credentials);

            if (!credentials.body.HasError) {
              if (credentials.body.Active) {
                if (
                  credentials.body.RoleName.toUpperCase() === 'USF-SUP' ||
                  credentials.body.RoleName.toUpperCase() === 'USF-AGENT' ||
                  credentials.body.RoleName.toUpperCase() === 'USF-REPSTORE'
                ) {
                  this.authenticationService.setCredentials(credentials.body, false);
                  this.router.navigate(['/home'], { replaceUrl: true });
                } else {
                  this.error =
                    'Estimado usuario hemos detectado que su usuario no tiene permisos otorgados para acceso a la  ' +
                    'aplicación. Por favor contacte al administrador del sistema.';
                }
              } else {
                this.error = 'error';
              }
            } else {
              if (this.loginForm.value.username.length === 0 || this.loginForm.value.password.length === 0) {
                this.error =
                  'Hemos detectado un error en el ingreso de sus credenciales de acceso. Favor ' +
                  'intentarlo nuevamente ingresando los campos marcados como requeridos.';
              } else {
                if (credentials.body.LoginAttems === 3) {
                  this.error =
                    'Usted ha excedido el número de intentos permitidos. Su cuenta ha sido bloqueada. ' +
                    'Por favor contacte al administrador del sistema.';
                } else {
                  this.error =
                    'Hemos detectado un error en el ingreso de sus credenciales de acceso. Favor ' +
                    'intentarlo nuevamente.';
                }
              }
            }
          },
          error => {
            log.debug(`Login error: ${error}`);
            // this.error = error;
            this.error =
              'Estimado usuario al momento la aplicación no está disponible para su uso por favor ' +
              'intente nuevamente en 5 min o contacte al administrador del sistema.';
          }
        );
    }
  }
  capturaInKey(evt: any) {
    if (evt.keyCode === 13) {
      this.login();
    }
  }
  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: [''],
      password: [''],
      remember: false
    });
  }
}

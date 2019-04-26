import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usf-case',
  templateUrl: './usf-case.component.html',
  styleUrls: ['./usf-case.component.scss']
})
export class UsfCaseComponent implements OnInit {
  public status: any = ['ESTATUS'];
  public status_selected: any = 'ESTATUS';
  public data_conten: any = [
    {
      caseID: '00123',
      ban: '79712345',
      date: '10/01/2018',
      fullName: 'FERNANDO RODRIGUEZ',
      status: 'EN PROCESO'
    },
    {
      caseID: '00124',
      ban: '79712345',
      date: '10/01/2018',
      fullName: 'FERNANDO RODRIGUEZ',
      status: 'DENEGADO'
    },
    {
      caseID: '00125',
      ban: '79712345',
      date: '10/01/2018',
      fullName: 'FERNANDO RODRIGUEZ',
      status: 'PENDIENTE BACK'
    },
    {
      caseID: '00126',
      ban: '79712345',
      date: '10/01/2018',
      fullName: 'FERNANDO RODRIGUEZ',
      status: 'APROBADO'
    }
  ];
  constructor(private authenticationService: AuthenticationService, private router: Router) {
    console.log('constructor UsfCaseComponent');
  }

  ngOnInit() {
    // Limpiando Tabla
    document.querySelectorAll('.tablecols').forEach(iten => {
      console.log(iten);
      iten.remove();
    });
    console.log(this.data_conten);
    // tslint:disable-next-line:prefer-const
    let contenedor = document.getElementsByClassName('allcont-gline')[0];
    // Recorrido de lo datos para la insersion
    this.data_conten.forEach((iten: any, k: any) => {
      // Creando Array con los estatus existentes para pintarlos en el select de satus en la vista
      if (k === 0) {
        this.status.push(iten.status);
      } else {
        let existe = false;
        this.status.forEach((i_status: any) => {
          if (i_status === iten.status) {
            existe = true;
          }
        });
        if (!existe) {
          this.status.push(iten.status);
        }
      }

      let classRow = '';

      if (iten.status === 'EN PROCESO' || iten.status === 'PENDIENTE BACK') {
        classRow = 'process';
      } else if (iten.status === 'DENEGADO') {
        classRow = 'denied';
      } else if (iten.status === 'APROBADO') {
        classRow = 'approved';
      } else {
        classRow = '';
      }
      this.data_conten[k].classCss = classRow;
    });
  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }
}

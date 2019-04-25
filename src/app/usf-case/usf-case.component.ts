import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
const data_temp = [
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

@Component({
  selector: 'app-usf-case',
  templateUrl: './usf-case.component.html',
  styleUrls: ['./usf-case.component.scss']
})
export class UsfCaseComponent implements OnInit {
  constructor(private authenticationService: AuthenticationService, private router: Router) {
    console.log('constructor UsfCaseComponent');
  }

  ngOnInit() {
    // Limpiando Tabla
    document.querySelectorAll('.tablecols').forEach(iten => {
      console.log(iten);
      iten.remove();
    });
    console.log(data_temp);
    let contenedor = document.getElementsByClassName('allcont-gline')[0];
    // Recorrido de lo datos para la insersion
    data_temp.forEach(iten => {
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

      let new_element = document.createElement('div');
      new_element.className = 'tablecols ' + iten.status;
      new_element.innerHTML = `<div class="consult-col-i consult-grline text-center vcenter">
          <div class="tabcell">
            ${iten.caseID}
          </div>
        </div>

        <div class="consult-col-i consult-grline text-center vcenter">
          <div class="tabcell">
          ${iten.ban}
          </div>
        </div>

        <div class="consult-col-ii consult-grline text-center vcenter">
          <div class="tabcell">
          ${iten.date}
          </div>
        </div>

        <div class="consult-col-iii consult-grline text-left vcenter">
          <div class="tabcell">
          ${iten.fullName}
          </div>
        </div>

        <div class="consult-col-iv consult-grline text-left roboto-b vcenter">
          <div class="tabcell">
          ${iten.status}
          </div>
        </div>

        <div class="consult-col-v text-center vcenter">
          <div class="tabcell">
            <a href="#" class="act-tbutton">
              <i class="fa fa-file-text" aria-hidden="true"></i>
            </a>
          </div>
        </div>`;
      contenedor.appendChild(new_element);
    });
  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }
}

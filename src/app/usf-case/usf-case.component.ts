import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { UsfServiceService } from '@app/core/usf/usf-service.service';
import { BaseComponent } from '@app/core/base/BaseComponent';
import { exportDefaultSpecifier, isGenerated } from 'babel-types';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { constants } from '@env/constants';
import * as moment from 'moment';
declare let $: any;

@Component({
  selector: 'app-usf-case',
  templateUrl: './usf-case.component.html',
  styleUrls: ['./usf-case.component.scss']
})
export class UsfCaseComponent extends BaseComponent implements OnInit {
  public status: any = ['ESTATUS'];
  public statusSelected = 'ESTATUS';
  public nameToSearch: String = '';
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
    },
    {
      caseID: '00127',
      ban: '79712300',
      date: '10/01/2019',
      fullName: 'RAMON SUAREZ',
      status: 'APROBADO'
    },
    {
      caseID: '00128',
      ban: '79712302',
      date: '10/02/2019',
      fullName: 'PEDRO PEREZ',
      status: 'PENDIENTE BACK'
    },
    {
      caseID: '00129',
      ban: '79712301',
      date: '01/02/2019',
      fullName: 'ISMAEL GARCIA',
      status: 'DENEGADO'
    },
    {
      caseID: '00130',
      ban: '79712303',
      date: '01/02/2019',
      fullName: 'WILLIAM OCHOA',
      status: 'EN PROCESO'
    }
  ];
  constructor(
    private http: HttpClient,
    public authenticationService: AuthenticationService,
    public usfServiceService: UsfServiceService,
    public router: Router,
    public fb: FormBuilder
  ) {
    super(authenticationService, usfServiceService, router, fb);
  }

  ngOnInit() {
    $(function() {
      // tslint:disable: prefer-const
      let start = moment().subtract(29, 'days');
      let end = moment();

      // tslint:disable-next-line: no-shadowed-variable
      function cb(start: any, end: any) {
        $('#rangedate').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      }

      $('#rangedate').daterangepicker(
        {
          startDate: start,
          endDate: end,
          ranges: {
            Today: [moment(), moment()],
            Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [
              moment()
                .subtract(1, 'month')
                .startOf('month'),
              moment()
                .subtract(1, 'month')
                .endOf('month')
            ]
          }
        },
        cb
      );

      cb(start, end);
    });
    // Limpiando Tabla
    document.querySelectorAll('.tablecols').forEach(iten => {
      console.log(iten);
      iten.remove();
    });
    console.log(this.data_conten);
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
  isEmpty() {
    return this.nameToSearch.trim().length;
  }
  validacionOcultarRow(iStatus: any, iNameClientTxt: String) {
    // # (statusSelected != 'ESTATUS' && statusSelected != iten.status) || isEmpty()!=0
    if (this.statusSelected == 'ESTATUS' && this.isEmpty() == 0) {
      return false;
    } else if (this.statusSelected != 'ESTATUS' && this.isEmpty() == 0 && this.statusSelected != iStatus) {
      return true;
    } else if (this.statusSelected != 'ESTATUS' && this.isEmpty() == 0 && this.statusSelected == iStatus) {
      return false;
    } else if (
      this.statusSelected != 'ESTATUS' &&
      this.statusSelected == iStatus &&
      this.isEmpty() != 0 &&
      iNameClientTxt
        .toString()
        .toLocaleLowerCase()
        .includes(this.nameToSearch.toString().toLocaleLowerCase())
    ) {
      return false;
    } else {
      if (
        this.isEmpty() != 0 &&
        iNameClientTxt
          .toString()
          .toLocaleLowerCase()
          .includes(this.nameToSearch.toString().toLocaleLowerCase())
      ) {
        return false;
      } else {
        return true;
      }
    }
  }

  getCasesUSF() {
    const data = {
      DateFrom: '2019-04-25',
      DateTo: '2019-04-25',
      pageNo: 5,
      pageSize: 20,
      caseID: '',
      Status: ''
    };
    this.http.post<any>(constants.URL_CASES, data, { observe: 'response' }).subscribe((dt: any) => {
      if (!dt.HasError) {
        this.data_conten = [];
        dt.body.customercases.forEach((caso: any) => {
          let date_temp = new Date(caso.DTS_CREATED);
          let dd: number = date_temp.getDate();
          let ddTxt: string = '';
          let mm: number = date_temp.getMonth() + 1;
          let mmTxt: string = '';

          if (dd < 10) {
            ddTxt = '0' + dd.toString();
            console.log(ddTxt);
          } else {
            ddTxt = dd.toString();
          }

          if (mm < 10) {
            mmTxt = '0' + mm.toString();
          } else {
            mmTxt = mm.toString();
          }

          this.data_conten.push({
            caseID: caso.USF_CASEID,
            ban: caso.ACCOUNT_NUMBER,
            date: mmTxt + '/' + ddTxt + '/' + date_temp.getFullYear(),
            fullName: caso.CUSTOMER_NAME + ' ' + caso.CUSTOMER_LAST,
            status: '--'
          });
        });
      }
    });
  }
}

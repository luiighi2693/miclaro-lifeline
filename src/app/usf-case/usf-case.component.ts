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
import * as XLSX from 'xlsx';
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
  public numberUSF: String = '';
  public loadingRequest = false;
  public date_range: any = null;
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
    let mes = (new Date().getMonth() + 1).toString();
    if (new Date().getMonth() + 1 < 10) {
      mes = '0' + mes;
    }
    this.date_range = {
      start: new Date().getFullYear() + '-01-01',
      end: new Date().getFullYear() + '-' + mes + '-' + new Date().getDate()
    };
    if (localStorage.getItem('numberCaseToSearch') !== null) {
      this.numberUSF = localStorage.getItem('numberCaseToSearch');
      this.loadingRequest = true;
      this.getCasesUSF();
    }
    let self = this;
    function searchCases() {
      console.log('searchCases', self.date_range);
      self.getCasesUSF();
    }

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
          icon: 'ui-icon-triangle-1-s',
          initialText: 'Enero 01, 2018 - Enero 23 2018',
          datepickerOptions: {
            numberOfMonths: 2
          },
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
          },
          change: function(event: any, data: any) {
            this.loadingRequest = true;
            this.date_range = JSON.parse($('#rangedate').val());
            self.date_range = this.date_range;
            searchCases();
          }
        },
        cb
      );

      $('#rangedate').on('cancel.daterangepicker', function(ev: any, picker: any) {
        // cuando se aplica un cambio de Fecha
        console.log(ev, picker);
      });
      cb(start, end);
    });
    // Limpiando Tabla
    document.querySelectorAll('.tablecols').forEach((iten: any) => {
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
  validaEnter(evt: any) {
    if (evt.keyCode === 13) {
      // si pisa enter
      this.getCasesUSF();
    }
  }
  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }
  isEmpty() {
    return this.nameToSearch.trim().length;
  }

  FilterByNroUsf() {}

  validacionOcultarRow(iten: any) {
    if (this.numberUSF.trim() !== '' && String(iten.caseID) === String(this.numberUSF.trim())) {
      return false;
    } else if (this.numberUSF.trim() !== '' && String(iten.caseID) !== String(this.numberUSF.trim())) {
      return true;
    } else if (this.statusSelected === 'ESTATUS' && this.isEmpty() === 0) {
      return false;
    } else if (this.statusSelected !== 'ESTATUS' && this.isEmpty() === 0 && this.statusSelected !== iten.status) {
      return true;
    } else if (this.statusSelected !== 'ESTATUS' && this.isEmpty() === 0 && this.statusSelected === iten.status) {
      return false;
    } else if (
      this.statusSelected !== 'ESTATUS' &&
      this.statusSelected === iten.status &&
      this.isEmpty() !== 0 &&
      iten.fullName
        .toString()
        .toLocaleLowerCase()
        .includes(this.nameToSearch.toString().toLocaleLowerCase())
    ) {
      return false;
    } else {
      if (
        this.isEmpty() !== 0 &&
        iten.fullName
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

  exportTo() {
    let dataArray: any = [['Nro de USF', 'BAN', 'Fecha Registro de USF', ' Nombre y Apellido Cliente', 'Estatus']];
    this.data_conten.forEach((caso: any) => {
      dataArray.push([caso.caseID, caso.ban, caso.date, caso.fullName, caso.status]);
    });

    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dataArray);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    // XLSX.writeFile(wb, 'CasesUSF.xlsx');

    // TEST
    // The exported read and readFile functions accept an options argument:
    // {password: '123', WTF: true}
    /**/
    XLSX.readFile(XLSX.writeFile(wb, 'CasesUSF.xlsx'), { password: '123', WTF: true });
  }

  getCasesUSF() {
    this.loadingRequest = true;
    let pages = 5; // by default
    if (this.numberUSF.trim() !== '') {
      pages = 1;
    }
    const data = {
      method: 'getCasesWithFiltersMcapi',
      DateFrom: this.date_range.start,
      DateTo: this.date_range.end,
      pageNo: pages,
      pageSize: 20,
      caseID: this.numberUSF,
      Status: ''
    };
    //    this.http.post<any>(constants.URL_CASES, data, { observe: 'response' }).subscribe((dt: any) => {
    return this.usfServiceService.doAction(data, 'getCasesWithFiltersMcapi').subscribe((dt: any) => {
      if (!dt.HasError) {
        this.data_conten = [];
        dt.body.customercases.forEach((caso: any) => {
          let date_temp = new Date(caso.DTS_CREATED);
          let dd: number = date_temp.getDate();
          let ddTxt = '';
          let mm: number = date_temp.getMonth() + 1;
          let mmTxt = '';

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
        this.loadingRequest = false;
      }
    });
  }
}

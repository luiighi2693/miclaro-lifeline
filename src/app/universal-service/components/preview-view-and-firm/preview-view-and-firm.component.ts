import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
declare let alertify: any;
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { UsfServiceService, ValidateSSNData } from '@app/core/usf/usf-service.service';
import { FormBuilder } from '@angular/forms';
import { BaseComponent } from '@app/core/base/BaseComponent';
import { DomSanitizer } from '@angular/platform-browser';
declare let $: any;
@Component({
  selector: 'app-preview-view-and-firm',
  templateUrl: './preview-view-and-firm.component.html',
  styleUrls: ['./preview-view-and-firm.component.scss']
})
export class PreviewViewAndFirmComponent extends BaseComponent implements OnInit {
  firmInput = false;
  step2 = false;
  signer = '';
  iniciales = '';
  fechaN = '';
  fechaActivada = false;
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  isLoading: boolean;
  signaturePadOptions: Object = {
    minWidth: 0.1, // (float) Minimum width of a line. Defaults to 0.5
    maxWidth: 3, // (float) Maximum width of a line. Defaults to 2.5
    canvasWidth: 740,
    canvasHeight: 180
  };

  validateSSNData: ValidateSSNData;

  userId: string;
  caseId: number;

  constructor(public authenticationService: AuthenticationService, public usfServiceService: UsfServiceService, public router: Router, public fb: FormBuilder, public sanitizer: DomSanitizer) {
    super(authenticationService, usfServiceService, router, fb);

    this.validateSSNData = this.usfServiceService.getValidateSSNData();

    this.userId = this.authenticationService.credentials.userid;
      this.caseId =  this.validateSSNData.CASENUMBER;
  }
  ngOnInit() {
    window.scroll(0, 0);
  }

  goToStep2() {
    this.step2 = true;
  }

  activarFecha() {
    if (!this.fechaActivada) {
      $('#fechaN')
        .datepicker({
          dateFormat: 'mm/dd/yy',
          changeMonth: true,
          changeYear: true,
          yearRange: '-100:-21',
          maxDate: '-21y',
          minDate: '-100y',
          defaultDate: '-22y',
          onSelect: function(dateText: any) {
            console.log(dateText + ' *onSelect');
          },
          onChangeMonthYear: function(year: any, month: any, datepicker: any) {
            // #CAMBIO APLICADO y Necesario ya que al seleccionar el mes y cambiar el a#o en los selects
            // # no Cambiaba el valor del input  Ahora si se esta aplocando el cambio
            console.log('onChangeMonthYear');
            if ($('#fechaN').val().length === 10) {
              console.log('to :' + month + ' ' + $('#fechaN').val().sub + ' ' + year);

              const new_date = new Date(
                month +
                  '/' +
                  $('#fechaN')
                    .val()
                    .substr(3, 2) +
                  '/' +
                  year
              );

              $('#fechaN').datepicker('setDate', new_date);
            }
          }
        })
        .on('change', function(evtChange: any) {
          console.log(evtChange);
          console.log('Change event');
        });
      this.fechaActivada = false;
      $('#fechaN').focus();
    } else {
      $('#fechaN').focus();
    }
  }

  showFirmInput() {
    this.firmInput = true;
  }

  goToActivation() {
    if (this.validateSing()) {
      this.router.navigate(['/universal-service/activation'], { replaceUrl: true });
    }
  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  // para componente de firma
  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    // this.signaturePad is now available
    if (this.signaturePad !== undefined) {
      this.signaturePad.set('minWidth', 0.5); // set szimek/signature_pad options at runtime
      this.signaturePad.set('maxWidth', 3);
      this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
    }
    this.signer = '';
  }

  validateSing() {
    if (this.iniciales.trim().length > 0 && this.fechaN.trim().length !== 10 && this.signer.trim() !== '') {
      return true;
    } else {
      return false;
    }
  }

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    const firmaUrl = this.signaturePad.toDataURL();
    console.log(firmaUrl);
    console.log(this.signaturePad);
  }

  drawCompleteSave() {
    // will be notified of szimek/signature_pad's onEnd event
    const firmaUrl = this.signaturePad.toDataURL();
    console.log(firmaUrl);
    this.signer = firmaUrl;
    this.copyCode(firmaUrl);
    alertify.alert('Aviso', 'Copiada la firma... ');
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
    console.log(this.signaturePad);
  }
  copyCode(code: any) {
    const aux = document.createElement('input');
    aux.setAttribute('value', code);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand('copy');
    document.body.removeChild(aux);
  }
}

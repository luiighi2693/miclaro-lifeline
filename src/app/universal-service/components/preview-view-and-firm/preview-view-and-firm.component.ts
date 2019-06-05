import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
declare let alertify: any;
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
declare let $: any;
@Component({
  selector: 'app-preview-view-and-firm',
  templateUrl: './preview-view-and-firm.component.html',
  styleUrls: ['./preview-view-and-firm.component.scss']
})
export class PreviewViewAndFirmComponent implements OnInit {
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

  constructor(private authenticationService: AuthenticationService, private router: Router) {
    this.authenticationService.validaSessionActiva();
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
          setDate: new Date(),
          minDate: 0,
          maxDate: 0,
          defaultDate: '+0d',
          onSelect: function(dateText: any) {
            console.log(dateText + ' *onSelect');
          },
          onChangeMonthYear: function(year: any, month: any, datepicker: any) {
            $('#fechaN').datepicker('setDate', new Date());
          }
        })
        .on('change', function(evtChange: any) {
          $('#fechaN').datepicker('setDate', new Date());
        });
      $('#fechaN')
        .datepicker()
        .datepicker('setDate', new Date());
      this.fechaActivada = false;
      // $('#fechaN').focus();
    } else {
      $('#fechaN')
        .datepicker()
        .datepicker('setDate', new Date());
      // $('#fechaN').focus();
    }
  }

  showFirmInput() {
    this.firmInput = true;
    setTimeout(this.activarFecha, 100);
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

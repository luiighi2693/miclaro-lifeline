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
  step1 = true;
  step2 = false;
  step3 = false;
  signer = '';
  iniciales = '';
  fechaN = '';
  fechaActivada = false;
  @ViewChild(SignaturePad, { static: true }) signaturePad: SignaturePad;
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

  firmaUrl: any;

  suscriberActivation: boolean = false;

  constructor(
    public authenticationService: AuthenticationService,
    public usfServiceService: UsfServiceService,
    public router: Router,
    public fb: FormBuilder,
    public sanitizer: DomSanitizer
  ) {
    super(authenticationService, usfServiceService, router, fb);

    this.validateSSNData = this.usfServiceService.getValidateSSNData();

    // this.userId = '79';
    this.userId = this.authenticationService.credentials.userid;
    // this.caseId = 580;
    this.caseId = this.validateSSNData.CASENUMBER;
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
      console.log('done');
      console.log(this.firmaUrl);
      console.log(this.iniciales);
      console.log(this.fechaN);

      const datos = {
        method: 'CreatefirmMcapi',
        USER_ID: this.userId,
        CASE_ID: this.caseId,
        FIRM_INITIALS: this.step1 ? this.iniciales : '',
        FIRM_INITIALSAPLIC: this.step2 ? this.iniciales : '',
        FIRM_INITIALSCLAR: this.step3 ? this.iniciales : '',
        FIRM_DESCRIPTION: this.step1 ? this.firmaUrl : '',
        FIRM_DESCRIPTIONAPLIC: this.step2 ? this.firmaUrl : '',
        FIRM_DESCRIPTIONCLAR: this.step3 ? this.firmaUrl : '',
        Id_Firm: this.getIdFirm()
      };

      console.log(datos);

      this.usfServiceService.doAction(datos, 'CreatefirmMcapi').subscribe(
        resp => {
          console.log(resp);
          this.firmInput = false;

          if (!resp.body.HasError) {
            if (!this.step3) {
              if (this.signaturePad !== undefined) {
                this.signaturePad.set('minWidth', 0.5); // set szimek/signature_pad options at runtime
                this.signaturePad.set('maxWidth', 3);
                this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
              }
              this.signer = '';
              this.iniciales = '';

              if (this.step1) {
                this.step2 = true;
                this.step1 = false;
                this.step3 = false;
              } else if (this.step2) {
                this.step3 = true;
                this.step1 = false;
                this.step2 = false;
              }
            } else {
              this.suscriberActivation = true;

              const datos = {
                method: 'CreateSubscriberMcapi',
                UserID: this.userId,
                caseID: this.caseId
              };

              console.log(datos);

              this.usfServiceService.doAction(datos, 'CreateSubscriberMcapi').subscribe(
                resp => {
                  this.suscriberActivation = false;

                  if (!resp.body.HasError) {
                    sessionStorage.setItem('suscriberNumber', resp.body.subscriber);
                    this.router.navigate(['/universal-service/activation'], { replaceUrl: true });
                  } else {
                    alertify.alert('Aviso', resp.body.ErrorDesc, () => {
                      this.goToHome();
                    });
                  }
                },
                error => {
                  console.log(error);
                }
              );
            }
          } else {
            alertify.alert('Aviso', resp.body.ErrorDesc, () => {
              this.goToHome();
            });
          }
        },
        error => {
          console.log(error);
        }
      );
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
    this.firmaUrl = this.signaturePad.toDataURL();
    console.log(this.firmaUrl);
    console.log(this.signaturePad);
  }

  drawCompleteSave() {
    // will be notified of szimek/signature_pad's onEnd event
    const firmaUrl = this.signaturePad.toDataURL();
    console.log(firmaUrl);
    this.signer = firmaUrl;
    this.copyCode(firmaUrl);
    // alertify.alert('Aviso', 'Copiada la firma... ');
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

  private getIdFirm() {
    if (this.step1) {
      return 1;
    } else if (this.step2) {
      return 2;
    } else {
      return 3;
    }
  }
}

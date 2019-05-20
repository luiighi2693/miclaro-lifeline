import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Util from '@app/universal-service/util';
import { AuthenticationService } from '@app/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
declare let alertify: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  isLoading: boolean;
  // passed through to szimek/signature_pad constructor
  signaturePadOptions: Object = {
    minWidth: 0.1, // (float) Minimum width of a line. Defaults to 0.5
    maxWidth: 0.3, // (float) Maximum width of a line. Defaults to 2.5
    canvasWidth: 740,
    canvasHeight: 180
  };
  // throttle: 75,  // (integer) Draw the next point at most once per every x milliseconds. Set it to 0 to turn off throttling. Defaults to 16

  constructor(private router: Router, private authenticationService: AuthenticationService) {
    authenticationService.validaSessionActiva();
  }

  ngOnInit() {
    this.isLoading = true;
  }

  goToUniversalService() {
    this.router.navigate(['/universal-service/personal-dates'], { replaceUrl: true });
  }

  gotoUsfCase() {
    this.router.navigate(['/usf-case'], { replaceUrl: true });
  }

  checkNumbersOnly(event: any): boolean {
    return Util.checkNumbersOnly(event);
  }

  // para componente de firma
  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 0.5); // set szimek/signature_pad options at runtime
    this.signaturePad.set('maxWidth', 3);
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
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

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface DocumentLifeline {
  name: string;
  subDocuments: SubDocumentLifeline[];
}

export interface SubDocumentLifeline {
  name: string;
  pageNumber: number;
}

@Component({
  selector: 'app-document-digitalization',
  templateUrl: './document-digitalization.component.html',
  styleUrls: ['./document-digitalization.component.scss']
})
export class DocumentDigitalizationComponent implements OnInit {

  previewView = false;

  documents: DocumentLifeline [] = [
    {
      name: 'Formulario de Servicio Universal',
      subDocuments: [
        {
          name: 'Formulario de Aplicación (Forma 5629)',
          pageNumber: 8
        },
        {
          name: 'Términos & Condiciones y Anejos.',
          pageNumber: 9
        }
      ]
    },
    {
      name: 'Formulario Hoja de Hogar',
      subDocuments: [
        {
          name: 'Formulario de Aplicación (Forma 5631)',
          pageNumber: 4
        }
      ]
    },
    {
      name: 'Certificación de Elegibilidad',
      subDocuments: [
        {
          name: 'Planilla',
          pageNumber: 15
        },
        {
          name: 'Talonario de los últimos tres (3) meses consecutivos',
          pageNumber: 15
        },
        {
          name: 'Declaración de Beneficio de Seguro Social',
          pageNumber: 15
        },
        {
          name: 'Declaración Veteranos',
          pageNumber: 15
        },
        {
          name: 'Declaración Retiro/Pensión',
          pageNumber: 15
        },
        {
          name: 'Declaración Desempleo/Seguro del Estado',
          pageNumber: 15
        },
        {
          name: 'Divorcio/Pensión Alimentaria',
          pageNumber: 15
        },
        {
          name: 'Otros',
          pageNumber: 15
        }
      ]
    },
    {
      name: 'Evidencia de Factura',
      subDocuments: [
        {
          name: 'Licencia de Conducir',
          pageNumber: 1
        },
        {
          name: 'ID',
          pageNumber: 1
        },
        {
          name: 'Factura de Luz/Agua/TV/Teléfono',
          pageNumber: 1
        }
      ]
    },
    {
      name: 'Evidencia de identidad',
      subDocuments: [
        {
          name: 'Certificado de Nacimiento',
          pageNumber: 1
        },
        {
          name: 'Pasaporte',
          pageNumber: 1
        },
        {
          name: 'Licencia de Conducir',
          pageNumber: 1
        }
      ]
    },
    {
      name: 'Transferencia de Beneficio',
      subDocuments: [
        {
          name: 'Hoja de Transferencia de Beneficio',
          pageNumber: 1
        }
      ]
    },
    {
      name: 'Otros',
      subDocuments: [
        {
          name: 'Otros',
          pageNumber: 4
        }
      ]
    }
  ];

  public form: FormGroup;

  initDocument: DocumentLifeline = {
    name: '',
    subDocuments: []
  };

  documentTypeSelected: DocumentLifeline = this.initDocument;
  subDocumentTypeSelected: SubDocumentLifeline;

  constructor(private authenticationService: AuthenticationService, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    console.log();

    window.scroll(0, 0);

    this.form = this.fb.group({
      documentTypeSelected: [
        null,
        Validators.compose([
          Validators.required
        ])
      ],
      subDocumentTypeSelected: [
        null,
        Validators.compose([
          Validators.required
        ])
      ]
    });
  }

  goToPreviewView() {
    this.previewView = true;
  }

  goToAccountCreation() {
    this.router.navigate(['/universal-service/account-creation'], { replaceUrl: true });
  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  goToRegisterCase() {
    this.router.navigate(['/universal-service/register-case'], { replaceUrl: true });
  }

  chargeDocuments() {
    this.previewView = false;
  }

  onChangeLifeline($event: any) {
    this.documentTypeSelected = this.documents.find(x => x.name === $event);
  }

  checkResponsive() {

  }
}

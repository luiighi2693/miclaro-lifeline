import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@app/core/base/BaseComponent';
import { DataAgencyMoneySelection, UsfServiceService, ValidateSSNData } from '@app/core/usf/usf-service.service';
import { DomSanitizer } from '@angular/platform-browser';
declare let alertify: any;

export interface DocumentLifeline {
  name: string;
  types: string[];
  maxSize: number;
  subDocuments: string[];
}

export interface RequiredDocumentContent {
  id: string;
  name: string;
  isCharged: boolean;
  idToSearch: string;
}

@Component({
  selector: 'app-document-digitalization',
  templateUrl: './document-digitalization.component.html',
  styleUrls: ['./document-digitalization.component.scss']
})
export class DocumentDigitalizationComponent extends BaseComponent implements OnInit {
  previewView = false;
  loadingDocs = false;

  documents: DocumentLifeline[] = [
    {
      name: 'Formulario de Servicio Universal',
      types: ['.pdf'],
      maxSize: 10000,
      subDocuments: ['Formulario de Aplicación (Forma 5629)', 'Anejos']
    },
    {
      name: 'Formulario Hoja de Hogar',
      types: ['.pdf'],
      maxSize: 10000,
      subDocuments: ['Formulario de Aplicación (Forma 5631)']
    },
    {
      name: 'Certificación de elegibilidad',
      types: ['.pdf'],
      maxSize: 10000,
      subDocuments: []
    },
    {
      name: 'Evidencia de factura',
      types: ['.pdf'],
      maxSize: 10000,
      subDocuments: ['Licencia de Conducir', 'ID', 'Factura de Luz/Agua/TV/Teléfono']
    },
    {
      name: 'Evidencia de Identidad',
      types: ['.pdf', '.jpeg', '.png'],
      maxSize: 10000,
      subDocuments: ['Certificado de Nacimiento', 'Pasaporte', 'Licencia de Conducir']
    },
    {
      name: 'Transferencia de Beneficio',
      types: ['.pdf'],
      maxSize: 10000,
      subDocuments: ['Hoja de Transferencia de Beneficio']
    },
    {
      name: 'Otros',
      types: ['.pdf'],
      maxSize: 10000,
      subDocuments: ['Otros']
    }
  ];

  public form: FormGroup;

  subDocumentTypeSelected: string;
  subDocumentsTypeSelected: string[] = [];

  requiredDocuments: string[] = [];
  requiredDocumentSelected: any;
  requiredDocumentIdSelected: string;
  requiredDocumentsContent: RequiredDocumentContent[] = [];

  uploadHasError = false;
  uploadHasValidationError = false;
  validateSSNData: ValidateSSNData;
  documentName: string;

  uploadHasValidationErrorSize: number;
  uploadHasValidationErrorTypes: string;

  dataAgencyMoneySelection: DataAgencyMoneySelection;

  certificacionIngresoDocuments: string[] = [
    'Planilla',
    'Talonario de los últimos tres (3) meses consecutivos',
    'Declaración de Beneficio de Seguro Social',
    'Declaración Veteranos',
    'Declaración Retiro/Pensión',
    'Declaración Desempleo/Seguro del Estado',
    'Divorcio/Pensión Alimentaria',
    'Otros'
  ];

  certificacionProgramaDocuments: string[] = [
    'Programa de Asistencia para Nutrición Suplementaria (SNAP) (Estampillas para Alimentos)',
    'Ingreso Suplementario de Seguridad (SSI)',
    'Medicaid',
    'Asistencia Federal para la Vivienda Pública (FPHA)',
    'Beneficio de Pensión para Veteranos y Sobrevivientes'
  ];

  previewUrl: string;

  @ViewChild('inputFiles') inputFiles: ElementRef;

  constructor(
    public authenticationService: AuthenticationService,
    public usfServiceService: UsfServiceService,
    public router: Router,
    public fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    super(authenticationService, usfServiceService, router, fb);
    this.requiredDocuments = this.usfServiceService.getRequiredDocumentData();
    this.parseRequiredDocumentsContent();

    this.validateSSNData = this.usfServiceService.getValidateSSNData();

    this.subDocumentsTypeSelected.push('Seleccionar');

    this.dataAgencyMoneySelection = this.usfServiceService.getDataAgencyMoneySelection();

    this.documents[2].subDocuments =
      this.dataAgencyMoneySelection.agency === 'Seleccionar'
        ? this.certificacionIngresoDocuments
        : this.certificacionProgramaDocuments;
  }

  ngOnInit() {
    console.log();

    window.scroll(0, 0);

    this.form = this.fb.group({
      documentTypeSelected: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      subDocumentTypeSelected: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ]
    });
  }

  goToAccountCreation() {
    if (this.validateAllDocumentsChargued) {
      this.router.navigate(['/universal-service/account-creation'], { replaceUrl: true });
    }
  }

  continueChargeDocuments() {
    this.previewView = false;
  }

  onChangeLifelineCustom(event: string) {
    if (event !== null) {
      console.log(event);
      var index = this.requiredDocumentsContent.map(x => x.id).indexOf(event);
      console.log(index);
      var index2 = this.documents.map(x => x.name).indexOf(this.requiredDocumentsContent[index].name);
      console.log(index2);

      this.subDocumentsTypeSelected = [];
      this.subDocumentsTypeSelected.push('Seleccionar');
      this.subDocumentTypeSelected = 'Seleccionar';
      if (index2 !== -1) {
        console.log(this.documents[index2].subDocuments);
        this.documents[index2].subDocuments.forEach(document => {
          this.subDocumentsTypeSelected.push(document);
        });
      }
    }
  }

  checkResponsive() {}

  onFileChange($event: Event) {
    this.uploadHasError = false;
    this.loadingDocs = true;
    this.uploadHasValidationError = false;
    // @ts-ignore
    this.documentName = $event.target.files[0].name;
    // @ts-ignore
    let fileExtention = $event.target.files[0].type.replace('application/', '.').replace('image/', '.');
    // @ts-ignore
    let size = $event.target.files[0].size / 1024;

    var index = this.requiredDocumentsContent.map(x => x.id).indexOf(this.requiredDocumentSelected);
    console.log(index);
    var index2 = this.documents.map(x => x.name).indexOf(this.requiredDocumentsContent[index].name);
    console.log(index, index2);
    console.log(this.documents[index2].types, fileExtention);

    if (this.documents[index2].types.indexOf(fileExtention) !== -1 && size <= this.documents[index2].maxSize) {
      var FR = new FileReader();

      FR.addEventListener('load', e => {
        // @ts-ignore
        let imageBase64 = e.target.result.split(';base64,')[1];

        const datos = {
          method: 'UpdloadDocumentMcapi',
          documentTypeID: this.requiredDocumentSelected,
          user_Id: this.authenticationService.credentials.userid,
          // user_Id: 56,
          case_number: this.validateSSNData.CASENUMBER,
          // case_number: 36,
          content: imageBase64,
          fileType: fileExtention
        };

        console.log(datos);

        this.usfServiceService.doAction(datos, 'UpdloadDocumentMcapi').subscribe(
          resp => {
            // this.usfServiceService.setValidateSSNData(resp.body);
            console.log(resp);

            if (!resp.body.HasError) {
              this.loadingDocs = false;
              this.requiredDocumentsContent[index].idToSearch = resp.body.data[0].documentID;
              this.requiredDocumentsContent[index].isCharged = true;
            } else {
              this.uploadHasError = true;
              this.loadingDocs = false;
              alertify.alert('Aviso', resp.body.ErrorDesc, () => {
                console.log(this.requiredDocumentsContent);
              });
            }

            // @ts-ignore
            $event.target.value = '';

            this.requiredDocumentSelected = this.requiredDocumentsContent[0].id;
            this.subDocumentsTypeSelected = [];
            this.subDocumentsTypeSelected.push('Seleccionar');
            this.subDocumentTypeSelected = 'Seleccionar';
          },
          error => {
            console.log(error);
            this.uploadHasError = true;
            this.loadingDocs = false;

            // @ts-ignore
            $event.target.value = '';

            this.requiredDocumentSelected = this.requiredDocumentsContent[0].id;
            this.subDocumentsTypeSelected = [];
            this.subDocumentsTypeSelected.push('Seleccionar');
            this.subDocumentTypeSelected = 'Seleccionar';
          }
        );
      });

      // @ts-ignore
      FR.readAsDataURL($event.target.files[0]);
    } else {
      this.loadingDocs = false;
      this.uploadHasValidationError = true;
      this.uploadHasValidationErrorSize = this.documents[index2].maxSize;
      this.uploadHasValidationErrorTypes = this.documents[index2].types.join(', ');
    }
  }

  private parseRequiredDocumentsContent() {
    this.requiredDocumentsContent.push({
      id: null,
      name: 'Seleccionar',
      isCharged: true,
      idToSearch: null
    });

    this.requiredDocuments.forEach(requiredDocument => {
      var name =
        requiredDocument.split('::')[1] === 'Certificación de programa'
          ? 'Certificación de elegibilidad'
          : requiredDocument.split('::')[1];

      this.requiredDocumentsContent.push({
        id: requiredDocument.split('::')[0],
        name: name,
        isCharged: false,
        idToSearch: null
      });
    });

    this.requiredDocumentSelected = this.requiredDocumentsContent[0].id;
  }

  // tslint:disable-next-line: member-ordering
  validateDocumentCharged() {
    if (this.requiredDocumentSelected !== null) {
      if (this.subDocumentTypeSelected === 'Seleccionar') {
        return true;
      } else {
        return this.requiredDocumentsContent[
          this.requiredDocumentsContent.map(x => x.id).indexOf(this.requiredDocumentSelected)
        ].isCharged;
      }
    } else {
      return true;
    }
  }

  // tslint:disable-next-line: member-ordering
  showPreviewFile(id: string) {
    console.log('showPreviewFile');
    console.log(id);

    this.requiredDocumentIdSelected = id;

    const datos = {
      method: 'RetrieveDocumentMcapi',
      documentTypeID: id,
      user_Id: this.authenticationService.credentials.userid,
      case_number: this.validateSSNData.CASENUMBER
    };

    console.log(datos);

    this.usfServiceService.doAction(datos, 'RetrieveDocumentMcapi').subscribe(
      resp => {
        console.log(resp);

        if (!resp.body.HasError) {
          this.previewView = true;
          this.previewUrl = resp.body.data[0].docPopURL;
          console.log(resp.body.data[0].docPopURL);
        } else {
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  // tslint:disable-next-line: member-ordering
  deleteFile(idToSearch: string, id: string) {
    console.log('deleteFile');
    console.log(idToSearch, id);

    const datos = {
      method: 'DeleteDocumentMcapi',
      documentTypeID: idToSearch,
      user_Id: this.authenticationService.credentials.userid,
      case_number: this.validateSSNData.CASENUMBER
    };

    console.log(datos);

    this.usfServiceService.doAction(datos, 'DeleteDocumentMcapi').subscribe(
      resp => {
        console.log(resp);

        if (!resp.body.HasError) {
          let index = this.requiredDocumentsContent.map(x => x.id).indexOf(id);
          this.requiredDocumentsContent[index].isCharged = false;
          this.requiredDocumentsContent[index].idToSearch = null;

          this.requiredDocumentSelected = this.requiredDocumentsContent[0].id;
          this.subDocumentsTypeSelected = [];
          this.subDocumentsTypeSelected.push('Seleccionar');
          this.subDocumentTypeSelected = 'Seleccionar';
        } else {
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  validateAllDocumentsChargued() {
    return this.requiredDocumentsContent.filter(x => x.name !== 'Otros').every(item => item.isCharged);
  }

  getSecureUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getHeightModal() {
    return window.innerHeight - window.innerHeight * 0.27 + 'px';
  }

  reUploadDocument() {
    var index = this.requiredDocumentsContent.map(x => x.idToSearch).indexOf(this.requiredDocumentIdSelected);
    console.log(index);
    var index2 = this.documents.map(x => x.name).indexOf(this.requiredDocumentsContent[index].name);
    console.log(index2);

    this.requiredDocumentsContent[index].isCharged = false;
    this.requiredDocumentSelected = this.requiredDocumentsContent[index].id;

    let el: HTMLElement = this.inputFiles.nativeElement as HTMLElement;
    el.click();

    this.previewView = false;
  }
}

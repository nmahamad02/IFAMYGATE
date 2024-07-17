import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { CrmService } from 'src/app/services/crm/crm.service';
import { UploadService } from 'src/app/services/upload/upload.service';
import { AuthenticationService } from '../../authentication/authentication.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  @ViewChild('propLookupDialog', { static: false }) propLookupDialog!: TemplateRef<any>;

  propertyForm: FormGroup;
  propArr: any[] = [];
  proxArr: any[] = [];
  membArr: any[] = [];

  primaryMember: any;

  isOwner: Boolean = false;
  isProxy: Boolean = false;
  hasProxy: Boolean = false;

  utc = new Date();
  mCurDate = this.formatDate(this.utc);
  mCYear = new Date().getFullYear();

  uC = JSON.parse(localStorage.getItem('userid'));

  imageSrc: string = '';

  constructor(private crmservice: CrmService, private router: Router, private snackBar: MatSnackBar, private route: ActivatedRoute, private uploadService: UploadService, private authenticationService: AuthenticationService, private dialog: MatDialog) { 
    this.propertyForm = new FormGroup({ 
      cprno: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      add1: new FormControl('', []),
      add2: new FormControl('', []),
      add3: new FormControl('', []), 
      phone1: new FormControl('', []),
      phone2: new FormControl('', []),
      mobile: new FormControl('', []),
      email: new FormControl('', [Validators.required]),
      properties: new FormArray([]),
      proxyProperties: new FormArray([]),
    });
  }

  ngOnInit() {
    console.log(this.uC)
    this.getDetails(this.uC);
  }

  getDetails(cprno: string) {
    this.crmservice.getMemberFromCPR(cprno).subscribe((res: any) => {
      this.membArr = res.recordset
      console.log(this.membArr)
      for(let i=0;i<this.membArr.length;i++) {
        if (this.membArr[i].MEMBTYPE === 'P') {
          this.isProxy = true;
          const primaryMemberCPR = this.membArr[i].PRIMARYMEMBER;
          this.crmservice.getLandlordWiseProperties(primaryMemberCPR).subscribe((res: any) => {
            console.log(res);
            this.proxArr=res.recordset;
            this.propertyForm.patchValue({
              cprno: this.membArr[0].MemberNo,
              name: this.membArr[0].NAME,
              add1: this.membArr[0].ADD1,
              add2: this.membArr[0].ADD2,
              add3: this.membArr[0].ADD3, 
              phone1: this.membArr[0].TELOFF,
              phone2: this.membArr[0].TELRES,
              mobile: this.membArr[0].TELOFF,
              email: this.membArr[0].Email,
            })
            this.primaryMember = {
              cprno: this.membArr[0].MemberNo,
              name: this.membArr[0].NAME,
              add1: this.membArr[0].ADD1,
              add2: this.membArr[0].ADD2,
              add3: this.membArr[0].ADD3, 
              phone1: this.membArr[0].TELOFF,
              phone2: this.membArr[0].TELRES,
              mobile: this.membArr[0].TELOFF,
              email: this.membArr[0].Email,
            }
            console.log(this.membArr[0].imagename);
            var imgVal: string = this.membArr[0].imagename;
            if ((this.membArr[0].imagename === null) || (this.membArr[0].imagename === "")) {
              this.imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/imgNaN.png";
            } else if (this.membArr[0].imagename != null) {
              console.log(this.membArr[0].imagename);
              if (imgVal.includes("fakepath")) {
                var imgName: string = imgVal.slice(12);
                console.log(imgName);
                this.imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/" + imgName;
              } else {
                this.imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/" + imgVal;
              }
            }
            for(let i=0; i<this.proxArr.length; i++) {
              const prop = new FormGroup({
                pHFNo: new FormControl(this.proxArr[i].house_flat_no, [Validators.required]),
                pParcelNo: new FormControl(this.proxArr[i].parcelno, [Validators.required]),
                pPlotNo: new FormControl(this.proxArr[i].plotno, [Validators.required]),
                pPlotArea: new FormControl(this.proxArr[i].plotarea, []),
                pBuiltUpArea: new FormControl(this.proxArr[i].BUILTUPAREA, []),
                pTotalArea: new FormControl(this.proxArr[i].total_area, []), 
                pZone: new FormControl(this.proxArr[i].zone, []),
                pVoteWeightage: new FormControl(this.proxArr[i].voting_power_factor, []),
                pEligibity: new FormControl(this.proxArr[i].eligiblevote, []), 
                pRooms: new FormControl(this.proxArr[i].NO_OF_ROOMS, []),
                pBathrooms: new FormControl(this.proxArr[i].NO_OF_BATHROOMS, []),
                pCarParkSlots: new FormControl(this.proxArr[i].NO_OF_CARPARK_SLOTS, []), 
                pDocuments: new FormArray([]),
                pNewDocuments: new FormArray([]),
              });
              this.crmservice.getAllDocuments(this.proxArr[0].memberno, this.proxArr[i].house_flat_no).subscribe((resp: any) => {
                console.log(resp)
                const docArr = resp.recordset;
                for(let j=0; j<docArr.length; j++) {
                  const docUrl = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/documents/" + docArr[j].DOCUMENTNAME
                  const document = new FormGroup({
                    pDocumentSource: new FormControl(docArr[j].DOCUMENTNAME, []),
                    pDocumentUrl: new FormControl(docUrl, []),
                  });
                  this.proxyDocuments(i).push(document)
                }
              })
              this.proxyProperties.push(prop);
            }
          })
        } else if((this.membArr[i].MEMBTYPE === 'O') || (this.membArr[i].MEMBTYPE === 'A')) {
          this.isOwner = true;
          this.crmservice.getLandlordWiseProperties(cprno).subscribe((res: any) => {
            console.log(res);
            this.propArr=res.recordset;
            this.propertyForm.patchValue({
              cprno: this.propArr[0].memberno,
              name: this.propArr[0].name,
              add1: this.propArr[0].landlord_add1,
              add2: this.propArr[0].landlord_Add2,
              add3: this.propArr[0].landlord_Add3, 
              phone1: this.propArr[0].landlord_phone1,
              phone2: this.propArr[0].landlord_phone1,
              mobile: this.propArr[0].landlord_mobile,
              email: this.propArr[0].landlord_email_id,
            })
            console.log(this.propArr[0].imagename);
            var imgVal: string = this.propArr[0].imagename;
            if ((this.propArr[0].imagename === null) || (this.propArr[0].imagename === "")) {
              this.imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/imgNaN.png";
            } else if (this.propArr[0].imagename != null) {
              console.log(this.propArr[0].imagename);
              if (imgVal.includes("fakepath")) {
                var imgName: string = imgVal.slice(12);
                console.log(imgName);
                this.imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/" + imgName;
              } else {
                this.imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/" + imgVal;
              }
            }
            for(let i=0; i<this.propArr.length; i++) {
              const prop = new FormGroup({
                pHFNo: new FormControl(this.propArr[i].house_flat_no, [Validators.required]),
                pParcelNo: new FormControl(this.propArr[i].parcelno, [Validators.required]),
                pPlotNo: new FormControl(this.propArr[i].plotno, [Validators.required]),
                pPlotArea: new FormControl(this.propArr[i].plotarea, []),
                pBuiltUpArea: new FormControl(this.propArr[i].BUILTUPAREA, []),
                pTotalArea: new FormControl(this.propArr[i].total_area, []), 
                pZone: new FormControl(this.propArr[i].zone, []),
                pVoteWeightage: new FormControl(this.propArr[i].voting_power_factor, []),
                pEligibity: new FormControl(this.propArr[i].eligiblevote, []), 
                pRooms: new FormControl(this.propArr[i].NO_OF_ROOMS, []),
                pBathrooms: new FormControl(this.propArr[i].NO_OF_BATHROOMS, []),
                pCarParkSlots: new FormControl(this.propArr[i].NO_OF_CARPARK_SLOTS, []), 
                pCPRStatus: new FormControl('', []), 
                pTitleDeedStatus: new FormControl('', []), 
                pEWAReceiptStatus: new FormControl('', []), 
                pDocuments: new FormArray([]),
                pNewDocuments: new FormArray([]),
              });
              this.crmservice.getAllDocuments(this.propArr[0].memberno, this.propArr[i].house_flat_no).subscribe((resp: any) => {
                console.log(resp)
                const docArr = resp.recordset;
                var pCPRStatus = "Not Submitted", pTitleDeedStatus = "Not Submitted", pEWAReceiptStatus = "Not Submitted";
                for(let j=0; j<docArr.length; j++) {
                  const docUrl = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/documents/" + docArr[j].DOCUMENTNAME
                  const document = new FormGroup({
                    pDocumentSource: new FormControl(docArr[j].DOCUMENTNAME, []),
                    pDocumentUrl: new FormControl(docUrl, [])
                  });
                  if((docArr[j].DOCUMENTSTATUS === null) && (docArr[j].DOCUMENTTYPE === 'CPR')) {
                    pCPRStatus = 'In Process'
                  } if((docArr[j].DOCUMENTSTATUS === null) && (docArr[j].DOCUMENTTYPE === 'TITLE DEED')) {
                    pTitleDeedStatus = 'In Process'
                  } if((docArr[j].DOCUMENTSTATUS === null) && (docArr[j].DOCUMENTTYPE === 'RECEIPT')) {
                    pEWAReceiptStatus = 'In Process'
                  } if((docArr[j].DOCUMENTSTATUS === 'Y') && (docArr[j].DOCUMENTTYPE === 'CPR')) {
                    pCPRStatus = 'Valid'
                  } if((docArr[j].DOCUMENTSTATUS === 'Y') && (docArr[j].DOCUMENTTYPE === 'TITLE DEED')) {
                    pTitleDeedStatus = 'Valid'
                  } if((docArr[j].DOCUMENTSTATUS === 'Y') && (docArr[j].DOCUMENTTYPE === 'RECEIPT')) {
                    pEWAReceiptStatus = 'Valid'
                  }
                  this.documents(i).push(document)
                }
                this.properties.at(i).patchValue({
                  pCPRStatus: pCPRStatus,
                  pTitleDeedStatus: pTitleDeedStatus,
                  pEWAReceiptStatus: pEWAReceiptStatus
                })
              })
              this.properties.push(prop);
              console.log(this.properties.at(i).value)
              //break;
            }
          })
        }
      }
    })
  }

  addNewDocuments(propIndex: number) {
    let dialogRef = this.dialog.open(this.propLookupDialog);
    console.log(this.properties)
  }

  onFileChange(event: any, propIndex: number) {
    var filesList: FileList = event.target.files;
    const reader = new FileReader();

    if(event.target.files && event.target.files.length) {
      const fileToUpload: any = filesList.item(0);
      console.log(fileToUpload);
      console.log(fileToUpload.type)
      if(fileToUpload.type === 'application/pdf') {
        const fileNm: string = fileToUpload.name;
        console.log(fileNm);
        reader.readAsDataURL(fileToUpload);
        reader.onload = () => {
          const docUrl = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/documents/" + fileNm
            const document = new FormGroup({
              pDocument: new FormControl(fileToUpload, []),
              pDocumentSrc: new FormControl(reader.result as String, []),
              pDocumentSource: new FormControl(fileNm, []),
              pDocumentType: new FormControl('', []),      
              pDocumentUrl: new FormControl(docUrl, [])
            });
            this.newDocuments(propIndex).push(document)
        };
        this.clearExtra(propIndex)
        //this.selectedFileToUpload = fileToUpload;
      } else {
        this.snackBar.open("Only PDF Files Supported!", "OK");
        //this.clearExtra(propIndex)
      }
    }
  }

  clearExtra(propIndex: number) {
    for(let i=0; i<this.newDocuments(propIndex).length; i++){
      if(this.newDocuments(propIndex).at(i).value.pDocument === ""){
        console.log('empty')
        this.deleteDocument(i,propIndex);
      } else {
        console.log(this.newDocuments(propIndex).at(i).value.pDocument)
      }
    }
  }

  addDocument(propIndex:number) {
    const document = new FormGroup({
      pDocument: new FormControl('', []),
      pDocumentSrc: new FormControl('', []),
      pDocumentSource: new FormControl('', []),
      pDocumentType: new FormControl('', []),      
      pDocumentUrl: new FormControl('', [])
    });
    this.newDocuments(propIndex).push(document)
  }

  deleteDocument(index: number, propIndex: number) {
    this.newDocuments(propIndex).removeAt(index)
  }

  submitNewDocuments(propIndex: number) {
    const data = this.propertyForm.value
    console.log(this.properties.at(propIndex))
    for(let j=0; j<this.newDocuments(propIndex).length; j++) {
      console.log(this.newDocuments(propIndex))
      this.uploadService.uploadDoc(this.newDocuments(propIndex).at(j).value.pDocument)
      this.crmservice.addNewDocument(data.cprno,this.properties.at(propIndex).value.pHFNo,this.newDocuments(propIndex).at(j).value.pDocumentSource,this.newDocuments(propIndex).at(j).value.pDocumentType).subscribe((res: any) => {
        console.log(res)
      }, (err: any) => {
        console.log(err)
      })
    }
    this.authenticationService.userUploadDocument(data.cprno, data.name, data.email, this.mCurDate).subscribe((res: any) => {
      console.log('EMAIL SENT')
    }, (err: any) => {
      console.log(err)
    })
    this.getDetails(data.cprno)
  }

  formatDate(date: any) {
    var d = new Date(date), day = '' + d.getDate(), month = '' + (d.getMonth() + 1), year = d.getFullYear();

    if (day.length < 2) {
      day = '0' + day;
    } 
    if (month.length < 2) {
      month = '0' + month;
    }
    return [day, month, year].join('-');
  }

  get f(){
    return this.propertyForm.controls;
  }

  get properties(): FormArray {
    return this.propertyForm.get('properties') as FormArray
  }

  documents(propIndex: number): FormArray {
    return this.properties.at(propIndex).get("pDocuments") as FormArray
  }

  newDocuments(propIndex: number): FormArray {
    return this.properties.at(propIndex).get("pNewDocuments") as FormArray
  }

  get proxyProperties(): FormArray {
    return this.propertyForm.get('proxyProperties') as FormArray
  }

  proxyDocuments(propIndex: number): FormArray {
    return this.proxyProperties.at(propIndex).get("pDocuments") as FormArray
  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }


}

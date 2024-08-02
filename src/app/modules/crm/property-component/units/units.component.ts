import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CrmService } from 'src/app/services/crm/crm.service';
import { UploadService } from 'src/app/services/upload/upload.service';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit {
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

  imageSrc: string = '';

  constructor(private crmservice: CrmService, private router: Router, private route: ActivatedRoute, private uploadService: UploadService) { 
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
    this.getDetails(this.route.snapshot.params.id);
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
            this.primaryMember = {
              cprno: this.proxArr[0].memberno,
              name: this.proxArr[0].name,
              add1: this.proxArr[0].landlord_add1,
              add2: this.proxArr[0].landlord_Add2,
              add3: this.proxArr[0].landlord_Add3, 
              phone1: this.proxArr[0].landlord_phone1,
              phone2: this.proxArr[0].landlord_phone1,
              mobile: this.proxArr[0].landlord_mobile,
              email: this.proxArr[0].landlord_email_id,
            }
            console.log(this.proxArr[0].imagename);
            var imgVal: string = this.proxArr[0].imagename;
            if ((this.proxArr[0].imagename === null) || (this.proxArr[0].imagename === "")) {
              this.imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/imgNaN.png";
            } else if (this.proxArr[0].imagename != null) {
              console.log(this.proxArr[0].imagename);
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
              });
              this.crmservice.getAllDocuments(this.proxArr[0].memberno, this.proxArr[i].house_flat_no).subscribe((resp: any) => {
                console.log(resp)
                const docArr = resp.recordset;
                for(let j=0; j<docArr.length; j++) {
                  const docUrl = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/documents/" + docArr[j].DOCUMENTNAME
                  const document = new FormGroup({
                    pDocumentSource: new FormControl(docArr[j].DOCUMENTNAME, []),
                    pDocumentType: new FormControl(docArr[j].DOCUMENTTYPE, []),
                    pDocumentUrl: new FormControl(docUrl, [])
                  });
                  this.proxyDocuments(i).push(document)
                }
              })
              this.proxyProperties.push(prop);
            }
          })
        } else if(this.membArr[i].MEMBTYPE === 'O') {
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
                pDocuments: new FormArray([]),
              });
              this.crmservice.getAllDocuments(this.propArr[0].memberno, this.propArr[i].house_flat_no).subscribe((resp: any) => {
                console.log(resp)
                const docArr = resp.recordset;
                for(let j=0; j<docArr.length; j++) {
                  const docUrl = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/documents/" + docArr[j].DOCUMENTNAME
                  const document = new FormGroup({
                    pDocumentSource: new FormControl(docArr[j].DOCUMENTNAME, []),
                    pDocumentType: new FormControl(docArr[j].DOCUMENTTYPE, []),
                    pDocumentUrl: new FormControl(docUrl, [])
                  });
                  this.documents(i).push(document)
                }
              })
              this.properties.push(prop);
            }
          })
        }
      }
    })
  }

  submitForm() {
    let data = this.propertyForm.value
    console.log(data)
    for(let i=0; i<data.properties.length; i++) {
      for(let j=0; j<data.properties[i].pDocuments.length; j++) {
        this.uploadService.uploadDoc(data.properties[i].pDocuments[j].pDocument)
        this.crmservice.addNewDocument(data.cprno,data.properties[i].pHFNo,data.properties[i].pDocuments[j].pDocumentSource,data.properties[i].pDocuments[j].pDocumentType).subscribe((res: any) => {
          console.log(res)
        }, (err: any) => {
          console.log(err)
        })
      }
    }
  }

  newForm() {
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
    });
    const property = new FormGroup({
      pHFNo: new FormControl('', [Validators.required]),
      pParcelNo: new FormControl('', [Validators.required]),
      pPlotNo: new FormControl('', [Validators.required]),
      pPlotArea: new FormControl('', []),
      pBuiltUpArea: new FormControl('', []),
      pTotalArea: new FormControl('', []), 
      pZone: new FormControl('', []),
      pVoteWeightage: new FormControl('', []),
      pEligibity: new FormControl('', []), 
      pRooms: new FormControl('', []),
      pBathrooms: new FormControl('', []),
      pCarParkSlots: new FormControl('', []), 
      pDocuments: new FormArray([]),
    });
    this.properties.push(property);
  }

  addProperty() {
    const index = this.properties.length + 1;
    const property = new FormGroup({
      pHFNo: new FormControl('', [Validators.required]),
      pParcelNo: new FormControl('', [Validators.required]),
      pPlotNo: new FormControl('', [Validators.required]),
      pPlotArea: new FormControl('', []),
      pBuiltUpArea: new FormControl('', []),
      pTotalArea: new FormControl('', []), 
      pZone: new FormControl('', []),
      pVoteWeightage: new FormControl('', []),
      pEligibity: new FormControl('', []), 
      pRooms: new FormControl('', []),
      pBathrooms: new FormControl('', []),
      pCarParkSlots: new FormControl('', []), 
    });
    this.properties.push(property);
  }

  deleteProperty(index: number) {
    if(this.properties.length === 1){
      console.log(this.properties)
    } else {
      this.properties.removeAt(index);
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
    this.documents(propIndex).push(document)
  }

  deleteDocument(index: number, propIndex: number) {
    this.documents(propIndex).removeAt(index)
  }

  onFileChange(event: any, propIndex: number) {
    var filesList: FileList = event.target.files;
    const reader = new FileReader();

    if(event.target.files && event.target.files.length) {
      const fileToUpload: any = filesList.item(0);
      console.log(fileToUpload.name);
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
          this.documents(propIndex).push(document)
      };
      this.clearExtra(propIndex)
      //this.selectedFileToUpload = fileToUpload;
    }
  }

  validateDoc(document: any,status: string){
    console.log(document)
    let data = this.propertyForm.value
    this.crmservice.updateDocStatus(data.cprno,document.pDocumentSource,status).subscribe((res: any) => {
    })
    alert(`Document successfully marked ${status}`)
  }

  clearExtra(propIndex: number) {
    for(let i=0; i<this.documents(propIndex).length; i++){
      if(this.documents(propIndex).at(i).value.pDocument === ""){
        console.log('empty')
        this.deleteDocument(i,propIndex);
      } else {
        console.log(this.documents(propIndex).at(i).value.pDocument)
      }
    }
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

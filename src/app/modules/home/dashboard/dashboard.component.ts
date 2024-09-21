import { Component, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ChartConfiguration } from 'chart.js';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, BaseChartDirective } from 'ng2-charts';
import { CrmService } from 'src/app/services/crm/crm.service';
import { UploadService } from 'src/app/services/upload/upload.service';
import { VotingService } from 'src/app/services/voting/voting.service';
import { AuthenticationService } from '../../authentication/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild("baseChart", {static: false}) chart: BaseChartDirective;
  @ViewChild('AGMLookupDialog', { static: false }) AGMLookupDialog!: TemplateRef<any>;
  @ViewChild('BoardLookupDialog', { static: false }) BoardLookupDialog!: TemplateRef<any>;

  propertyForm: FormGroup;
  propArr: any[] = [];
  proxArr: any[] = [];
  membArr: any[] = [];

  hasProxy = false;

  proxySrc: string = 'NaN';
  selectedFileToUploadProx = new File([""], "pdf");
  ccrSrc: string = 'NaN';
  selectedFileToUploadCpr = new File([""], "pdf");
  appSrc: string = 'NaN';
  selectedFileToUploadPp = new File([""], "pdf");
  gccSrc: string = 'NaN';
  selectedFileToUploadGcc = new File([""], "pdf");
  imageSrc: string = 'NaN';
  selectedFileToUploadImg = new File([""], "img");

  mRegMemCount: number = 0
  mUnRegMemCount: number = 0
  mMemCount: number = 0
  mProxMemCount: number = 0
  mPropCount: number = 0
  mRegPropCount: number = 0;
  mUnRegPropCount: number = 0
  mVoterElectorate: number = 0;
  mVotedMembers: number = 0;
  mNotVotedMembers: number = 0;

  messageString: string = '';
  mesBgdColour: string = '#f4f4f4';
  mesTxtColour: string = '#dcdcdc';
  mexBorColour: string = '1px solid #dcdcdc';

  registerLink = false;
  resubmitLink = false;
  closewitlink = false;

  utc = new Date();
  mCurDate = this.formatDate(this.utc);
  mCYear = new Date().getFullYear();
  mCsec = new Date().getSeconds();
  mid = this.mCYear + this.mCsec;

  signupvideoSource = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/information/FC-SignUp.mov"
  nominationvideoSource = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/information/Board-nomination.mov"
  votevideoSource = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/information/FC-Walkthrough.mov"

  uC = JSON.parse(localStorage.getItem('userid'));

  arUrl = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/information/%D8%B1%D8%B3%D8%A7%D9%84%D8%A9+%D8%A7%D9%84%D9%89+%D8%AC%D9%85%D9%8A%D8%B9+%D8%A7%D9%84%D9%85%D9%84%D8%A7%D9%83+%D9%81%D9%8A+%D8%A7%D9%84%D9%85%D8%AF%D9%8A%D9%86%D8%A9+%D8%A7%D9%84%D8%B9%D8%A7%D9%8A%D9%94%D9%85%D8%A9+01+09+2024.pdf"
  enUrl = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/information/Message+to+All+Floating+City+Homeowners+01+09+2024.pdf"
  imgArUrl = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/information/flex+two.jpg"
  imgEnUrl = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/information/flex+one.jpg"

  ngOnInit() {
    this.getDetails(this.uC);
  }

  ngAfterViewInit() {
    this.getData();
  }
   
  constructor(private crmService: CrmService, private votingService: VotingService, private snackBar: MatSnackBar, private dialog: MatDialog, private uploadService: UploadService, private authenticationService: AuthenticationService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
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
      memberType: new FormControl('N', []),
      balance: new FormControl('0', []),
      properties: new FormArray([]),
      proxyProperties: new FormArray([]),
      proxcprno: new FormControl('', [Validators.required]),
      proxname: new FormControl('', [Validators.required]),
      proxmobile: new FormControl('', []),
      proxemail: new FormControl('', [Validators.required]),
      proxDoc: new FormControl('NaN', []),
      appDoc: new FormControl('NaN', []),
      ccrDoc: new FormControl('NaN', []),
      gccDoc: new FormControl('NaN', []),
      imgDoc: new FormControl('NaN', []),
    });
  }

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChart1Labels: Label[] = ['Registered Members', 'Unregistered Members', 'Proxy Members'];
  public pieChart1Data: SingleDataSet  = [this.mRegMemCount, this.mUnRegMemCount, this.mProxMemCount]
  public pieChart3Labels: Label[] = ['Members Voted', 'Members who did not vote'];
  public pieChart3Data: SingleDataSet  = [this.mVotedMembers, this.mNotVotedMembers]
  public pieChart2Labels: Label[] = ['Registered Properties', 'Unregistered Properties'];
  public pieChart2Data: SingleDataSet  = [this.mRegPropCount, this.mUnRegPropCount]
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  getData() {
    this.crmService.getAllMembers().subscribe((res: any) => {
      console.log(res)
      this.mRegMemCount = res.rowsAffected[0]
      this.crmService.getAllPotentialMembers().subscribe((res: any) => {
        console.log(res)
        this.mMemCount = res.recordset[0].COUNT
        this.mUnRegMemCount = this.mMemCount - this.mRegMemCount;
        //this.chart.chart.update();
        this.crmService.getAllProxyMembers().subscribe((res: any) => {
          console.log(res)
          this.mProxMemCount = res.recordset[0].COUNT
          this.pieChart1Data = [this.mRegMemCount, this.mUnRegMemCount, this.mProxMemCount]
          this.crmService.getAllProperties().subscribe((res: any) => {
            console.log(res)
            this.mPropCount = res.rowsAffected[0]
            this.crmService.getAllPropertyWiseLandlords().subscribe((res: any) => {
              console.log(res)
              this.mRegPropCount = res.rowsAffected[0]
              this.mUnRegPropCount = this.mPropCount - this.mRegPropCount;
              this.pieChart2Data = [this.mRegPropCount, this.mUnRegPropCount]
              /*this.votingService.checkVotingNumber().subscribe((res: any) => {
                this.mVoterElectorate = this.mRegMemCount
                this.mVotedMembers = res.recordset[0].VOTERS
                this.mNotVotedMembers = this.mVoterElectorate - this.mVotedMembers
                this.pieChart3Data = [this.mVotedMembers, this.mNotVotedMembers]
              })*/
            }, (err: any) => {
            console.log(err)
          })
          }, (err: any) => {
            console.log(err)
          }) 
        }, (err: any) => {
          console.log(err)
        })
      }, (err: any) => {
        console.log(err)
      })
    }, (err: any) => {
      console.log(err)
    })
  }

  getDetails(cprno: string) {
    this.crmService.getMemberFromCPR(cprno).subscribe((res: any) => {
      this.membArr = res.recordset
      console.log(this.membArr)
      for(let i=0;i<this.membArr.length;i++) {
        this.crmService.getLandlordWiseProperties(cprno).subscribe((res: any) => {
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
            memberType: 'N',
            balance: '0',
          })
          for(let i=0; i<this.propArr.length; i++) {
            const prop = new FormGroup({
              pHFNo: new FormControl(this.propArr[i].house_flat_no, [Validators.required]),
              pParcelNo: new FormControl(this.propArr[i].parcelno, [Validators.required]),
              pCPRStatus: new FormControl('', []), 
              pTitleDeedStatus: new FormControl('', []), 
              pEWAReceiptStatus: new FormControl('', []), 
              pDocuments: new FormArray([]),
            });
            this.crmService.getAllDocuments(this.propArr[0].memberno, this.propArr[i].house_flat_no).subscribe((resp: any) => {
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
                } if((docArr[j].DOCUMENTSTATUS === 'Valid') && (docArr[j].DOCUMENTTYPE === 'CPR')) {
                  pCPRStatus = 'Valid'
                } if((docArr[j].DOCUMENTSTATUS === 'Valid') && (docArr[j].DOCUMENTTYPE === 'TITLE DEED')) {
                  pTitleDeedStatus = 'Valid'
                } if((docArr[j].DOCUMENTSTATUS === 'Valid') && (docArr[j].DOCUMENTTYPE === 'RECEIPT')) {
                  pEWAReceiptStatus = 'Valid'
                } if((docArr[j].DOCUMENTSTATUS === 'Invalid') && (docArr[j].DOCUMENTTYPE === 'CPR')) {
                  pCPRStatus = 'Invalid'
                } if((docArr[j].DOCUMENTSTATUS === 'Invalid') && (docArr[j].DOCUMENTTYPE === 'TITLE DEED')) {
                  pTitleDeedStatus = 'Invalid'
                } if((docArr[j].DOCUMENTSTATUS === 'Invalid') && (docArr[j].DOCUMENTTYPE === 'RECEIPT')) {
                  pEWAReceiptStatus = 'Invalid'
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
    })
  }

  checkStatus() {
    const propData = this.propertyForm.value
    console.log(propData)
    for (var i=0; i<propData.properties.length; i++) {
      if ((propData.properties[i].pCPRStatus === 'Valid') && (propData.properties[i].pTitleDeedStatus === 'Valid')) {
        this.messageString = 'You are eligible to register and attend the AGM';
        this.mesBgdColour = '#aafa9d';
        this.mesTxtColour = '#2f5c2f';
        this.mexBorColour = '1px solid #2f5c2f';
        this.registerLink = true;
        break;
      } else if ((propData.properties[i].pCPRStatus === 'In Process') || (propData.properties[i].pTitleDeedStatus === 'In Process')) {
        this.messageString = 'Kindly wait for your documents to be verified to register for the AGM';
        this.mesBgdColour = '#fae891';
        this.mesTxtColour = 'goldenrod';
        this.mexBorColour = '1px solid #f5cd05';
        this.closewitlink = true;
        break;
      } else if ((propData.properties[i].pCPRStatus === 'Not Submitted') || (propData.properties[i].pCPRStatus === 'Not Submitted')) {
        this.messageString = 'Kindly submit all necessary documents to be able to register for the AGM';
        this.mesBgdColour = '#fa9191';
        this.mesTxtColour = '#fc0303';
        this.mexBorColour = '1px solid #fc0303';
        this.resubmitLink = true;
        break;
      } else if ((propData.properties[i].pCPRStatus === 'Invalid') || (propData.properties[i].pCPRStatus === 'Invalid')) {
        this.messageString = 'Your documents are invalid, kindly resubmit all necessary documents to be able to register';
        this.mesBgdColour = '#fa9191';
        this.mesTxtColour = '#fc0303';
        this.mexBorColour = '1px solid #fc0303';
        this.resubmitLink = true;
        break;
      } else {
        this.messageString = 'Kindly submit all necessary documents to be able to register for the AGM';
        this.mesBgdColour = '#fa9191';
        this.mesTxtColour = '#fc0303';
        this.mexBorColour = '1px solid #fc0303';
        this.resubmitLink = true;
        break;
      }
    }
  }

  getMessageStyles(background: string, colour: string, border: string) {
    return {
      background: background,
      color: colour,
      border: border
    };
  }

  checkProxy(value: string) {
    console.log(value)
    if(value === 'Y') {
      this.hasProxy = true;
    } else {
      this.hasProxy = false;
    }
  }

  getProxyDetails(cprno: string) {
    this.crmService.getMemberFromCPR(cprno).subscribe((res: any) => {
      console.log(res);
      this.propertyForm.patchValue({
        proxcprno: res.recordset[0].CPRNo,
        proxname: res.recordset[0].NAME,
        proxemail: res.recordset[0].Email,
      })
    })
  }

  onFileChange(event: any, type: string) {
    if (type === 'X') {
      var filesList: FileList = event.target.files;
      const reader = new FileReader();
      if(event.target.files && event.target.files.length) {
        const fileToUpload: any = filesList.item(0);
        console.log(fileToUpload.name);
        if(fileToUpload.type === 'application/pdf') {
          const imgNm: string = fileToUpload.name;
          console.log(imgNm);
          reader.readAsDataURL(fileToUpload);
          reader.onload = () => {
            this.proxySrc = reader.result as string;
            this.propertyForm.patchValue({
              //image: reader.result
              proxDoc: imgNm
            });
          };
          this.selectedFileToUploadProx = fileToUpload;
        } else {
          //this.snackBar.open("Only PDF Files Supported!", "OK");
          alert('Only PDF Files Supported!')
        }
      }
    } else if (type === 'C') {
      var filesList: FileList = event.target.files;
      const reader = new FileReader();
      if(event.target.files && event.target.files.length) {
        const fileToUpload: any = filesList.item(0);
        console.log(fileToUpload.name);
        if(fileToUpload.type === 'application/pdf') {
          const imgNm: string = fileToUpload.name;
          console.log(imgNm);
          reader.readAsDataURL(fileToUpload);
          reader.onload = () => {
            this.ccrSrc = reader.result as string;
            this.propertyForm.patchValue({
              //image: reader.result
              ccrDoc: imgNm
            });
          };
          this.selectedFileToUploadCpr = fileToUpload;
        } else {
          //this.snackBar.open("Only PDF Files Supported!", "OK");
          alert('Only PDF Files Supported!')
        }
      }
    } else if (type === 'P') {
      var filesList: FileList = event.target.files;
      const reader = new FileReader();
      if(event.target.files && event.target.files.length) {
        const fileToUpload: any = filesList.item(0);
        console.log(fileToUpload.name);
        if(fileToUpload.type === 'application/pdf') {
          const imgNm: string = fileToUpload.name;
          console.log(imgNm);
          reader.readAsDataURL(fileToUpload);
          reader.onload = () => {
            this.appSrc = reader.result as string;
            this.propertyForm.patchValue({
              //image: reader.result
              appDoc: imgNm
            });
          };
          this.selectedFileToUploadPp = fileToUpload;
        } else {
          //this.snackBar.open("Only PDF Files Supported!", "OK");
          alert('Only PDF Files Supported!')
        }
      }
    } else if (type === 'G') {
      var filesList: FileList = event.target.files;
      const reader = new FileReader();
      if(event.target.files && event.target.files.length) {
        const fileToUpload: any = filesList.item(0);
        console.log(fileToUpload.name);
        if(fileToUpload.type === 'application/pdf') {
          const imgNm: string = fileToUpload.name;
          console.log(imgNm);
          reader.readAsDataURL(fileToUpload);
          reader.onload = () => {
            this.gccSrc = reader.result as string;
            this.propertyForm.patchValue({
              //image: reader.result
              gccDoc: imgNm
            });
          };
          this.selectedFileToUploadGcc = fileToUpload;
        } else {
          //this.snackBar.open("Only PDF Files Supported!", "OK");
          alert('Only PDF Files Supported!')
        }
      }
    } else if (type === 'I') {
      var filesList: FileList = event.target.files;
      const reader = new FileReader();
      if(event.target.files && event.target.files.length) {
        const fileToUpload: any = filesList.item(0);
        console.log(fileToUpload.name);
        const imgNm: string = fileToUpload.name;
        console.log(imgNm);
        reader.readAsDataURL(fileToUpload);
        reader.onload = () => {
          this.imageSrc = reader.result as string;
          this.propertyForm.patchValue({
            //image: reader.result
            imgDoc: imgNm
          });
        }
        this.selectedFileToUploadImg = fileToUpload;
      }
    }
  }
  
  submitRegistration() {
    const data = this.propertyForm.value
    console.log(data)
    this.votingService.getAGMYearwiseRecord(this.mCYear.toString()).subscribe((res: any) => {
      console.log(res)
      for(let i=0; i<res.recordset.length; i++) {
        this.votingService.checkMemberRegistration(res.recordset[i].AGMCODE, this.uC).subscribe((resp: any) => {
          console.log(resp)
          if (resp.recordset.length === 0) {
            console.log(this.hasProxy)
            if(this.hasProxy) {
              this.votingService.insertMemberRegistration(res.recordset[i].AGMCODE, data.cprno, data.name, 'O', data.email, this.mCurDate, 'Y', 'self').subscribe((respo: any) => {
                console.log(respo)
              })
              this.authenticationService.userAGMRegistrationDocEmail(this.uC,res.recordset[i].AGMNAME, data.name, data.email, this.mCurDate).subscribe((res: any) => {
                console.log(res)
              })
              this.uploadService.uploadDoc(this.selectedFileToUploadProx)
              this.crmService.addNewDocument(data.cprno,data.proxcprno,data.proxDoc,'PROXY').subscribe((res: any) => {
                console.log(res)
              }, (err: any) => {
               console.log(err)
              })
              this.crmService.getMemberFromCPR(data.proxcprno).subscribe((respon: any) => {
                console.log(respon);
                if (respon.recordset.length === 0) {
                  this.crmService.postMember(this.mid.toString(), data.proxcprno, data.proxcprno, data.proxname, 'P', '', '', '', '', '', data.proxemail, data.proxcprno, 'N', '', data.cprno).subscribe((respons: any) => {
                    console.log(respons)
                  })
                  this.votingService.insertMemberRegistration(res.recordset[i].AGMCODE, data.proxcprno, data.proxname, 'P', data.email, this.mCurDate, 'N', data.cprno).subscribe((respo: any) => {
                    console.log(respo)
                  })
                } else {
                  this.votingService.insertMemberRegistration(res.recordset[i].AGMCODE, data.proxcprno, data.proxname, 'P', data.email, this.mCurDate, 'N', data.cprno).subscribe((respo: any) => {
                    console.log(respo)
                  })
                }
              }, (err: any) => {
                this.crmService.postMember(this.mid.toString(), data.proxcprno, data.proxcprno, data.proxname, 'P', '', '', '', '', '', data.proxemail, data.proxcprno, 'N', '', data.cprno).subscribe((respons: any) => {
                  console.log(respons)
                })
                this.votingService.insertMemberRegistration(res.recordset[i].AGMCODE, data.proxcprno, data.proxname, 'P', data.email, this.mCurDate, 'N', data.cprno).subscribe((respo: any) => {
                  console.log(respo)
                })
                this.authenticationService.userAGMRegistrationDocEmail(this.uC,res.recordset[i].AGMNAME, data.name, data.email, this.mCurDate).subscribe((res: any) => {
                  console.log(res)
                })
                this.snackBar.open("You have been successfully registered! We look forward to meeting you at the AGM", "OK");
                //alert('You have been successfully registered! We look forward to meeting you at the AGM!')
                this.closeDialog()
              })
              this.authenticationService.userAGMRegistrationProxyEmail(data.cprno, data.name, data.proxname, res.recordset[i].AGMNAME, data.proxemail, this.mCurDate).subscribe((res: any) => {
                console.log(res)
              })
              this.snackBar.open("You have been successfully registered! We look forward to meeting you at the AGM", "OK");
              //alert('You have been successfully registered! We look forward to meeting you at the AGM!')
              this.closeDialog()
            } else {
              this.votingService.insertMemberRegistration(res.recordset[i].AGMCODE, data.cprno, data.name, 'O', data.email, this.mCurDate, 'Y', 'self').subscribe((respo: any) => {
                console.log(respo)
              })
              this.authenticationService.userAGMRegistrationDocEmail(this.uC,res.recordset[i].AGMNAME, data.name, data.email, this.mCurDate).subscribe((res: any) => {
                console.log(res)
              })
              this.snackBar.open("You have been successfully registered! We look forward to meeting you at the AGM", "OK");
              //alert('You have been successfully registered! We look forward to meeting you at the AGM!')
              this.closeDialog()
            }
          } else {
            this.snackBar.open("You have already registered! We look forward to meeting you at the AGM", "OK");
            //alert('You have already registered! We look forward to meeting you at the AGM!')
            this.closeDialog()
          }
        }, (err: any) => {
          if(this.hasProxy) {
            this.votingService.insertMemberRegistration(res.recordset[i].AGMCODE, data.cprno, data.name, 'O', data.email, this.mCurDate, 'Y', 'self').subscribe((respo: any) => {
              console.log(respo)
            })
            this.authenticationService.userAGMRegistrationDocEmail(this.uC,res.recordset[i].AGMNAME, data.name, data.email, this.mCurDate).subscribe((res: any) => {
              console.log(res)
            })
            this.uploadService.uploadDoc(this.selectedFileToUploadProx)
            this.crmService.addNewDocument(data.cprno,data.proxcprno,this.proxySrc,'PROXY').subscribe((res: any) => {
              console.log(res)
            }, (err: any) => {
             console.log(err)
            })
            this.crmService.getMemberFromCPR(data.proxcprno).subscribe((respon: any) => {
              console.log(respon);
              if (respon.recordset.length === 0) {
                this.crmService.postMember(this.mid.toString(), data.proxcprno, data.proxcprno, data.proxname, 'P', '', '', '', '', '', data.proxemail, data.proxcprno, 'N', '', data.cprno).subscribe((respons: any) => {
                  console.log(respons)
                })
                this.votingService.insertMemberRegistration(res.recordset[i].AGMCODE, data.proxcprno, data.proxname, 'P', data.email, this.mCurDate, 'N', data.cprno).subscribe((respo: any) => {
                  console.log(respo)
                })
              } else {
                this.votingService.insertMemberRegistration(res.recordset[i].AGMCODE, data.proxcprno, data.proxname, 'P', data.email, this.mCurDate, 'N', data.cprno).subscribe((respo: any) => {
                  console.log(respo)
                })
              }
              this.snackBar.open("You have been successfully registered! We look forward to meeting you at the AGM", "OK");
              //alert('You have been successfully registered! We look forward to meeting you at the AGM!')
              this.closeDialog()
            }, (err: any) => {
              this.crmService.postMember(this.mid.toString(), data.proxcprno, data.proxcprno, data.proxname, 'P', '', '', '', '', '', data.proxemail, data.proxcprno, 'N', '', data.cprno).subscribe((respons: any) => {
                console.log(respons)
              })
              this.votingService.insertMemberRegistration(res.recordset[i].AGMCODE, data.proxcprno, data.proxname, 'P', data.email, this.mCurDate, 'N', data.cprno).subscribe((respo: any) => {
                console.log(respo)
              })
              this.authenticationService.userAGMRegistrationDocEmail(this.uC,res.recordset[i].AGMNAME, data.name, data.email, this.mCurDate).subscribe((res: any) => {
                console.log(res)
              })
            })
            this.authenticationService.userAGMRegistrationProxyEmail(data.cprno, data.name, data.proxname, res.recordset[i].AGMNAME, data.proxemail, this.mCurDate).subscribe((res: any) => {
              console.log(res)
            })
            this.snackBar.open("You have been successfully registered! We look forward to meeting you at the AGM", "OK");
            //alert('You have been successfully registered! We look forward to meeting you at the AGM!')
            this.closeDialog()
          } else {
            this.votingService.insertMemberRegistration(res.recordset[i].AGMCODE, data.cprno, data.name, 'O', data.email, this.mCurDate, 'Y', 'self').subscribe((respo: any) => {
              console.log(respo)
            })
            this.authenticationService.userAGMRegistrationDocEmail(this.uC,res.recordset[i].AGMNAME, data.name, data.email, this.mCurDate).subscribe((res: any) => {
              console.log(res)
            })
            this.snackBar.open("You have been successfully registered! We look forward to meeting you at the AGM", "OK");
            //alert('You have been successfully registered! We look forward to meeting you at the AGM!')
            this.closeDialog()
          }
        })
      }
    })
  }

  submitNomination() {
    const data = this.propertyForm.value
    console.log(data)
    console.log(data.appDoc)
    console.log(data.ccrDoc)
    console.log(data.gccDoc)
    console.log(data.imgDoc)
    if(this.appSrc === "NaN") {
      alert('Please insert all the requisite documents')
    } else if (this.ccrSrc === "NaN") {
      alert('Please insert all the requisite documents')
    } else if  (this.gccSrc === "NaN") {
      alert('Please insert all the requisite documents')
    } else {
      this.votingService.checkMemberNomination('AGM2024-2', this.uC).subscribe((res: any) => {
        console.log(res.recordset)
        if(res.recordset.length === 0) {
          this.uploadService.uploadDoc(this.selectedFileToUploadCpr)
          this.crmService.addNewDocument(data.cprno,'Clearance',data.ccrDoc,'CC').subscribe((res: any) => {
            console.log(res)
          }, (err: any) => {
            console.log(err)
          })
          this.uploadService.uploadDoc(this.selectedFileToUploadGcc)
          this.crmService.addNewDocument(data.cprno,'Good Conduct Certificate',data.gccDoc,'GCC').subscribe((res: any) => {
            console.log(res)
          }, (err: any) => {
            console.log(err)
          })
          this.uploadService.uploadDoc(this.selectedFileToUploadPp)
          this.crmService.addNewDocument(data.cprno,'Nomination Form',data.appDoc,'NOMINAION').subscribe((res: any) => {
            console.log(res)
          }, (err: any) => {
            console.log(err)
          })
          this.uploadService.uploadImage(this.selectedFileToUploadImg)
          this.authenticationService.changeImage(data.imgDoc, this.uC).subscribe((res:any) => {
            console.log(res)
          })
          this.votingService.getBoardNominationList('AGM2024-2').subscribe((resp: any) => {
            console.log(resp.recordset)
            var blitem: number
            if(resp.recordset.length === 0) {
              blitem = 1;
              this.votingService.insertMemberNomination(this.mCYear.toString(), 'ELECTION', String(blitem), this.uC, data.name, data.name, 'ELECTION 2023-24', 'AGM2024-2').subscribe((respo: any) => {
                console.log(respo)
              })
              this.authenticationService.userElectionNominationEmail(this.mCYear.toString(), data.cprno,data.name, data.email, this.mCurDate).subscribe((respo: any) => {
                console.log(respo)
              })
              this.snackBar.open("You have successfully filed your nomination! We wish you the best on your candidature at the Election", "OK");
              this.closeDialog()
            } else {
              blitem = Number(resp.recordset[0].maxCandidates) + 1;
              this.votingService.insertMemberNomination(this.mCYear.toString(), 'ELECTION', String(blitem), this.uC, data.name, data.name, 'ELECTION 2023-24', 'AGM2024-2').subscribe((respo: any) => {
                console.log(respo)
              })
              this.authenticationService.userElectionNominationEmail(this.mCYear.toString(),data.cprno, data.name, data.email, this.mCurDate).subscribe((respo: any) => {
                console.log(respo)
              })
              this.snackBar.open("You have successfully filed your nomination! We wish you the best on your candidature at the Election", "OK");
              this.closeDialog()
            }
          }, (err: any) => {
            console.log(err)
          })
        } else {
          this.snackBar.open("You have already filed your nomination! We wish you the best on your candidature at the Election", "OK");
          this.closeDialog()
        }
      }, (err: any) => {
        console.log(err)
        this.uploadService.uploadDoc(this.selectedFileToUploadCpr)
        this.crmService.addNewDocument(data.cprno,'Clearance',data.ccrDoc,'CC').subscribe((res: any) => {
            console.log(res)
        }, (err: any) => {
          console.log(err)
        })
        this.uploadService.uploadDoc(this.selectedFileToUploadGcc)
        this.crmService.addNewDocument(data.cprno,'Good Conduct Certificate',data.gccDoc,'GCC').subscribe((res: any) => {
          console.log(res)
        }, (err: any) => {
          console.log(err)
        })
        this.uploadService.uploadDoc(this.selectedFileToUploadPp)
        this.crmService.addNewDocument(data.cprno,'Nomination Form',data.appDoc,'NOMINATION').subscribe((res: any) => {
          console.log(res)
        }, (err: any) => {
          console.log(err)
        })
        this.uploadService.uploadImage(this.selectedFileToUploadImg)
        this.authenticationService.changeImage(data.imgDoc, this.uC).subscribe((res:any) => {
          console.log(res)
        })
        this.votingService.getBoardNominationList('AGM2024-2').subscribe((resp: any) => {
          console.log(resp.recordset)
          var blitem: number
          if(resp.recordset.length === 0) {
            blitem = 1;
            this.votingService.insertMemberNomination(this.mCYear.toString(), 'ELECTION', String(blitem), this.uC, data.name, data.name, 'ELECTION 2023-24', 'AGM2024-2').subscribe((respo: any) => {
              console.log(respo)
            })
            this.authenticationService.userElectionNominationEmail(this.mCYear.toString(), data.cprno,data.name, data.email, this.mCurDate).subscribe((respo: any) => {
              console.log(respo)
            })
            this.snackBar.open("You have successfully filed your nomination! We wish you the best on your candidature at the Election", "OK");
            this.closeDialog()
          } else {
            blitem = Number(resp.recordset[0].maxCandidates) + 1;
            this.votingService.insertMemberNomination(this.mCYear.toString(), 'ELECTION', String(blitem), this.uC, data.name, data.name, 'ELECTION 2023-24', 'AGM2024-2').subscribe((respo: any) => {
              console.log(respo)
            })
            this.authenticationService.userElectionNominationEmail(this.mCYear.toString(), data.cprno,data.name, data.email, this.mCurDate).subscribe((respo: any) => {
              console.log(respo)
            })
            this.snackBar.open("You have successfully filed your nomination! We wish you the best on your candidature at the Election", "OK");
            this.closeDialog()
          }
        }, (err: any) => {
          console.log(err)
        })
      })
    }
  }

  deleteDocument(type: string) {
    if (type === 'X') {
      this.propertyForm.patchValue({
        proxDoc: ""
      })
      this.proxySrc = ''
      this.selectedFileToUploadProx = new File([""], "pdf");
    } else if (type === 'P') {
      this.propertyForm.patchValue({
        appDoc: ""
      })
      this.appSrc = ''
      this.selectedFileToUploadPp = new File([""], "pdf");
    } else if (type === 'G') {
      this.propertyForm.patchValue({
        gccDoc: ""
      })
      this.gccSrc = ''
      this.selectedFileToUploadGcc = new File([""], "pdf");
    } if (type === 'C') {
      this.propertyForm.patchValue({
        ccrDoc: ""
      })
      this.ccrSrc = ''
      this.selectedFileToUploadGcc = new File([""], "pdf");
    }
  }

  openRegisteration() {
    let dialogRef = this.dialog.open(this.AGMLookupDialog);
    this.checkStatus()
  }

  openNomination() {
    let dialogRef = this.dialog.open(this.BoardLookupDialog);
    this.checkStatus()
  }

  closeDialog() {
    let dialogRef = this.dialog.closeAll()
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


  downloadAr() {
    const a: any = document.createElement('a');
    a.href = this.arUrl;
    a.download = 'Message-AR-Form.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);    
  }
  
  downloadEn() {
    const a: any = document.createElement('a');
    a.href = this.enUrl;
    a.download = 'Message-EN-Form.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);    
  }

}

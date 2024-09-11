import { Component, OnInit } from '@angular/core';
//import { config, SecretsManager, S3 , CognitoIdentityCredentials} from 'aws-sdk';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss']
})
export class DownloadsComponent implements OnInit {

  arUrl = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/information/04-Election+form+HOA-AR.pdf"
  enUrl = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/information/04-Election+Form+HOA-EN.pdf"
  proxEnUrl = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/information/Proxy+Form-EN.pdf"
  proxArUrl = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/information/Proxy+form-AR.pdf"
  auditReport23 = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/information/Float+City+Owners+Association+-+2023+Audit+report+signed.pdf"
  budget2425 = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/information/Proposed+Budget+Y2024-2025-FCMOA.pdf"
  insurance = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/information/Insurance+Policy.pdf"
  annEnUrl = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/information/Announcement-EN.pdf"
  annArUrl = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/information/Announcement-AR.pdf"
  mom23 = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/information/AGM+MOM.pdf"
  agendaEn23 = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/information/Agenda+of+meeting-EN.pdf"
  agendaAr23 = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/information/Agenda+of+meeting-AR.pdf"  
  votingPaper24 = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/information/Voting+Paper+2024-2025+-+EN_AR.pdf"
  workReport24 = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/information/Work+completion+report+Amwaj+Island-+PCT+505+-+R0+(1).pdf"
  TRAudit24 = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/information/Amwaj+Floating+City+-+TR+Audit+Report-240620.pdf"

  constructor() { }

  ngOnInit() {
  }

  download(url: string) {
    const a: any = document.createElement('a');
    a.href = url;
    //a.download = 'HOA-AR-Form.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);    
  }

}

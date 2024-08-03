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
  

  constructor() { }

  ngOnInit() {
  }

  downloadAr() {
    const a: any = document.createElement('a');
    a.href = this.arUrl;
    a.download = 'HOA-AR-Form.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);    
  }
  
  downloadEn() {
    const a: any = document.createElement('a');
    a.href = this.enUrl;
    a.download = 'HOA-EN-Form.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);    
  }

}

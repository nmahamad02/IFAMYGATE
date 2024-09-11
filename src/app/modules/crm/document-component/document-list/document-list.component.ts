import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CrmService } from 'src/app/services/crm/crm.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {
  memberList: any[] = [];
  docList: any[] = [];
  membSearchValue: any;
  docSearchValue: any;
  columnMemberDefs: any;
  columnDocDefs: any;
  isTableExpanded = false;
  memberListDataSource = new MatTableDataSource(this.memberList);
  docListDataSource = new MatTableDataSource(this.docList);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('TABLE', { static: false }) table: ElementRef;

  constructor(private crmservice: CrmService, private router: Router) {
    this.columnMemberDefs = ['actions', "memberno", "NAME", "buttons"];
    this.columnDocDefs = ['memberno', "NAME", "HOUSE", "DOCUMENTNAME", "TYPE", "STATUS", "view", "validate", "invalidate"];
  }

  ngOnInit(): void {

    //Get Members Details
    this.getAllPrimaryMembers();

    this.getAllPendingDocs();

    this.toggleTableRows();
  }

  getAllPrimaryMembers() {
    this.crmservice.getAllMembers().subscribe((res: any) => {
      this.memberList = res.recordset;
      for(let i=0;i<this.memberList.length;i++){
        this.crmservice.getDocumentsTest(this.memberList[i].MemberNo).subscribe((res: any) => {
          const docArr = res.recordset;
          this.memberList[i].documents = docArr;
        })
        this.crmservice.getUnkownDocuments(this.memberList[i].MemberNo).subscribe((res: any) => {
          const docArr = res.recordset;
          this.memberList[i].unknownDocuments = docArr;
        })
        var imgVal: string = this.memberList[i].IMAGENAME;
        if ((this.memberList[i].IMAGENAME === null) || (this.memberList[i].IMAGENAME === "")) {
          this.memberList[i].imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/imgNaN.png";
        } else if (this.memberList[i].IMAGENAME != null) {
          if (imgVal.includes("fakepath")) {
            var imgName: string = imgVal.slice(12);
            console.log(imgName);
            this.memberList[i].imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/" + imgName;
          } else {
            this.memberList[i].imageSrc = "https://ifamygate-floatingcity.s3.me-south-1.amazonaws.com/images/" + imgVal;
          }
        }
      }
      this.memberListDataSource = new MatTableDataSource(this.memberList);
      this.memberListDataSource.sort = this.sort;
      this.memberListDataSource.paginator = this.paginator;
      this.toggleTableRows();
    })
  }

  getAllPendingDocs() {
    this.crmservice.pendingDocList().subscribe((res: any) => {
      this.docList = res.recordset
      console.log(this.docList);
      this.docListDataSource = new MatTableDataSource(this.docList);
      this.docListDataSource.sort = this.sort;
      this.docListDataSource.paginator = this.paginator;
    })
  }

  quickMemberSearch() {
    this.memberListDataSource.filter = this.membSearchValue.trim().toLowerCase();
  }

  quickDocSearch() {
    this.docListDataSource.filter = this.docSearchValue.trim().toLowerCase();
  }

  toggleTableRows() {
    this.isTableExpanded = !this.isTableExpanded;
    this.memberListDataSource.data.forEach((row: any) => {
      row.isExpanded = this.isTableExpanded;
    })
  }

  public gotoDocumentDetails(url, id) {
    var myurl = `${url}/${id}`;
    this.router.navigateByUrl(myurl).then(e => {
    });
  }

}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { CrmService } from 'src/app/services/crm/crm.service';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.scss']
})
export class UnitListComponent implements OnInit {
  //eligibleUnitList: any[] = [];
  //nonEligibleUnitList: any[] = [];
  searchValue: any;
  propertyList: any[] = [];
  propertyListDataSource = new MatTableDataSource(this.propertyList);
  columns: any[];

  @ViewChild("table1", {static: false}) table: ElementRef;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private crmservice: CrmService, private router: Router) {
    this.columns = [ "memberno", "name", "property", "Actions"];
  }

  ngOnInit(): void {
    this.crmservice.getAllPropertyWiseLandlords().subscribe((res: any) => {
      this.propertyList = res.recordset;
      console.log(this.propertyList)
      this.propertyListDataSource = new MatTableDataSource(this.propertyList);
      this.propertyListDataSource.sort = this.sort;
      this.propertyListDataSource.paginator = this.paginator;
    }, (error: any) => {
      console.log(error);
    });
  }

  quickPropertySearch() {
    this.propertyListDataSource.filter = this.searchValue.trim().toLowerCase();
  }

  /*ngOnInit() {
    this.crmService.getAllEligibleUnits().subscribe((res: any) => {
      this.eligibleUnitList = res.recordset;
      console.log(this.eligibleUnitList)
    }, (err: any) => {
      console.log(err);
    })
    this.crmService.getAllNonEligibleUnits().subscribe((res: any) => {
      this.nonEligibleUnitList = res.recordset;
      console.log(this.nonEligibleUnitList)
    }, (err: any) => {
      console.log(err);
    })
  }*/


  fireEvent() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.table.nativeElement
    );

    /* new format */
    var fmt = "0.00";
    /* change cell format of range B2:D4 */
    var range = { s: { r: 1, c: 1 }, e: { r: 2, c: 100000 } };
    for (var R = range.s.r; R <= range.e.r; ++R) {
      for (var C = range.s.c; C <= range.e.c; ++C) {
        var cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
        if (!cell || cell.t != "n") continue; // only format numeric cells
        cell.z = fmt;
      }
    }
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    var fmt = "@";
    wb.Sheets["Sheet1"]["F"] = fmt;

    /* save to file */
    XLSX.writeFile(wb, "Voter-Property-List.xlsx");
  }

  public gotoPropertyDetails(url, id) {
    var myurl = `${url}/${id}`;
    this.router.navigateByUrl(myurl).then(e => {
    });
  }

}

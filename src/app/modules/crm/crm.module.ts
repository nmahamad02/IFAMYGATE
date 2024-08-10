import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartsModule, ThemeService } from 'ng2-charts';
import { MembersComponent } from './member-component/members/members.component';
import { UnitsComponent } from './property-component/units/units.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MemberListComponent } from './member-component/member-list/member-list.component';
import { UnitListComponent } from './property-component/unit-list/unit-list.component';
import { MatIconModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule} from '@angular/material/card'
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from "@angular/material/sort";
import { PdfViewerModule } from 'ng2-pdf-viewer';


export const crmRoutes = [
  {
    path: 'property-list',
    component: UnitListComponent
  },
  {
    path: 'property/details/:id',
    component: UnitsComponent
  },
  {
    path: 'owner-list',
    component: MemberListComponent
  },
  {
    path: 'owner/details/:id',
    component: MembersComponent
  },
];

@NgModule({
  declarations: [
    MembersComponent, 
    MemberListComponent,
    UnitsComponent,
    UnitListComponent
  ],
  imports: [
    MatIconModule,
    CommonModule,
    ChartsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatPaginatorModule,
    MatDividerModule,
    MatSortModule,
    FormsModule,
    PdfViewerModule,
    ReactiveFormsModule,
    RouterModule.forChild(crmRoutes)
  ],
  providers: [
    ThemeService
  ]
})
export class CrmModule { }

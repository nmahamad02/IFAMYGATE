import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { DownloadsComponent } from './downloads/downloads.component';
import { RouterModule } from '@angular/router';
import { EmailsComponent } from './emails/emails.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule} from '@angular/material/card'
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatTabsModule } from '@angular/material/tabs';


export const notificationRoutes = [
  {
    path: 'announcements',
    component: AnnouncementsComponent
  },
  {
    path: 'emails',
    component: EmailsComponent
  },
  {
    path: 'downloads',
    component: DownloadsComponent
  },
];

@NgModule({
  declarations: [AnnouncementsComponent, DownloadsComponent, EmailsComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatCardModule,
    PdfViewerModule,
    MatTabsModule,
    RouterModule.forChild(notificationRoutes)
  ]
})
export class NotificationsModule { }

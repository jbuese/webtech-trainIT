import { Component } from '@angular/core';
import { SecurityNewsService } from './security-news.service';
import { AngularComponent } from '../angular/angular.component';
import { SessionService } from '../angular/session.service';

@Component({
  selector: 'wt2-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.sass'],
  providers: [SecurityNewsService]
})
export class SecurityComponent extends AngularComponent {

  // constructor(newsService: SessionService/**SecurityNewsService**/) {
  //   super(newsService);
  // }
}

import { Component, OnInit } from '@angular/core';
import { NewsService } from './news.service';
import { News } from '../news';
import { SessionService } from './session.service';
import { Session } from '../session'
import { SessionAuthService } from '../session-auth.service';

@Component({
  selector: 'wt2-angular',
  templateUrl: './angular.component.html',
  styleUrls: ['./angular.component.sass'],
  providers: [SessionService]
})
export class AngularComponent implements OnInit {

  public sessions: Session[] = [];

  constructor(protected sessionService: SessionService, protected authService: SessionAuthService) {
  }

  ngOnInit() {
    this.load();
    console.log(this.authService.username);
  }

  load(): void {
    this.sessionService.getAllSessions().subscribe(
      sessions => this.sessions = sessions,
      console.error
    );
  }

  logout(): void {
    console.log("loggin out");
    this.authService.logout();
  }
}

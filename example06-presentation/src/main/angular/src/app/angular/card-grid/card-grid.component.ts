import { Component, Input } from '@angular/core';
import { Session } from '../../session';
import { SessionService } from '../session.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SportType } from 'src/app/sportType';
import { User } from '../../user';
import { SessionAuthService } from 'src/app/session-auth.service';

@Component({
  selector: 'wt2-card-grid',
  templateUrl: './card-grid.component.html',
  styleUrls: ['./card-grid.component.sass']
})

export class CardGridComponent {

  public errorMessage: string = "";
  public sportTypes: SportType[] = [];

  constructor(private modalService: NgbModal, private sessionService: SessionService, private authService: SessionAuthService) {
   }

  @Input()
  public sessions: Session[];

  openModal(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }

  closePopOver(close: Boolean) {
    if (close) {
      this.modalService.dismissAll();
    }

    setTimeout(() => {
      this.sessionService.getAllSessions().subscribe(
        sessions => this.sessions = sessions,
        () => this.errorMessage = 'Fehler beim Laden der Sporteinheiten'
      );
    },
    300);

  }

  public addUserToTrainingSession(session: Session): void {
    this.sessionService.subscribeSession(session.id).subscribe(
      sessions => this.sessions = sessions,
      () => this.errorMessage = 'Fehler beim Anmelden zu der Sporteinheit'
    );
  }

  public removeUserFromTrainingSession(session: Session): void {
    this.sessionService.unsubscribeSession(session.id).subscribe(
      sessions => this.sessions = sessions,
      () => this.errorMessage = 'Fehler beim Abmelden von der Sporteinheit'
    );
  }

  checkAttendance(attendees: User[]): boolean {
    let found = false;
    attendees.forEach(attendee => {
      // console.log("checking for: "+attendee.username+"==="+this.authService.username);
      if(attendee.username === this.authService.username) {
        found = true;
      }
    });
    return found;
  }

  checkEditable(session: Session): Boolean {
    return this.authService.isAdmin || (this.authService.username == session.creator.username);
  }
}

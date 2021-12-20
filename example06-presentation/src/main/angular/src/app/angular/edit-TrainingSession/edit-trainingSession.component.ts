import { Component, EventEmitter, Output, Input } from '@angular/core';
import { SessionService } from '../session.service';
import { Session } from '../../session';
import { SportType } from '../../sportType';
import { SportTypeService } from '../sportType.service';

@Component({
  selector: 'wt2-edit-trainingSession',
  templateUrl: './edit-trainingSession.component.html',
  styleUrls: ['./edit-trainingSession.component.sass']
})
export class EditTrainingSessionComponent {

  @Output()
  public created = new EventEmitter();

  @Output()
  close = new EventEmitter<boolean>();

  @Input('inputSession')
  public inputSession: Session;
  public session: Session;
  
  public sportTypes: SportType[] = [];
  public currentSportType: string;
  public appointmentDate: string;
  public initialDate: Date;
  public errorMessage: string = "";


  constructor(private sessionService: SessionService, private sportTypeService: SportTypeService) {
    this.sportTypeService.getAllSportTypes().subscribe(
      sportTypes => this.sportTypes = sportTypes,
      console.error
    );
  }

  ngOnInit() {
    this.session = new Session();
    this.session.id = this.inputSession.id;
    this.session.creator = this.inputSession.creator;
    this.session.name = this.inputSession.name;
    this.session.description = this.inputSession.description;
    this.session.appointment = new Date(this.inputSession.appointment);
    this.session.appointment.setHours(this.session.appointment.getHours() + 2);
    this.session.duration = this.inputSession.duration;
    this.session.typeOfSport = this.inputSession.typeOfSport;
    this.session.private = this.inputSession.private;

    this.appointmentDate = this.session.appointment.toISOString().slice(0,16);
    this.initialDate = new Date(this.session.appointment);
    this.currentSportType = this.session.typeOfSport.name;
  }

  public editTrainingSession(e: Event): void {
    e.preventDefault();
    this.errorMessage = "";

    let appDate = new Date(this.appointmentDate);
    appDate.setHours(appDate.getHours() + 2);

    if (this.validation()) {
      let sportType = this.sportTypes.filter(x => this.currentSportType == x.name);
      this.sessionService.editSession(
        this.session.id, this.session.name, this.session.description, sportType[0], this.session.duration, appDate, this.session.private)
        .subscribe(() => {
          this.created.emit();
          // this.onClose();
        },
        () => this.errorMessage = 'Fehler beim Editieren der Sporteinheit'
        );
    }

    if (this.errorMessage == "") this.onClose();
  }

  public deleteTrainingSession(e: Event): void {
    e.preventDefault();
    this.errorMessage = "";

    this.sessionService.deleteSession(this.session.id).subscribe(() => {
        this.created.emit();
        // this.onClose();
    },
    () => this.errorMessage = 'Fehler beim Löschen der Sporteinheit'
    );

    if (this.errorMessage == "") this.onClose();
  }

  getCharsLeft(): number {
    return 255 - this.session.description.length;
  }

  validation(): Boolean {
    let success = true;

    let appDate = new Date(this.appointmentDate);
    appDate.setHours(appDate.getHours() + 2);

    let currentDate = new Date(new Date().toLocaleString('en-US', {
      timeZone: 'Europe/Vienna'
    }));

    if(this.session.name.trim() == "")
    {
      success = false;
      this.errorMessage = "Es wurde kein gültiger Name angegeben.\n";
    }
    if(this.currentSportType == null)
    {
      success = false;
      this.errorMessage = this.errorMessage + "Es wurde keine gültige Sportart angegeben.\n";
    }
    if(this.session.duration == undefined || this.session.duration < 1)
    {
      success = false;
      this.errorMessage = this.errorMessage + "Es wurde keine Dauer angegeben.\n";
    }
    if(this.appointmentDate == undefined)
    {
      success = false;
      this.errorMessage = this.errorMessage + "Es wurde kein Daturm ausgewählt.\n";
    }
    else
    {
      if(currentDate.toISOString().slice(0,16) < this.initialDate.toISOString().slice(0,16) && appDate.toISOString().slice(0,16) < currentDate.toISOString().slice(0,16))
      {
        success = false;
        this.errorMessage = this.errorMessage + "Eine Trainingseinheit, die in der Zukunft liegt, kann nicht in die Vergangenheit gesetzt werden.\n";
      }
      if(currentDate.toISOString().slice(0,16) > this.initialDate.toISOString().slice(0,16) && appDate.toISOString().slice(0,16) > currentDate.toISOString().slice(0,16))
      {
        success = false;
        this.errorMessage = this.errorMessage + "Eine bereits vergangene Trainingseinheit kann nicht in die Zukunft gesetzt werden.\n";
      }
    }
    if(this.session.private == undefined || this.session.private == null)
    {
      success = false;
      this.errorMessage = this.errorMessage + "Es wurde kein Sichtbarkeitsgrad angegeben.\n";
    }

    if(!success)
      this.errorMessage = "Folgende Eingaben sind fehlerhaft:\n" + this.errorMessage;
    
    return success;
  }

  onClose() {
    this.close.emit(true)
  }

  debugTest(value : string): void{
    console.log(value);
  }

  debugTestInt(value : Number): void{
    console.log(value);
  }

  debugTestBool(value : Boolean): void{
    console.log(value.valueOf());
  }
}
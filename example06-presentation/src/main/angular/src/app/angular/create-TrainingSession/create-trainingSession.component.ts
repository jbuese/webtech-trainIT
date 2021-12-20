import { Component, EventEmitter, Output } from '@angular/core';
import { SessionService } from '../session.service';
import { SportType } from '../../sportType';
import { SportTypeService } from '../sportType.service';

@Component({
  selector: 'wt2-create-trainingSession',
  templateUrl: 'create-trainingSession.component.html',
  styleUrls: ['./create-trainingSession.component.sass']
})
export class CreateTrainingSessionComponent {

  @Output()
  public created = new EventEmitter();

  public name: string = "";
  public description: string = "";
  public selectedTypeOfSport: SportType;
  public duration: Number;
  public appointment: string;
  public private: Boolean;
  
  public sportTypes: SportType[] = [];
  public errorMessage: string = "";
  public notEditable: Boolean;

  constructor(private sessionService: SessionService, private sportTypeService: SportTypeService) { 
    this.sportTypeService.getAllSportTypes().subscribe(
      sportTypes => this.sportTypes = sportTypes,
      console.error
    )
  }

  public createTrainingSession(e: Event): void {
    e.preventDefault();
    this.errorMessage = "";

    let appDate = new Date(this.appointment);
    appDate.setHours(appDate.getHours() + 2);

    if (this.validation()) {
      this.sessionService.createSession(
        this.name, this.description, this.selectedTypeOfSport, this.duration, appDate, this.private)
        .subscribe(() => {
          this.created.emit();
          this.name = "";
          this.description = "";
          this.selectedTypeOfSport = undefined;
          this.duration = undefined;
          this.appointment = undefined;
          this.private = undefined;
        },
        () => this.errorMessage = 'Fehler beim Erzeugen der Sporteinheit'
      );
    }
  }

  getCharsLeft(): number {
    return 255 - this.description.length;
  }

  validation(): Boolean {
    let success = true;

    var currentTime = new Date(new Date().toLocaleString('en-US', {
      timeZone: 'Europe/Vienna'
    }));

    if(this.name.trim() == "")
    {
      success = false;
      this.errorMessage = "Es wurde kein gültiger Name angegeben.\n";
    }
    if(this.selectedTypeOfSport == null)
    {
      success = false;
      this.errorMessage = this.errorMessage + "Es wurde keine gültige Sportart angegeben.\n";
    }
    if(this.duration == undefined || this.duration < 1)
    {
      success = false;
      this.errorMessage = this.errorMessage + "Es wurde keine Dauer angegeben.\n";
    }
    if(this.appointment == undefined || new Date(this.appointment) <= currentTime)
    {
      success = false;
      this.errorMessage = this.errorMessage + "Es wurde kein Termin oder ein Termin in der Vergangenheit angegeben.\n";
    }
    if(this.private == undefined || this.private == null)
    {
      success = false;
      this.errorMessage = this.errorMessage + "Es wurde kein Sichtbarkeitsgrad angegeben.\n";
    }

    if(!success)
      this.errorMessage = "Folgende Eingaben sind fehlerhaft:\n" + this.errorMessage;
    
    return success;
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

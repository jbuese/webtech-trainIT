import { Component, EventEmitter, Output } from '@angular/core';
import { SportTypeService } from 'src/app/angular/sportType.service';

@Component({
  selector: 'wt2-create-sportType',
  templateUrl: './create-sportType.component.html',
  styleUrls: ['./create-sportType.component.sass'],
})
export class CreateSportTypeComponent {

  @Output()
  public created = new EventEmitter();

  public name: string = "";
  public description: string  = "";
  public indoor: boolean;
  public teamsport: boolean;

  public errorMessage: string= "";
  public notEditable: boolean;

  constructor(private sportTypeService: SportTypeService) {
   }

  public createSportType(e: Event): void {
    e.preventDefault();
    this.errorMessage = "";

    if (this.validation()) {
      this.sportTypeService.createSportType(this.name, this.description, this.indoor, this.teamsport)
      .subscribe(() => {
          this.created.emit();
          this.name = "";
          this.description = "";
          this.indoor = undefined;
          this.teamsport = undefined;
        },
        () => this.errorMessage = 'Fehler beim Erstellen der Sportart. Womöglich exisitert bereits eine Sportart unter diesem Namen.'
      );
    }
  }

  getCharsLeft(): number {
    return 255 - this.description.length;
  }

  validation(): Boolean {
    let success = true;

    if(this.name.trim() == "")
    {
      success = false;
      this.errorMessage = "Es wurde kein gültiger Name angegeben.\n";
    }
    if(this.description.trim() == "")
    {
      success = false;
      this.errorMessage = this.errorMessage + "Es wurde keine gültige Beschreibung angegeben.\n";
    }
    if(this.indoor == undefined || this.indoor == null)
    {
      success = false;
      this.errorMessage = this.errorMessage + "Es wurde kein Ort für die Sportart ausgewählt.\n";
    }
    if(this.teamsport == undefined || this.teamsport == null)
    {
      success = false;
      this.errorMessage = this.errorMessage + "Es wurde nicht angegeben, ob es sich um eine Einzel- oder Teamsportart handelt.\n";
    }

    if(!success)
      this.errorMessage = "Folgende Eingaben sind fehlerhaft:\n" + this.errorMessage;
    
    return success;
  }

  debugTestBool(value : Boolean): void{
    console.log(value.valueOf());
  }
}

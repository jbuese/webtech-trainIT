import { Component } from '@angular/core';
import { SportTypeService } from '../angular/sportType.service';
import { SportType } from '../sportType';

@Component({
  selector: 'wt2-sportTypes',
  templateUrl: './sportTypes.component.html',
  styleUrls: ['./sportTypes.component.sass'],
})
export class SportTypesComponent {

  public sportTypes: SportType[] = [];

  constructor(protected sportTypeService: SportTypeService) {
  }

  ngOnInit() {
    this.load();
  }
  
  load(): void {
    this.sportTypeService.getAllSportTypes().subscribe(
      sportTypes => this.sportTypes = sportTypes,
      console.error
    );
  }
}

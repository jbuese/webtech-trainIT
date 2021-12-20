import { Component, Input } from '@angular/core';
import { SportType } from 'src/app/sportType';

@Component({
  selector: 'wt2-sportTypes-card',
  templateUrl: './sportTypes-card.component.html',
  styleUrls: ['./sportTypes-card.component.sass']
})
export class SportTypesCardComponent {

  @Input() sportType: SportType;

  public getIndoorString(type: boolean): String {
    return type ? "Indoor" : "Outdoor";
  }

  public getTeamsportString(type: boolean): String {
    return type ? "Teamsportart" : "Einzelsportart";
  }
}

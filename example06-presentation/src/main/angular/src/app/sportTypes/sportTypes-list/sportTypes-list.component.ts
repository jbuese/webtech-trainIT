import { Component, Input } from '@angular/core';
import { SportType } from 'src/app/sportType';

@Component({
  selector: 'wt2-sportTypes-list',
  templateUrl: './sportTypes-list.component.html',
  styleUrls: ['./sportTypes-list.component.sass']
})
export class SportTypesListComponent {

  @Input()
  public sportTypes: SportType[] = [];

}

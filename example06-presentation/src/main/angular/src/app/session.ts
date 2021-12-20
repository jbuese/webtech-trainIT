import { SportType } from './sportType';
import { User } from './user';

export class Session {
  id: Number;
  appointment: Date;
  name: string;
  description: string;
  duration: number;
  private: boolean;
  typeOfSport: SportType;
  creator: User;
  attendees: User[];

  static fromObject(object: any): Session {
    const s = new Session();
    s.id = object.id;
    s.appointment = new Date(object.appointment);
    s.name = object.name;
    s.description = object.description;
    s.duration = object.duration;
    s.private = object.privat;
    s.typeOfSport = SportType.fromObject(object.typeOfSport);
    s.creator = User.fromObject(object.creator);
    s.attendees = object.attendees.map(body => User.fromObject(body));
    return s;
  }
}

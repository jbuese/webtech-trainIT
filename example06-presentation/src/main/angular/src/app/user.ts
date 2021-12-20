export class User {
  username: string;
  password: string;

  static fromObject(object: any): User {
    const u = new User();
    u.username = object.userName;
    u.password = object.password;
    return u;
  }
}

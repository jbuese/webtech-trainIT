export class SportType {
  id: string;
  name: string;
  description: string;
  indoor: boolean;
  teamsport: boolean;

  static fromObject(object: any): SportType {
    const st = new SportType();
    st.id = object.id;
    st.name = object.name;
    st.description = object.description;
    st.indoor = object.indoor;
    st.teamsport = object.teamsport;
    return st;
  }
}

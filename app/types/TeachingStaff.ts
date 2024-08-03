import Department from "./Department";
import Title from "./Title";

export default interface TeachingStaff {
  id: number;
  name: string;
  surname: string;
  email: string;
  birthDate: string;
  department: Department;
  title: Title;
}

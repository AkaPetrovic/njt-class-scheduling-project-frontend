import AcademicYear from "@/app/types/AcademicYear";
import Subject from "@/app/types/Subject";
import TeachingStaff from "@/app/types/TeachingStaff";
import ClassCoveragePlanAddNewForm from "./ClassCoveragePlanAddNewForm";
import { cookies } from "next/headers";

const AddNewClassCoveragePlanPage = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  const resTeachingStaff = await fetch(
    `http://localhost:8080/api/teaching-staff`,
    {
      cache: "no-store",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );
  const teachingStaff: TeachingStaff[] = await resTeachingStaff.json();

  const resSubjects = await fetch(`http://localhost:8080/api/subjects`, {
    cache: "no-store",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  const subjects: Subject[] = await resSubjects.json();

  const resAcademicYears = await fetch(
    `http://localhost:8080/api/academic-years`,
    {
      cache: "no-store",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );
  const academicYears: AcademicYear[] = await resAcademicYears.json();

  return (
    <main className="flex flex-col justify-center items-center relative h-full w-full">
      <div>
        <h1>Add new class coverage plan</h1>
        <ClassCoveragePlanAddNewForm
          teachingStaff={teachingStaff}
          subjects={subjects}
          academicYears={academicYears}
        />
      </div>
    </main>
  );
};

export default AddNewClassCoveragePlanPage;

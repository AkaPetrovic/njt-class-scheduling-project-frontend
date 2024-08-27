import { cookies } from "next/headers";
import ClassCoveragePlanSelectionForm from "./ClassCoveragePlanSelectionForm";
import Subject from "../types/Subject";
import AcademicYear from "../types/AcademicYear";

const ClassCoveragePlansPage = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

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
    <main className="flex justify-center items-center w-full h-full">
      <ClassCoveragePlanSelectionForm
        subjects={subjects}
        academicYears={academicYears}
      />
    </main>
  );
};

export default ClassCoveragePlansPage;

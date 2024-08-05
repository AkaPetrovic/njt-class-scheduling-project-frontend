import AcademicYear from "@/app/types/AcademicYear";
import Subject from "@/app/types/Subject";
import TeachingStaff from "@/app/types/TeachingStaff";
import ClassCoveragePlanAddNewForm from "./ClassCoveragePlanAddNewForm";

const AddNewClassCoveragePlanPage = async () => {
  const resTeachingStaff = await fetch(
    `http://localhost:8080/api/teaching-staff`,
    {
      cache: "no-store",
    }
  );
  const teachingStaff: TeachingStaff[] = await resTeachingStaff.json();

  const resSubjects = await fetch(`http://localhost:8080/api/subjects`, {
    cache: "no-store",
  });
  const subjects: Subject[] = await resSubjects.json();

  const resAcademicYears = await fetch(
    `http://localhost:8080/api/academic-years`,
    {
      cache: "no-store",
    }
  );
  const academicYears: AcademicYear[] = await resAcademicYears.json();

  return (
    <main className="flex flex-col items-center h-full w-full">
      <div className="relative top-36 w-1/2">
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

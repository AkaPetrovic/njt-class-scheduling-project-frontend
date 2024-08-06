import AcademicYear from "@/app/types/AcademicYear";
import Subject from "@/app/types/Subject";
import TeachingStaff from "@/app/types/TeachingStaff";
import ClassCoveragePlanAddNewForm from "./ClassCoveragePlanAddNewForm";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import Link from "next/link";

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
    <main className="flex flex-col justify-center items-center relative h-full w-full">
      <Link
        href="/class-coverage-plans"
        className="btn btn-ghost rounded-full absolute top-4 left-6 p-3"
      >
        <ArrowBackIosNewRoundedIcon />
      </Link>
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

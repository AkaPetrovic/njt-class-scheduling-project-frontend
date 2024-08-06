// "use client";
import ClassCoveragePlan from "@/app/types/ClassCoveragePlan";
import TeachingStaff from "@/app/types/TeachingStaff";
import ClassCoveragePlanDetailsForm from "./ClassCoveragePlanDetailsForm";
import Subject from "@/app/types/Subject";
import AcademicYear from "@/app/types/AcademicYear";
import Link from "next/link";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

interface Props {
  params: {
    id: number;
  };
}

const ClassCoveragePlanDetailsPage = async ({ params: { id } }: Props) => {
  const resClassCoveragePlan = await fetch(
    `http://localhost:8080/api/class-coverage-plans/${id}`,
    {
      cache: "no-store",
    }
  );
  const classCoveragePlan: ClassCoveragePlan =
    await resClassCoveragePlan.json();

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
    <main className="flex flex-col justify-center items-center h-full w-full">
      <Link
        href="/class-coverage-plans"
        className="btn btn-ghost rounded-full absolute top-4 left-6 p-3"
      >
        <ArrowBackIosNewRoundedIcon />
      </Link>
      <div>
        <h1>[{id}] Class coverage plan</h1>
        <ClassCoveragePlanDetailsForm
          classCoveragePlan={classCoveragePlan}
          teachingStaff={teachingStaff}
          subjects={subjects}
          academicYears={academicYears}
        />
      </div>
    </main>
  );
};

export default ClassCoveragePlanDetailsPage;

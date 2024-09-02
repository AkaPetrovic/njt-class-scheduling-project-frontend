import AcademicYear from "@/app/types/AcademicYear";
import Subject from "@/app/types/Subject";
import TeachingStaff from "@/app/types/TeachingStaff";
import ClassCoveragePlanAddNewForm from "./ClassCoveragePlanAddNewForm";
import { cookies } from "next/headers";
import AcademicYearSubject from "@/app/types/AcademicYearSubject";
import ClassCoveragePlan from "@/app/types/ClassCoveragePlan";
import { calculateUnassignedClasses } from "@/app/utility/class-coverage-util";

interface Props {
  params: {
    academicYearName: string;
    subjectName: string;
  };
}

const AddNewClassCoveragePlanPage = async ({
  params: { academicYearName, subjectName },
}: Props) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  const resAcademicYearSubject = await fetch(
    `http://localhost:8080/api/academic-year-subject/${academicYearName}/${subjectName}`,
    {
      cache: "no-store",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );

  //Render an appropriate message if no AcademicYearSubject has been found
  if (!resAcademicYearSubject.ok) {
    const errorMessage = await resAcademicYearSubject.text();
    return (
      <main className="flex flex-col justify-center items-center relative h-full w-full">
        <div className="text-neutral-400 font-normal">
          <h1>{errorMessage}</h1>
        </div>
      </main>
    );
  }

  const academicYearSubject: AcademicYearSubject =
    await resAcademicYearSubject.json();

  const resClassCoveragePlans = await fetch(
    `http://localhost:8080/api/class-coverage-plans/${academicYearName}/${subjectName}`,
    {
      cache: "no-store",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );
  const classCoveragePlans: ClassCoveragePlan[] =
    await resClassCoveragePlans.json();

  const resSubject = await fetch(
    `http://localhost:8080/api/subject/${subjectName}`,
    {
      cache: "no-store",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );
  const subject: Subject = await resSubject.json();

  const {
    unassignedLectureClasses,
    unassignedPracticalClasses,
    unassignedLabPracticalClasses,
  } = calculateUnassignedClasses(
    classCoveragePlans,
    academicYearSubject.numberOfStudentGroups,
    subject
  );

  const resAcademicYear = await fetch(
    `http://localhost:8080/api/academic-year/${academicYearName}`,
    {
      cache: "no-store",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );
  const academicYear: AcademicYear = await resAcademicYear.json();

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

  const associatedTeachingStaffIds = classCoveragePlans.map(
    (plan) => plan.teachingStaff.id
  );

  const availableTeachingStaff = teachingStaff.filter(
    (staff) => !associatedTeachingStaffIds.includes(staff.id)
  );

  return (
    <main className="flex flex-col justify-center items-center relative h-full w-full">
      <div>
        <ClassCoveragePlanAddNewForm
          availableTeachingStaff={availableTeachingStaff}
          subject={subject}
          academicYear={academicYear}
          unassignedLectureClasses={unassignedLectureClasses}
          unassignedPracticalClasses={unassignedPracticalClasses}
          unassignedLabPracticalClasses={unassignedLabPracticalClasses}
        />
      </div>
    </main>
  );
};

export default AddNewClassCoveragePlanPage;

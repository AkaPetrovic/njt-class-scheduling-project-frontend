import AcademicYearSubject from "@/app/types/AcademicYearSubject";
import ClassCoveragePlan from "@/app/types/ClassCoveragePlan";
import Subject from "@/app/types/Subject";
import { decodeToken } from "@/app/utility/auth";
import { cookies } from "next/headers";
import Link from "next/link";
import CoverageStatus from "./CoverageStatus";
import AddNewButton from "./AddNewButton";
import TeachingStaff from "@/app/types/TeachingStaff";
import {
  calculateAssignedClasses,
  calculateUnassignedClasses,
} from "@/app/utility/class-coverage-util";

interface Props {
  params: {
    academicYearName: string;
    subjectName: string;
  };
}

const ClassCoveragePlansByAcademicYearAndBySubjectPage = async ({
  params: { academicYearName, subjectName },
}: Props) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const decodedToken = decodeToken(token);
  const role = decodedToken && decodedToken.role ? decodedToken.role : null;

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
      <main className="flex justify-center items-center relative w-full h-full">
        <div className="w-3/5 text-center text-neutral-400 font-normal">
          <h1>{errorMessage}</h1>
        </div>
      </main>
    );
  }

  const academicYearSubject: AcademicYearSubject =
    await resAcademicYearSubject.json();

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

  if (classCoveragePlans.length === 0) {
    return (
      <main className="flex justify-center items-center relative w-full h-full">
        <div className="w-3/5 text-center text-neutral-400 font-normal">
          <h1>
            There have been no assignments for subject {subject.name} in the
            academic year {academicYearSubject.academicYear.name}
          </h1>
          {role === "ADMIN" ? (
            <AddNewButton
              path={`/class-coverage-plans/${academicYearName}/${subjectName}/new`}
              completionStatus={false}
              forceEnable={true}
            />
          ) : null}
        </div>
      </main>
    );
  }

  const {
    unassignedLectureClasses,
    unassignedPracticalClasses,
    unassignedLabPracticalClasses,
  } = calculateUnassignedClasses(
    classCoveragePlans,
    academicYearSubject.numberOfStudentGroups,
    subject
  );

  const {
    assignedLectureClasses,
    assignedPracticalClasses,
    assignedLabPracticalClasses,
  } = calculateAssignedClasses(classCoveragePlans);

  const completionStatus =
    unassignedLectureClasses === 0 &&
    unassignedPracticalClasses === 0 &&
    unassignedLabPracticalClasses === 0;

  return (
    <main className="flex justify-center items-center relative w-full h-full">
      <div className="w-3/5">
        <h1>
          Class coverage plan for the academic year{" "}
          {academicYearSubject.academicYear.name}
        </h1>
        <h2 className="mb-5">Subject: {subject.name}</h2>

        <CoverageStatus
          assignedLectureClasses={assignedLectureClasses}
          assignedPracticalClasses={assignedPracticalClasses}
          assignedLabPracticalClasses={assignedLabPracticalClasses}
          unassignedLectureClasses={unassignedLectureClasses}
          unassignedPracticalClasses={unassignedPracticalClasses}
          unassignedLabPracticalClasses={unassignedLabPracticalClasses}
          completionStatus={completionStatus}
        />

        <table className="table table-lg">
          <thead>
            <tr className="border-b border-base-300 text-base">
              <th>ID</th>
              <th>Amount - Lecture Classes</th>
              <th>Amount - Practical Classes</th>
              <th>Amount - Lab Classes</th>
              <th>Teaching Staff</th>
            </tr>
          </thead>
          <tbody className="[&_tr:not(:last-child)]:border-b [&_tr:not(:last-child)]:border-base-300">
            {classCoveragePlans.map((classCoveragePlan: ClassCoveragePlan) => (
              <tr
                className={`hover:bg-base-200 transition-colors duration-300 ${
                  role === "ADMIN" ? "[&_td]:p-0" : ""
                }`}
                key={classCoveragePlan.id}
              >
                <td>
                  {role === "ADMIN" ? (
                    <Link
                      className="block px-6 py-4"
                      href={`/class-coverage-plans/${academicYearName}/${subjectName}/${classCoveragePlan.id}`}
                    >
                      {classCoveragePlan.id}
                    </Link>
                  ) : (
                    classCoveragePlan.id
                  )}
                </td>
                <td>
                  {role === "ADMIN" ? (
                    <Link
                      className="block px-6 py-4"
                      href={`/class-coverage-plans/${academicYearName}/${subjectName}/${classCoveragePlan.id}`}
                    >
                      {classCoveragePlan.amountOfLectureClassesPerTeachingStaff}
                    </Link>
                  ) : (
                    classCoveragePlan.amountOfLectureClassesPerTeachingStaff
                  )}
                </td>
                <td>
                  {role === "ADMIN" ? (
                    <Link
                      className="block px-6 py-4"
                      href={`/class-coverage-plans/${academicYearName}/${subjectName}/${classCoveragePlan.id}`}
                    >
                      {
                        classCoveragePlan.amountOfPracticalClassesPerTeachingStaff
                      }
                    </Link>
                  ) : (
                    classCoveragePlan.amountOfPracticalClassesPerTeachingStaff
                  )}
                </td>
                <td>
                  {role === "ADMIN" ? (
                    <Link
                      className="block px-6 py-4"
                      href={`/class-coverage-plans/${academicYearName}/${subjectName}/${classCoveragePlan.id}`}
                    >
                      {
                        classCoveragePlan.amountOfLabPracticalClassesPerTeachingStaff
                      }
                    </Link>
                  ) : (
                    classCoveragePlan.amountOfLabPracticalClassesPerTeachingStaff
                  )}
                </td>
                <td>
                  {role === "ADMIN" ? (
                    <Link
                      className="block px-6 py-4"
                      href={`/class-coverage-plans/${academicYearName}/${subjectName}/${classCoveragePlan.id}`}
                    >
                      {classCoveragePlan.teachingStaff.name +
                        " " +
                        classCoveragePlan.teachingStaff.surname +
                        " (" +
                        classCoveragePlan.teachingStaff.title.title +
                        ")"}
                    </Link>
                  ) : (
                    classCoveragePlan.teachingStaff.name +
                    " " +
                    classCoveragePlan.teachingStaff.surname +
                    " (" +
                    classCoveragePlan.teachingStaff.title.title +
                    ")"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {role === "ADMIN" ? (
          <AddNewButton
            path={`/class-coverage-plans/${academicYearName}/${subjectName}/new`}
            completionStatus={completionStatus}
            availableTeachingStaff={availableTeachingStaff}
          />
        ) : null}
      </div>
    </main>
  );
};

export default ClassCoveragePlansByAcademicYearAndBySubjectPage;

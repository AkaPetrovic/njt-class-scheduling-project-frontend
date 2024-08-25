import Link from "next/link";
import ClassCoveragePlan from "../types/ClassCoveragePlan";
import { cookies } from "next/headers";
import { decodeToken } from "../utility/auth";

const ClassCoveragePlansPage = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const decodedToken = decodeToken(token);
  const role = decodedToken && decodedToken.role ? decodedToken.role : null;

  const res = await fetch("http://localhost:8080/api/class-coverage-plans", {
    cache: "no-store",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  const classCoveragePlans: ClassCoveragePlan[] = await res.json();

  return (
    <main className="flex justify-center items-center relative w-full h-full">
      <div className="w-3/5">
        <h1 className="mb-5">Class coverage plans</h1>
        <table className="table table-lg">
          <thead>
            <tr className="border-b border-base-300 text-base">
              <th>ID</th>
              <th>Amount - Lecture Classes</th>
              <th>Amount - Practical Classes</th>
              <th>Amount - Lab Classes</th>
              <th>Teaching Staff</th>
              <th>Subject</th>
              <th>Academic Year</th>
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
                      href={`/class-coverage-plans/${classCoveragePlan.id}`}
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
                      href={`/class-coverage-plans/${classCoveragePlan.id}`}
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
                      href={`/class-coverage-plans/${classCoveragePlan.id}`}
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
                      href={`/class-coverage-plans/${classCoveragePlan.id}`}
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
                      href={`/class-coverage-plans/${classCoveragePlan.id}`}
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
                <td>
                  {role === "ADMIN" ? (
                    <Link
                      className="block px-6 py-4"
                      href={`/class-coverage-plans/${classCoveragePlan.id}`}
                    >
                      {classCoveragePlan.subject.name}
                    </Link>
                  ) : (
                    classCoveragePlan.subject.name
                  )}
                </td>
                <td>
                  {role === "ADMIN" ? (
                    <Link
                      className="block px-6 py-4"
                      href={`/class-coverage-plans/${classCoveragePlan.id}`}
                    >
                      {classCoveragePlan.academicYear.name}
                    </Link>
                  ) : (
                    classCoveragePlan.academicYear.name
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {role === "ADMIN" ? (
          <Link
            className="btn btn-neutral mt-5"
            href="/class-coverage-plans/new"
          >
            Add new
          </Link>
        ) : null}
      </div>
    </main>
  );
};

export default ClassCoveragePlansPage;

import Link from "next/link";
import ClassCoveragePlan from "../types/ClassCoveragePlan";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

const ClassCoveragePlansPage = async () => {
  const res = await fetch("http://localhost:8080/api/class-coverage-plans", {
    cache: "no-store",
  });
  const classCoveragePlans: ClassCoveragePlan[] = await res.json();

  return (
    <main className="flex justify-center items-center relative w-full h-full">
      <Link
        href="/"
        className="btn btn-ghost rounded-full absolute top-4 left-6 p-3"
      >
        <ArrowBackIosNewRoundedIcon />
      </Link>
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
                className="hover:bg-base-200 transition-colors duration-300 [&_td]:p-0"
                key={classCoveragePlan.id}
              >
                <td>
                  <Link
                    className="block px-6 py-4"
                    href={`/class-coverage-plans/${classCoveragePlan.id}`}
                  >
                    {classCoveragePlan.id}
                  </Link>
                </td>
                <td>
                  <Link
                    className="block px-6 py-4"
                    href={`/class-coverage-plans/${classCoveragePlan.id}`}
                  >
                    {classCoveragePlan.amountOfLectureClassesPerTeachingStaff}
                  </Link>
                </td>
                <td>
                  <Link
                    className="block px-6 py-4"
                    href={`/class-coverage-plans/${classCoveragePlan.id}`}
                  >
                    {classCoveragePlan.amountOfPracticalClassesPerTeachingStaff}
                  </Link>
                </td>
                <td>
                  <Link
                    className="block px-6 py-4"
                    href={`/class-coverage-plans/${classCoveragePlan.id}`}
                  >
                    {
                      classCoveragePlan.amountOfLabPracticalClassesPerTeachingStaff
                    }
                  </Link>
                </td>
                <td>
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
                </td>
                <td>
                  <Link
                    className="block px-6 py-4"
                    href={`/class-coverage-plans/${classCoveragePlan.id}`}
                  >
                    {classCoveragePlan.subject.name}
                  </Link>
                </td>
                <td>
                  <Link
                    className="block px-6 py-4"
                    href={`/class-coverage-plans/${classCoveragePlan.id}`}
                  >
                    {classCoveragePlan.academicYear.name}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link className="btn btn-neutral mt-5" href="/class-coverage-plans/new">
          Add new
        </Link>
      </div>
    </main>
  );
};

export default ClassCoveragePlansPage;

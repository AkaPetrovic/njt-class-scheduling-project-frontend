import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import Link from "next/link";
import TeachingStaff from "../types/TeachingStaff";

const TeachingStaffPage = async () => {
  const res = await fetch("http://localhost:8080/api/teaching-staff", {
    cache: "no-store",
  });
  const teachingStaff: TeachingStaff[] = await res.json();

  return (
    <main className="flex justify-center items-center relative w-full h-full">
      <Link
        href="/"
        className="btn btn-ghost rounded-full absolute top-4 left-6 p-3"
      >
        <ArrowBackIosNewRoundedIcon />
      </Link>
      <div className="w-3/5">
        <h1 className="mb-5">Teaching staff</h1>
        <table className="table table-lg">
          <thead>
            <tr className="border-b border-base-300 text-base">
              <th>ID</th>
              <th>Name</th>
              <th>Surname</th>
              <th>Email</th>
              <th>Birth date</th>
              <th>Department</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody className="[&_tr:not(:last-child)]:border-b [&_tr:not(:last-child)]:border-base-300">
            {teachingStaff.map((staff: TeachingStaff) => (
              <tr
                className="hover:bg-base-200 transition-colors duration-300"
                key={staff.id}
              >
                <td>{staff.id}</td>
                <td>{staff.name}</td>
                <td>{staff.surname}</td>
                <td>{staff.email}</td>
                <td>{staff.birthDate}</td>
                <td>{staff.department.name}</td>
                <td>{staff.title.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default TeachingStaffPage;

import Link from "next/link";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import Subject from "../types/Subject";
import { cookies } from "next/headers";

const SubjectsPage = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch("http://localhost:8080/api/subjects", {
    cache: "no-store",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  const subjects: Subject[] = await res.json();

  return (
    <main className="flex justify-center items-center relative w-full h-full">
      <Link
        href="/"
        className="btn btn-ghost rounded-full absolute top-4 left-6 p-3"
      >
        <ArrowBackIosNewRoundedIcon />
      </Link>
      <div className="w-3/5">
        <h1 className="mb-5">Subjects</h1>
        <table className="table table-lg">
          <thead>
            <tr className="border-b border-base-300 text-base">
              <th>ID</th>
              <th>Name</th>
              <th>ESPB</th>
            </tr>
          </thead>
          <tbody className="[&_tr:not(:last-child)]:border-b [&_tr:not(:last-child)]:border-base-300">
            {subjects.map((subject: Subject) => (
              <tr
                className="hover:bg-base-200 transition-colors duration-300"
                key={subject.id}
              >
                <td>{subject.id}</td>
                <td>{subject.name}</td>
                <td>{subject.espb}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default SubjectsPage;

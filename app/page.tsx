import Link from "next/link";

const HomePage = () => {
  return (
    <main className="h-full flex flex-col justify-center items-center">
      <div className="flex flex-col w-1/6 relative top-[-70px] opacity-0 animate-fadeIn">
        <h1 className="m-3.5">Main menu</h1>
        <ul className="menu bg-base-300 rounded-box p-0 overflow-hidden text-lg">
          <li className="rounded-none hover:rounded-none">
            <Link href="/class-coverage-plans">Class coverage plans</Link>
          </li>
          <li className="rounded-none hover:rounded-none">
            <Link href="/teaching-staff">Teaching staff</Link>
          </li>
          <li className="rounded-none hover:rounded-none">
            <Link href="/subjects">Subjects</Link>
          </li>
        </ul>
      </div>
    </main>
  );
};

export default HomePage;

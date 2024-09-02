"use client";
import Link from "next/link";
import Subject from "../types/Subject";
import AcademicYear from "../types/AcademicYear";
import { useEffect, useState } from "react";

interface Props {
  subjects: Subject[];
  academicYears: AcademicYear[];
}

const ClassCoveragePlanSelectionForm = ({ subjects, academicYears }: Props) => {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(
    academicYears[0]
  );

  const handleAcademicYearSelectionChange = (academicYearId: number) => {
    const academicYearById = academicYears.find(
      (academicYear) => academicYear.id === academicYearId
    );

    if (academicYearById !== undefined) {
      setSelectedAcademicYear(academicYearById);
    }
  };
  const handleSubjectSelectionChange = (subjectId: number) => {
    const subjectById = subjects.find((subject) => subject.id === subjectId);

    if (subjectById !== undefined) {
      setSelectedSubject(subjectById);
    }
  };

  return (
    <div className="flex flex-col items-end w-1/4">
      <div className="carousel w-full text-lg">
        <div
          id="slide1"
          className="carousel-item w-full items-center justify-center relative py-3"
        >
          <div className="flex flex-col w-1/2">
            <label htmlFor="academicYear" className="mb-1">
              Please select the academic year:
            </label>
            <select
              id="academicYear"
              value={selectedAcademicYear.id}
              className="select select-bordered w-full max-w-xs"
              onChange={(e) =>
                handleAcademicYearSelectionChange(Number(e.target.value))
              }
            >
              {academicYears.map((academicYear) => (
                <option key={academicYear.id} value={academicYear.id}>
                  {academicYear.name}
                </option>
              ))}
            </select>
          </div>
          <div className="absolute right-5">
            <Link href="#slide2" className="btn btn-ghost btn-circle">
              ❯
            </Link>
          </div>
        </div>
        <div
          id="slide2"
          className="carousel-item w-full items-center justify-center relative py-3"
        >
          <div className="absolute left-5">
            <Link href="#slide1" className="btn btn-ghost btn-circle">
              ❮
            </Link>
          </div>
          <div className="flex flex-col w-1/2">
            <label htmlFor="classCoveragePlanSubject" className="mb-1">
              Please select the subject:
            </label>

            <select
              id="classCoveragePlanSubject"
              className="select select-bordered w-full max-w-xs"
              value={selectedSubject.id}
              onChange={(e) =>
                handleSubjectSelectionChange(Number(e.target.value))
              }
            >
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Link
        className="btn btn-neutral mt-5"
        href={`/class-coverage-plans/${selectedAcademicYear.name.replace(
          "/",
          "-"
        )}/${selectedSubject.name}`}
      >
        Confirm selection
      </Link>
    </div>
  );
};

export default ClassCoveragePlanSelectionForm;

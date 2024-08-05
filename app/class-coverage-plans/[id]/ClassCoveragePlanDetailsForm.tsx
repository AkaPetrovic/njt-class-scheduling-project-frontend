"use client";
import AcademicYear from "@/app/types/AcademicYear";
import ClassCoveragePlan from "@/app/types/ClassCoveragePlan";
import Subject from "@/app/types/Subject";
import TeachingStaff from "@/app/types/TeachingStaff";
import { useEffect, useState } from "react";

interface Props {
  classCoveragePlan: ClassCoveragePlan;
  teachingStaff: TeachingStaff[];
  subjects: Subject[];
  academicYears: AcademicYear[];
}

const ClassCoveragePlanDetailsForm = ({
  classCoveragePlan,
  teachingStaff,
  subjects,
  academicYears,
}: Props) => {
  const [classCoveragePlanData, setClassCoveragePlanData] =
    useState(classCoveragePlan);
  const [selectedTeachingStaffId, setSelectedTeachingStaffId] = useState(
    classCoveragePlan.teachingStaff.id
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState(
    classCoveragePlan.subject.id
  );
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState(
    classCoveragePlan.academicYear.id
  );
  const [editingMode, setEditingMode] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClassCoveragePlanData((prevData) => ({
      ...prevData,
      [name]: value ? Number(value) : 0,
    }));
  };

  //For handling teaching staff change
  useEffect(() => {
    const teachingStaffById = teachingStaff.find(
      (staff) => staff.id === selectedTeachingStaffId
    );

    //If a teaching staff has been found by the find() function
    if (teachingStaffById !== undefined) {
      setClassCoveragePlanData((prevData) => ({
        ...prevData,
        teachingStaff: teachingStaffById,
      }));
    }
  }, [selectedTeachingStaffId]);

  //For handling subject change
  useEffect(() => {
    const subjectById = subjects.find(
      (subject) => subject.id === selectedSubjectId
    );

    //If a subject has been found by the find() function
    if (subjectById !== undefined) {
      setClassCoveragePlanData((prevData) => ({
        ...prevData,
        subject: subjectById,
      }));
    }
  }, [selectedSubjectId]);

  //For handling academic year change
  useEffect(() => {
    const academicYearById = academicYears.find(
      (academicYear) => academicYear.id === selectedAcademicYearId
    );

    //If an academic year has been found by the find() function
    if (academicYearById !== undefined) {
      setClassCoveragePlanData((prevData) => ({
        ...prevData,
        academicYear: academicYearById,
      }));
    }
  }, [selectedAcademicYearId]);

  const handleSave = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/class-coverage-plans/edit",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(classCoveragePlanData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.text();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="mt-5">
        <button
          className="btn mr-2"
          onClick={() => {
            setEditingMode(!editingMode);
            setClassCoveragePlanData(classCoveragePlan);
            setSelectedAcademicYearId(classCoveragePlanData.academicYear.id);
            setSelectedSubjectId(classCoveragePlanData.subject.id);
            setSelectedTeachingStaffId(classCoveragePlanData.teachingStaff.id);
          }}
        >
          {editingMode ? "Cancel editing" : "Edit"}
        </button>
        <button className="btn mr-2" disabled={editingMode}>
          Delete
        </button>
        <button
          className="btn btn-neutral"
          disabled={
            JSON.stringify(classCoveragePlanData) ===
            JSON.stringify(classCoveragePlan)
          }
          onClick={handleSave}
        >
          Save
        </button>
      </div>
      <form className="mt-5">
        <div className="flex flex-col mb-3.5">
          <label htmlFor="classCoveragePlanId" className="mb-1">
            ID:
          </label>
          <input
            id="classCoveragePlanId"
            name="id"
            type="number"
            value={classCoveragePlanData.id}
            className="input input-bordered w-full max-w-20"
            disabled
          />
        </div>

        <div className="flex flex-col mb-3.5">
          <label
            htmlFor="amountOfLectureClassesPerTeachingStaff"
            className="mb-1"
          >
            Amount of lecture classes:
          </label>
          <input
            id="amountOfLectureClassesPerTeachingStaff"
            name="amountOfLectureClassesPerTeachingStaff"
            type="number"
            value={classCoveragePlanData.amountOfLectureClassesPerTeachingStaff}
            className="input input-bordered w-full max-w-20"
            onChange={handleInputChange}
            disabled={!editingMode}
          />
        </div>

        <div className="flex flex-col mb-3.5">
          <label
            htmlFor="amountOfPracticalClassesPerTeachingStaff"
            className="mb-1"
          >
            Amount of practical classes:
          </label>
          <input
            id="amountOfPracticalClassesPerTeachingStaff"
            name="amountOfPracticalClassesPerTeachingStaff"
            type="number"
            value={
              classCoveragePlanData.amountOfPracticalClassesPerTeachingStaff
            }
            className="input input-bordered w-full max-w-20"
            onChange={handleInputChange}
            disabled={!editingMode}
          />
        </div>

        <div className="flex flex-col mb-3.5">
          <label
            htmlFor="amountOfLabPracticalClassesPerTeachingStaff"
            className="mb-1"
          >
            Amount of lab classes:
          </label>
          <input
            id="amountOfLabPracticalClassesPerTeachingStaff"
            name="amountOfLabPracticalClassesPerTeachingStaff"
            type="number"
            value={
              classCoveragePlanData.amountOfLabPracticalClassesPerTeachingStaff
            }
            className="input input-bordered w-full max-w-20"
            onChange={handleInputChange}
            disabled={!editingMode}
          />
        </div>

        <div className="flex flex-col mb-3.5">
          <label htmlFor="classCoveragePlanTeachingStaff" className="mb-1">
            Teaching staff:
          </label>
          <select
            id="classCoveragePlanTeachingStaff"
            className="select select-bordered w-full max-w-xs"
            value={selectedTeachingStaffId}
            onChange={(e) => setSelectedTeachingStaffId(Number(e.target.value))}
            disabled={!editingMode}
          >
            {teachingStaff.map((staff) => (
              <option
                key={staff.id}
                value={staff.id}
              >{`${staff.name} ${staff.surname}`}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col mb-3.5">
          <label htmlFor="classCoveragePlanSubject" className="mb-1">
            Subject:
          </label>
          <select
            id="classCoveragePlanSubject"
            className="select select-bordered w-full max-w-xs"
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
            disabled={!editingMode}
          >
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col mb-3.5">
          <label htmlFor="classCoveragePlanAcademicYear" className="mb-1">
            Academic year:
          </label>
          <select
            id="classCoveragePlanAcademicYear"
            className="select select-bordered w-full max-w-xs"
            value={selectedAcademicYearId}
            onChange={(e) => setSelectedAcademicYearId(Number(e.target.value))}
            disabled={!editingMode}
          >
            {academicYears.map((academicYear) => (
              <option key={academicYear.id} value={academicYear.id}>
                {academicYear.name}
              </option>
            ))}
          </select>
        </div>
      </form>
    </>
  );
};

export default ClassCoveragePlanDetailsForm;

"use client";

import AcademicYear from "@/app/types/AcademicYear";
import ClassCoveragePlan from "@/app/types/ClassCoveragePlan";
import Subject from "@/app/types/Subject";
import TeachingStaff from "@/app/types/TeachingStaff";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Props {
  availableTeachingStaff: TeachingStaff[];
  subject: Subject;
  academicYear: AcademicYear;
  unassignedLectureClasses: number;
  unassignedPracticalClasses: number;
  unassignedLabPracticalClasses: number;
}

const ClassCoveragePlanAddNewForm = ({
  availableTeachingStaff,
  subject,
  academicYear,
  unassignedLectureClasses,
  unassignedPracticalClasses,
  unassignedLabPracticalClasses,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  //By default this would never happen, but in case someone manually visits this route
  //this prevents the error from happeneing and tells the user to return to the selection form
  if (availableTeachingStaff.length === 0) {
    return (
      <div className="text-neutral-400 font-normal">
        <h1>
          No teaching staff is available at the moment, please return to the
          selection page
        </h1>
      </div>
    );
  }

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [dialogModalMessage, setDialogModalMessage] = useState("");
  const [dialogModalMessageType, setDialogModalMessageType] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [classCoveragePlanData, setClassCoveragePlanData] =
    useState<ClassCoveragePlan>({
      amountOfLectureClassesPerTeachingStaff: 0,
      amountOfPracticalClassesPerTeachingStaff: 0,
      amountOfLabPracticalClassesPerTeachingStaff: 0,
      teachingStaff: availableTeachingStaff[0],
      subject: subject,
      academicYear: academicYear,
    });

  const [selectedTeachingStaffId, setSelectedTeachingStaffId] = useState(
    classCoveragePlanData.teachingStaff.id
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    upperLimit: number
  ) => {
    const { name, value } = e.target;

    // Convert input value to a number (or handle empty value)
    let newValue = value ? Number(value) : 0;

    // Validate the value to ensure it stays within limits
    if (newValue < 0) {
      newValue = 0;
    } else if (newValue > upperLimit) {
      newValue = upperLimit;
    }

    // Update state with validated value
    setClassCoveragePlanData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  //For handling teaching staff change
  useEffect(() => {
    const teachingStaffById = availableTeachingStaff.find(
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

  useEffect(() => {
    if (isDialogOpen && dialogRef.current) {
      dialogRef.current.showModal();

      // By default <dialog> HTML element closes on the press of the Esc key on keyboard
      // the code that follows is preventing that from happening

      // Add event listener to prevent default behavior on Esc key press
      const preventEscClose = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault();
        }
      };

      dialogRef.current.addEventListener("keydown", preventEscClose);

      // Cleanup function - called when the component is unmounted or when the effect dependencies change
      // removing all the resources previously set by the effect function (like the event listener here)
      return () => {
        dialogRef.current?.removeEventListener("keydown", preventEscClose);
      };
    }
  }, [isDialogOpen]);

  const handleDialogModalClose = () => {
    setIsDialogOpen(false);

    if (dialogModalMessageType === "Success") {
      const nextPath = pathname.split("/").slice(0, -1).join("/") + "/";
      router.push(nextPath);
    }
  };

  const handleSave = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      const response = await fetch(
        "http://localhost:8080/api/class-coverage-plans/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(classCoveragePlanData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.text();
      setDialogModalMessage(result);
      setDialogModalMessageType("Success");
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <h1>Add new class coverage plan</h1>
      <div className="mt-5">
        <button className="btn btn-neutral" onClick={handleSave}>
          Save
        </button>
      </div>

      <form className="mt-5">
        <div className="flex flex-col mb-3.5">
          <label
            htmlFor="amountOfLectureClassesPerTeachingStaff"
            className="mb-1"
          >
            Amount of lecture classes:{" "}
            <span className="text-neutral-400">
              (available: {unassignedLectureClasses})
            </span>
          </label>
          <input
            id="amountOfLectureClassesPerTeachingStaff"
            name="amountOfLectureClassesPerTeachingStaff"
            type="number"
            value={classCoveragePlanData.amountOfLectureClassesPerTeachingStaff}
            className="input input-bordered w-full max-w-20"
            onChange={(e) => handleInputChange(e, unassignedLectureClasses)}
          />
        </div>

        <div className="flex flex-col mb-3.5">
          <label
            htmlFor="amountOfPracticalClassesPerTeachingStaff"
            className="mb-1"
          >
            Amount of practical classes:{" "}
            <span className="text-neutral-400">
              (available: {unassignedPracticalClasses})
            </span>
          </label>
          <input
            id="amountOfPracticalClassesPerTeachingStaff"
            name="amountOfPracticalClassesPerTeachingStaff"
            type="number"
            value={
              classCoveragePlanData.amountOfPracticalClassesPerTeachingStaff
            }
            className="input input-bordered w-full max-w-20"
            onChange={(e) => handleInputChange(e, unassignedPracticalClasses)}
          />
        </div>

        <div className="flex flex-col mb-3.5">
          <label
            htmlFor="amountOfLabPracticalClassesPerTeachingStaff"
            className="mb-1"
          >
            Amount of lab classes:{" "}
            <span className="text-neutral-400">
              (available: {unassignedLabPracticalClasses})
            </span>
          </label>
          <input
            id="amountOfLabPracticalClassesPerTeachingStaff"
            name="amountOfLabPracticalClassesPerTeachingStaff"
            type="number"
            value={
              classCoveragePlanData.amountOfLabPracticalClassesPerTeachingStaff
            }
            className="input input-bordered w-full max-w-20"
            onChange={(e) =>
              handleInputChange(e, unassignedLabPracticalClasses)
            }
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
          >
            {availableTeachingStaff.map((staff) => (
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
            value={subject.id}
            disabled
          >
            <option value={subject.id}>{subject.name}</option>
          </select>
        </div>

        <div className="flex flex-col mb-3.5">
          <label htmlFor="classCoveragePlanAcademicYear" className="mb-1">
            Academic year:
          </label>
          <select
            id="classCoveragePlanAcademicYear"
            className="select select-bordered w-full max-w-xs"
            value={academicYear.id}
            disabled
          >
            <option value={academicYear.id}>{academicYear.name}</option>
          </select>
        </div>
      </form>

      {/* Modal dialog box */}
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Response message</h3>
          <p className="py-4">{dialogModalMessage}</p>
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn focus:outline-none"
                onClick={handleDialogModalClose}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ClassCoveragePlanAddNewForm;

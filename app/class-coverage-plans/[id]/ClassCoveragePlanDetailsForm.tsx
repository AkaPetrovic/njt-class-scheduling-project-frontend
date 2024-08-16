"use client";
import AcademicYear from "@/app/types/AcademicYear";
import ClassCoveragePlan from "@/app/types/ClassCoveragePlan";
import Subject from "@/app/types/Subject";
import TeachingStaff from "@/app/types/TeachingStaff";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
  const router = useRouter();

  // Feedback dialog related states and refs
  const feedbackDialogRef = useRef<HTMLDialogElement | null>(null);
  const [feedBackDialogModalMessage, setFeedbackDialogModalMessage] =
    useState("");
  const [feedbackDialogModalMessageType, setFeedbackDialogModalMessageType] =
    useState("");
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);

  //Confirm delete dialog related states and refs
  const confirmDeleteDialogRef = useRef<HTMLDialogElement | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);

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
      [name]: value ? (Number(value) >= 0 ? Number(value) : 0) : 0,
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

  useEffect(() => {
    if (isFeedbackDialogOpen && feedbackDialogRef.current) {
      feedbackDialogRef.current.showModal();

      // By default <dialog> HTML element closes on the press of the Esc key on keyboard
      // the code that follows is preventing that from happening

      // Add event listener to prevent default behavior on Esc key press
      const preventEscClose = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault();
        }
      };

      feedbackDialogRef.current.addEventListener("keydown", preventEscClose);

      // Cleanup function - called when the component is unmounted or when the effect dependencies change
      // removing all the resources previously set by the effect function (like the event listener here)
      return () => {
        feedbackDialogRef.current?.removeEventListener(
          "keydown",
          preventEscClose
        );
      };
    }
  }, [isFeedbackDialogOpen]);

  useEffect(() => {
    if (isConfirmDeleteDialogOpen && confirmDeleteDialogRef.current) {
      confirmDeleteDialogRef.current.showModal();

      // By default <dialog> HTML element closes on the press of the Esc key on keyboard
      // the code that follows is preventing that from happening

      // Add event listener to prevent default behavior on Esc key press
      const preventEscClose = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault();
        }
      };

      confirmDeleteDialogRef.current.addEventListener(
        "keydown",
        preventEscClose
      );

      // Cleanup function - called when the component is unmounted or when the effect dependencies change
      // removing all the resources previously set by the effect function (like the event listener here)
      return () => {
        confirmDeleteDialogRef.current?.removeEventListener(
          "keydown",
          preventEscClose
        );
      };
    }
  }, [isConfirmDeleteDialogOpen]);

  const handleFeedbackDialogModalClose = () => {
    setIsFeedbackDialogOpen(false);

    if (feedbackDialogModalMessageType === "Success") {
      setEditingMode(false);
      router.push("/");
    }
  };

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  const handleSave = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/class-coverage-plans/edit",
        {
          method: "PUT",
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
      setFeedbackDialogModalMessage(result);
      setFeedbackDialogModalMessageType("Success");
      setIsFeedbackDialogOpen(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/class-coverage-plans/delete",
        {
          method: "DELETE",
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
      setFeedbackDialogModalMessage(result);
      setFeedbackDialogModalMessageType("Success");
      setIsFeedbackDialogOpen(true);
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
        <button
          className="btn mr-2"
          disabled={editingMode}
          onClick={() => setIsConfirmDeleteDialogOpen(true)}
        >
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

      {/* Modal feedback dialog box */}
      <dialog ref={feedbackDialogRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Response message</h3>
          <p className="py-4">{feedBackDialogModalMessage}</p>
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn focus:outline-none"
                onClick={handleFeedbackDialogModalClose}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Modal confirm delete dialog box */}
      <dialog ref={confirmDeleteDialogRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm removal</h3>
          <p className="py-4">
            Are you sure that you want to delete this class coverage plan?
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn focus:outline-none mr-4"
                onClick={() => {
                  setIsConfirmDeleteDialogOpen(false);
                }}
              >
                No
              </button>
              <button
                className="btn focus:outline-none"
                onClick={() => {
                  setIsConfirmDeleteDialogOpen(false);
                  handleDelete();
                }}
              >
                Yes
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ClassCoveragePlanDetailsForm;

"use client";
import ClassCoveragePlan from "@/app/types/ClassCoveragePlan";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Props {
  classCoveragePlan: ClassCoveragePlan;
  maxAssignedLectureClasses: number;
  maxAssignedPracticalClasses: number;
  maxAssignedLabPracticalClasses: number;
}

const ClassCoveragePlanDetailsForm = ({
  classCoveragePlan,
  maxAssignedLectureClasses,
  maxAssignedPracticalClasses,
  maxAssignedLabPracticalClasses,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();

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

  const [editingMode, setEditingMode] = useState(false);

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
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

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
            Amount of lecture classes:{" "}
            <span className="text-neutral-400">
              (available: {maxAssignedLectureClasses})
            </span>
          </label>
          <input
            id="amountOfLectureClassesPerTeachingStaff"
            name="amountOfLectureClassesPerTeachingStaff"
            type="number"
            value={classCoveragePlanData.amountOfLectureClassesPerTeachingStaff}
            className="input input-bordered w-full max-w-20"
            onChange={(e) => handleInputChange(e, maxAssignedLectureClasses)}
            disabled={!editingMode}
          />
        </div>

        <div className="flex flex-col mb-3.5">
          <label
            htmlFor="amountOfPracticalClassesPerTeachingStaff"
            className="mb-1"
          >
            Amount of practical classes:{" "}
            <span className="text-neutral-400">
              (available: {maxAssignedPracticalClasses})
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
            onChange={(e) => handleInputChange(e, maxAssignedPracticalClasses)}
            disabled={!editingMode}
          />
        </div>

        <div className="flex flex-col mb-3.5">
          <label
            htmlFor="amountOfLabPracticalClassesPerTeachingStaff"
            className="mb-1"
          >
            Amount of lab classes:{" "}
            <span className="text-neutral-400">
              (available: {maxAssignedLabPracticalClasses})
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
              handleInputChange(e, maxAssignedLabPracticalClasses)
            }
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
            value={classCoveragePlan.teachingStaff.id}
            disabled
          >
            <option
              value={classCoveragePlan.teachingStaff.id}
            >{`${classCoveragePlan.teachingStaff.name} ${classCoveragePlan.teachingStaff.surname}`}</option>
          </select>
        </div>

        <div className="flex flex-col mb-3.5">
          <label htmlFor="classCoveragePlanSubject" className="mb-1">
            Subject:
          </label>
          <select
            id="classCoveragePlanSubject"
            className="select select-bordered w-full max-w-xs"
            value={classCoveragePlan.subject.id}
            disabled
          >
            <option value={classCoveragePlan.subject.id}>
              {classCoveragePlan.subject.name}
            </option>
          </select>
        </div>

        <div className="flex flex-col mb-3.5">
          <label htmlFor="classCoveragePlanAcademicYear" className="mb-1">
            Academic year:
          </label>
          <select
            id="classCoveragePlanAcademicYear"
            className="select select-bordered w-full max-w-xs"
            value={classCoveragePlan.academicYear.id}
            disabled
          >
            <option value={classCoveragePlan.academicYear.id}>
              {classCoveragePlan.academicYear.name}
            </option>
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

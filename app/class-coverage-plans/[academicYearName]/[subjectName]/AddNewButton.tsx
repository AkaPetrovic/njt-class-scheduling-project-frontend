"use client";

import TeachingStaff from "@/app/types/TeachingStaff";
import Link from "next/link";
import { useState } from "react";

interface Props {
  path: string;
  availableTeachingStaff?: TeachingStaff[];
  completionStatus: boolean;
  forceEnable?: boolean;
}

const AddNewButton = ({
  path,
  availableTeachingStaff,
  completionStatus,
  forceEnable,
}: Props) => {
  const checkIfDisabled = () => {
    if (forceEnable === true) {
      return false;
    }
    if (completionStatus === true) {
      return true;
    }
    if (availableTeachingStaff && availableTeachingStaff.length === 0) {
      return true;
    }
  };

  const [isDisabled, setIsDisabled] = useState(checkIfDisabled());

  return (
    <button
      disabled={isDisabled}
      className="btn btn-neutral mt-5 p-0 h-auto min-h-min"
    >
      <Link
        className="flex justify-center items-center px-4 h-12 min-h-12"
        href={path}
      >
        Add new
      </Link>
    </button>
  );
};

export default AddNewButton;

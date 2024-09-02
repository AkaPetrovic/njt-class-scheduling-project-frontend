interface Props {
  assignedLectureClasses: number;
  assignedPracticalClasses: number;
  assignedLabPracticalClasses: number;
  unassignedLectureClasses: number;
  unassignedPracticalClasses: number;
  unassignedLabPracticalClasses: number;
  completionStatus: boolean;
}

const CoverageStatus = ({
  assignedLectureClasses,
  assignedPracticalClasses,
  assignedLabPracticalClasses,
  unassignedLectureClasses,
  unassignedPracticalClasses,
  unassignedLabPracticalClasses,
  completionStatus,
}: Props) => {
  return (
    <div className="mb-7">
      <h3>Coverage status: {completionStatus ? "Completed" : "Incomplete"}</h3>

      <table className="table table-sm w-min">
        <tbody className="[&_tr:not(:last-child)]:border-b [&_tr:not(:last-child)]:border-base-300">
          <tr className="border-b border-base-300 text-base">
            <td className="font-bold">Classes</td>
            <td className="font-bold">Lecture Classes</td>
            <td className="font-bold">Practical Classes</td>
            <td className="font-bold">Lab Classes</td>
          </tr>
          <tr className="hover:bg-base-200 transition-colors duration-300">
            <td className="font-bold">Assigned</td>
            <td>{assignedLectureClasses}</td>
            <td>{assignedPracticalClasses}</td>
            <td>{assignedLabPracticalClasses}</td>
          </tr>
          <tr className="hover:bg-base-200 transition-colors duration-300">
            <td className="font-bold">Unassigned</td>
            <td>{unassignedLectureClasses}</td>
            <td>{unassignedPracticalClasses}</td>
            <td>{unassignedLabPracticalClasses}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CoverageStatus;

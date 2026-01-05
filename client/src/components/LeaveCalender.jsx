import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const LeaveCalendar = ({ approvedLeaves }) => {

  const approvedDates = new Set();

  approvedLeaves.forEach((leave) => {
    const start = new Date(leave.start_date);
    const end = new Date(leave.end_date);

    for (
      let d = new Date(start);
      d <= end;
      d.setDate(d.getDate() + 1)
    ) {
      approvedDates.add(d.toDateString());
    }
  });

  return (
    <div className="rounded-lg border flex flex-col lg:flex-row gap-10 bg-white p-4">
      <div>
        <h3 className="mb-4 text-sm font-medium text-gray-700">
            Approved Leave Calendar
        </h3>

        <Calendar
            tileClassName={({ date, view }) => {
            if (view === "month") {
                const dateStr = date.toDateString();
                if (approvedDates.has(dateStr)) {
                return "approved-leave";
                }
            }
            return null;
            }}
        />

        <p className="mt-3 text-xs text-gray-500">
            Highlighted dates indicate approved employee leaves.
        </p>
      </div>
      <div  className="flex flex-col gap-2">
        <h4 className="mt-4 mb-2 text-sm font-medium text-gray-700">Legend</h4>
        <div className="flex items-center">
          <span className="inline-block h-8 w-8 bg-yellow-200 rounded-md mr-2"></span>
          <span className="text-xs text-gray-600">Today</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block h-8 w-8 bg-green-200 rounded-md mr-2"></span>
          <span className="text-xs text-gray-600">Approved Leave</span>
        </div>
      </div>
    </div>
  );
};

export default LeaveCalendar;

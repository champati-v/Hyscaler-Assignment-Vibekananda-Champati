import { useEffect, useState } from "react";
import Input from "../../../components/Input";
import { useAuth } from "../../../context/AuthContext";
import Badge from "../../../components/Badge";
import DateFormat from "../../../components/DateFormat";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import DatePicker from "react-datepicker";

const EmployeeDashboard = () => {
  const { user, logout, token } = useAuth();
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balance, setBalance] = useState({
    vacation_days: 0,
    sick_days: 0,
  });
  const [historyLoading, setHistoryLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [leaveApplyLoading, setLeaveApplyLoading] = useState(false);
  const [leaveDetails, setLeaveDetails] = useState({
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const formatDateLocal = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};


  const leaveDaysRequested = (new Date(leaveDetails.end_date) - new Date(leaveDetails.start_date)) / (1000 * 60 * 60 * 24) + 1;

  const getDisabledDateRanges = (leaves) => {
    return leaves
      .filter(
        (leave) => leave.status === "pending" || leave.status === "approved"
      )
      .map((leave) => ({
        start: new Date(leave.start_date),
        end: new Date(leave.end_date),
      }));
  };
  const disabledDateRanges = getDisabledDateRanges(history);

  const requestLeave = async (e) => {
    e.preventDefault();

    const { leave_type, start_date, end_date } = leaveDetails;

    if (!leave_type || !start_date || !end_date) {
      alert("Please fill all the required values");
      return;
    }

    if (
      leave_type === "vacation" &&
      leaveDaysRequested > balance.vacation_days
    ) {
      alert("Insufficient vacation days");
      return;
    }

    if (leave_type === "sick" && leaveDaysRequested > balance.sick_days) {
      alert("Insufficient sick days");
      return;
    }

    try {
      setLeaveApplyLoading(true);
      const response = await fetch("http://localhost:5000/leave/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(leaveDetails),
      });

      if (response.status === 200) {
        alert("Leave application submitted successfully.");
        setLeaveDetails({
          leave_type: "",
          start_date: "",
          end_date: "",
          reason: "",
        });
        getHistory();
      } else {
        alert("Error: " + (await response.json()).message);
        setLeaveDetails({
          leave_type: "",
          start_date: "",
          end_date: "",
          reason: "",
        });
      }
    } catch (error) {
      console.error("Error applying for leave:", error);
    } finally {
      setLeaveApplyLoading(false);
    }
  };

  const getBalance = async () => {
    try {
      setBalanceLoading(true);
      const response = await fetch("http://localhost:5000/leave/balance", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setBalance(await response.json());
        console.log("Leave Balances:", balance);
      }
    } catch (error) {
      console.error("Error fetching leave balances:", error);
    } finally {
      setBalanceLoading(false);
    }
  };

  const getHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await fetch("http://localhost:5000/leave/my", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setHistory(await response.json());
        console.log("Leave History:", history);
      }
    } catch (error) {
      console.error("Error fetching leave balances:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    getBalance();
    getHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between border-b bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-gray-800">
          Employee Dashboard
        </h1>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.name}</span>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 rounded-md px-4 py-2 text-sm font-medium text-white cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-6 space-y-8">
        {/* Leave Balances */}
        <section>
          <h2 className="mb-4 text-sm font-medium text-gray-700">
            Leave Balances
          </h2>

          <div className="grid gap-4 grid-cols-2">
            <div className="rounded-lg border bg-white p-4">
              <p className="text-sm text-gray-500">Vacation Leave</p>
              <p className="mt-2 text-2xl font-semibold text-gray-800">
                {balanceLoading ? (
                  <Skeleton />
                ) : (
                  `${balance.vacation_days} days`
                )}
              </p>
            </div>

            <div className="rounded-lg border bg-white p-4">
              <p className="text-sm text-gray-500">Sick Leave</p>
              <p className="mt-2 text-2xl font-semibold text-gray-800">
                {balanceLoading ? <Skeleton /> : `${balance.sick_days} days`}
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Apply Leave */}
          <div className="mb-8 lg:mb-0">
            <h2 className="mb-4 text-sm font-medium text-gray-700">
              Apply for Leave
            </h2>

            <div className="rounded-lg border bg-white p-6 h-[360px]">
              <form
                onSubmit={requestLeave}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                <div>
                  <label className="text-sm text-gray-600">
                    Leave Type <span className="text-red-500">*</span>{" "}
                  </label>
                  <select
                    value={leaveDetails.leave_type}
                    onChange={(e) =>
                      setLeaveDetails({
                        ...leaveDetails,
                        leave_type: e.target.value,
                      })
                    }
                    disabled={leaveApplyLoading}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Select Leave Type</option>
                    <option value="vacation">Vacation</option>
                    <option value="sick">Sick</option>
                  </select>
                </div>

                <div className="flex flex-col">
                   <label className="text-sm text-gray-600">
                    Start Date <span className="text-red-500">*</span>{" "}
                  </label>

                  <DatePicker
                    selected={
                      leaveDetails.start_date
                        ? new Date(leaveDetails.start_date)
                        : null
                    }
                    onChange={(date) =>
                      setLeaveDetails({
                        ...leaveDetails,
                        start_date: formatDateLocal(date),
                        end_date: "", 
                      })
                    }
                    minDate={today}
                    excludeDateIntervals={disabledDateRanges}
                    placeholderText="Select start date"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
                  />
                </div>

                <div className="flex flex-col">

                  <label className="text-sm text-gray-600">
                    End Date <span className="text-red-500">*</span>{" "}
                  </label>

                  <DatePicker
                    selected={
                      leaveDetails.end_date
                        ? new Date(leaveDetails.end_date)
                        : null
                    }
                    onChange={(date) =>
                      setLeaveDetails({
                        ...leaveDetails,
                        end_date: formatDateLocal(date),
                      })
                    }
                    minDate={
                      leaveDetails.start_date
                        ? new Date(leaveDetails.start_date)
                        : new Date()
                    }
                    excludeDateIntervals={disabledDateRanges}
                    placeholderText="Select end date"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-600">Reason</label>
                  <textarea
                    rows="3"
                    className="mt-1 w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 px-4 py-2 text-sm"
                    value={leaveDetails.reason}
                    onChange={(e) =>
                      setLeaveDetails({
                        ...leaveDetails,
                        reason: e.target.value,
                      })
                    }
                    disabled={leaveApplyLoading}
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={leaveApplyLoading}
                  >
                    {leaveApplyLoading ? "Applying..." : "Apply for Leave"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Leave History */}
          <div className="flex flex-col">
            <h2 className="mb-4 text-sm font-medium text-gray-700">
              My Leave History
            </h2>

            <div className="flex flex-col rounded-lg border bg-white h-[360px] overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Dates</th>
                    <th className="px-4 py-3 text-left">Reason</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
              </table>

              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {history.length > 0 &&
                      history.map((leave) => (
                        <tr key={leave.id} className="border-b border-gray-400">
                          <td className="px-4 py-3 capitalize">
                            {leave.leave_type}
                          </td>

                          <td className="px-4 py-3">
                            <DateFormat date={leave.start_date} /> –{" "}
                            <DateFormat date={leave.end_date} />
                          </td>

                          <td className="px-4 py-3">{leave.reason || "-"}</td>

                          <td className="px-4 py-3">
                            <Badge name={leave.status} />
                          </td>
                        </tr>
                      ))}
                    {historyLoading && (
                      <tr>
                        <td colSpan="4" className="px-4 py-3 text-center">
                          <Skeleton count={10} />
                        </td>
                      </tr>
                    )}
                    {history.length === 0 && !historyLoading && (
                      <tr>
                        <td colSpan="4" className="px-4 py-3 text-center">
                          No leave history found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EmployeeDashboard;

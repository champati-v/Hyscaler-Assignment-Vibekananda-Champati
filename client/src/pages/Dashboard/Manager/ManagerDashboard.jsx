import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import Badge from "../../../components/Badge";
import DateFormat from "../../../components/DateFormat";
import Input from "../../../components/Input";
import Skeleton from "react-loading-skeleton";

const ManagerDashboard = () => {
  const { user, token, logout } = useAuth();

  const [allLeaves, setAllLeaves] = useState([]);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [approveRejectLoading, setApproveRejectLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [comment, setComment] = useState("");

  const pendingLeaves = allLeaves?.filter(
    (leave) => leave.status === "pending"
  );

  useEffect(() => {
    getAllLeaves();
  }, []);

  const getAllLeaves = async () => {
    try {
      setLeaveLoading(true);
      const res = await fetch("http://localhost:5000/leave/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setAllLeaves(data);
    } catch (error) {
      console.error("Failed to fetch leaves", error);
    } finally {
      setLeaveLoading(false);
    }
  };

  const handleAction = async (leaveId, status) => {
    try {
      setApproveRejectLoading(true);
      setActionLoading(leaveId);

      const response = await fetch(`http://localhost:5000/leave/${leaveId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          manager_comment: comment,
        }),
      }); 

      const data = await response.json();

      if(response.status !== 200){
        alert("Action failed: " + data.message);
        return;
      }

      setComment("");
      getAllLeaves();
    } catch (error) {
      console.error("Action failed", error);
    } finally {
      setActionLoading(null);
      setApproveRejectLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="flex items-center justify-between border-b bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-gray-800">
          Manager Dashboard
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

      <main className="p-6">
        <div className="flex flex-col lg:flex-row items-start justify-between">
          {/* PENDING REQUESTS */}
          <section>
            <h2 className="mb-4 text-sm font-medium text-gray-700">
              Pending Leave Requests
            </h2>

            <div className="rounded-lg border bg-white overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Dates</th>
                    <th className="px-4 py-3">Reason</th>
                    <th className="px-4 py-3">Comment</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {pendingLeaves.length > 0 ? (
                    pendingLeaves.map((leave) => (
                      <tr key={leave.id} className="border-b flex-1">
                        <td className="px-4 py-3">{leave.name}</td>

                        <td className="px-4 py-3">
                          <DateFormat date={leave.start_date} /> –{" "}
                          <DateFormat date={leave.end_date} />
                        </td>

                        <td className="px-4 py-3">{leave.reason || "-"}</td>

                        <td className="px-4 py-3">
                          <Input
                            type="text"
                            placeholder="Optional"
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full rounded-md border px-2 py-1 text-sm"
                            disabled={approveRejectLoading}
                          />
                        </td>

                        <td className="px-4 py-3 flex gap-2">
                          <button
                            disabled={actionLoading === leave.id}
                            onClick={() => handleAction(leave.id, "approved")}
                            className="rounded bg-green-600 px-4 py-2 text-xs text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            { approveRejectLoading ? "Processing..." : "Approve" }
                          </button>

                          <button
                            disabled={actionLoading === leave.id}
                            onClick={() => handleAction(leave.id, "rejected")}
                            className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            { approveRejectLoading ? "Processing..." : "Reject" }
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No pending leave requests
                      </td>
                    </tr>
                  )}
                  {leaveLoading && (
                    <tr>
                      <td colSpan="5" className="px-4 py-3 text-center">
                        <Skeleton />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ALL LEAVES */}
          <section>
            <h2 className="mb-4 text-sm font-medium text-gray-700">
              All Leave Requests
            </h2>

            <div className="flex flex-col rounded-lg border bg-white w-full lg:w-[630px] h-[360px]">
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
                    {allLeaves.length > 0 &&
                      allLeaves.map((leave) => (
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
                    {leaveLoading && (
                      <tr>
                        <td colSpan="4" className="px-4 py-3 text-center">
                          <Skeleton count={10} />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;

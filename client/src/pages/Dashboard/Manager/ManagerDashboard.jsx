import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import Badge from "../../../components/Badge";
import DateFormat from "../../../components/DateFormat";

const ManagerDashboard = () => {
  const { user, token, logout } = useAuth();

  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    getPendingLeaves();
    getAllLeaves();
  }, []);

  // 🔹 Fetch pending leaves
  const getPendingLeaves = async () => {
    const res = await fetch("http://localhost:5000/leave/pending", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setPendingLeaves(data);
  };

  // 🔹 Fetch all leaves
  const getAllLeaves = async () => {
    const res = await fetch("http://localhost:5000/leave/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setAllLeaves(data);
  };

  // 🔹 Approve / Reject handler
  const handleAction = async (leaveId, status) => {
    try {
      setActionLoading(leaveId);

      await fetch(`http://localhost:5000/leave/${leaveId}`, {
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

      setComment("");
      getPendingLeaves();
      getAllLeaves();
    } catch (error) {
      console.error("Action failed", error);
    } finally {
      setActionLoading(null);
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
            className="text-sm text-indigo-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-6 space-y-10">
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
                    <tr key={leave.id} className="border-b">
                      <td className="px-4 py-3">{leave.name || leave.email}</td>

                      <td className="px-4 py-3">
                        <DateFormat date={leave.start_date} /> – <DateFormat date={leave.end_date} />
                      </td>

                      <td className="px-4 py-3">{leave.reason || "-"}</td>

                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="Optional"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="w-full rounded-md border px-2 py-1 text-sm"
                        />
                      </td>

                      <td className="px-4 py-3 flex gap-2">
                        <button
                          disabled={actionLoading === leave.id}
                          onClick={() => handleAction(leave.id, "approved")}
                          className="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          Approve
                        </button>

                        <button
                          disabled={actionLoading === leave.id}
                          onClick={() => handleAction(leave.id, "rejected")}
                          className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          Reject
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
              </tbody>
            </table>
          </div>
        </section>

        {/* ALL LEAVES */}
        <section>
          <h2 className="mb-4 text-sm font-medium text-gray-700">
            All Leave Requests
          </h2>

          <div className="rounded-lg border bg-white overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {allLeaves.map((leave) => (
                  <tr key={leave.id} className="border-b">
                    <td className="px-4 py-3">{leave.name || leave.email}</td>

                    <td className="px-4 py-3 capitalize">{leave.leave_type}</td>

                    <td className="px-4 py-3">
                      <DateFormat date={leave.start_date} /> – <DateFormat date={leave.end_date} />
                    </td>

                    <td className="px-4 py-3">
                      <Badge name={leave.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ManagerDashboard;

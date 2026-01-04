import Input from "../../../components/Input";
import { useAuth } from "../../../context/AuthContext";

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();

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
            className="text-sm text-indigo-600 hover:underline"
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border bg-white p-4">
              <p className="text-sm text-gray-500">Vacation Leave</p>
              <p className="mt-2 text-2xl font-semibold text-gray-800">
                10 days
              </p>
            </div>

            <div className="rounded-lg border bg-white p-4">
              <p className="text-sm text-gray-500">Sick Leave</p>
              <p className="mt-2 text-2xl font-semibold text-gray-800">
                10 days
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

            <div className="h-full rounded-lg border bg-white p-6">
              <form className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-gray-600">Leave Type <span className="text-red-500">*</span> </label>
                  <select className="mt-1 w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 px-4 py-2 text-sm">
                    <option>Vacation</option>
                    <option>Sick</option>
                  </select>
                </div>

                <div>
                  <Input
                    type="date"
                    label="Start Date"
                    required
                  />
                </div>

                <div>
                  <Input
                    type="date"
                    label="End Date"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-600">Reason</label>
                  <textarea
                    rows="3"
                    className="mt-1 w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 px-4 py-2 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Submit Leave Request
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

            <div className="flex-1 overflow-x-auto rounded-lg border bg-white">
              <table className="w-full text-sm">
                <thead className="border-b bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Dates</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="overflow-y-scroll">
                  <tr className="border-b">
                    <td className="px-4 py-3">Vacation</td>
                    <td className="px-4 py-3">10 Jan – 12 Jan</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
                        Pending
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-4 py-3">Sick</td>
                    <td className="px-4 py-3">05 Jan</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                        Approved
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EmployeeDashboard;

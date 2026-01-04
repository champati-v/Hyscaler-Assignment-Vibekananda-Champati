import { BrowserRouter, Routes, Route } from 'react-router-dom'
import EmployeeDashboard from './pages/Dashboard/Employee/EmployeeDashboard'
import ManagerDashboard from './pages/Dashboard/Manager/ManagerDashboard'
import Login from './pages/Auth/Login'
import ProtectRoutes from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'

const App = () => {

  const { loading } = useAuth();

  if (loading) {
  return (
    <div className="h-screen flex items-center justify-center">
      <span className="text-gray-500 text-sm">Checking session…</span>
    </div>
  );
}


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' 
          element = {
            <ProtectRoutes allowedRoles={['employee', 'manager']}>
            <Login />
            </ProtectRoutes>
          } 
        />

        <Route path='/login' 
          element = {
            <ProtectRoutes allowedRoles={['employee', 'manager']}>
            <Login />
            </ProtectRoutes>
          }
        />

        <Route path='/employee'
          element={
            <ProtectRoutes allowedRoles={['employee']}>
              <EmployeeDashboard />
            </ProtectRoutes>
          }
        />
        <Route path='/manager'
          element={
            <ProtectRoutes allowedRoles={['manager']}>
              <ManagerDashboard />
            </ProtectRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
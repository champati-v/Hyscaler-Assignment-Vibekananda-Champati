import { useAuth } from '../../../context/AuthContext'

const ManagerDashboard = () => {

  const { user, logout } = useAuth();


  return (
    <>
      <div>ManagerDashboard</div>
      <h1>Welcome, {user?.name}</h1>
      <p>Your are a {user?.role}</p>

      <button onClick={logout}>Logout</button>
    </>
  )
};

export default ManagerDashboard
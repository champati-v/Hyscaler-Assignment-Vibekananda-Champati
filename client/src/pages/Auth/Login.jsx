import { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import RadioGroup from "../../components/RadioGroup";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, role: authRole } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginDetails = {
      email,
      password,
      role,
    };

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginDetails),
      });

      const userData = await response.json();

      if (response.status === 200) {
        
        login(userData);

        if(userData.user.role === 'employee'){
          navigate("/employee", { replace: true });
        } else {
          navigate("/manager", { replace: true });
        }
      } 
      
      else{
        alert("Login failed: " + userData.message);
      }

    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Please try again." + error.message);
    } finally {
        setLoading(false);
    }
};

    return (
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <div className="flex items-center justify-center px-6">
          <div className="w-full max-w-md">
            <h1 className="mb-2 text-2xl font-semibold">
              Team Leave Management Application
            </h1>
            <p className="mb-8 text-sm text-gray-500">
              Log in to continue to your dashboard.
              {isAuthenticated}
            </p>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <RadioGroup
                label="Login as"
                name="role"
                required
                value={role}
                onChange={setRole}
                options={[
                  { label: "Manager", value: "manager" },
                  { label: "Employee", value: "employee" },
                ]}
              />

              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center bg-indigo-600 text-white">
          <div className="w-full h-screen rounded-lg bg-indigo-500/40 flex items-center justify-center overflow-hidden">
            <img
              src="/login-bg.jpg"
              alt="Login Background"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    );
  };

export default Login;

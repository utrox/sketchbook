import "./auth.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

export const Register = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Redirect to home if user is already logged in
  const { user } = useAuth();
  if (user) {
    // Use window.location.href to reload, so we don't have
    // to manually refetch user data.
    window.location.href = "/";
  }

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/register/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }
    );
    setLoading(false);
    if (response.ok) {
      navigate("/login");
      toast.success("Registration successful. You can now log in.");
    } else {
      const data = await response.json();
      toast.error(data.errors?.[0].message || "An error occurred.");
      console.error("Login error response: ", data);
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="register-leftSide side">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleRegistration}>
              {/* TODO: better loading component */}
              {loading ? "Loading..." : "Register"}
            </button>
          </form>
        </div>
        <div className="register-rightSide side">
          <h1>
            Welcome to <span id="logo">sketchbook</span>
          </h1>
          <p>
            If you don't make a profile for this demo application, you won't be
            able to check out most of the funcitonalities.
          </p>
          <p>Do you already have an account?</p>
          <div>
            <Link to="/login">
              <button>Log in</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

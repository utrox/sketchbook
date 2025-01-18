import "./auth.css";
import { useState } from "react";
import { Link } from "react-router-dom";

import { fetchWithHandling } from "../../utils";
import { useAuth } from "../../hooks/useAuth";
import PageTitle from "../../components/PageTitle";

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Redirect to home if user is already logged in
  const { user } = useAuth();
  if (user) {
    // Use window.location.href to redirect,
    // so it reloads the whole app and fetches the user data again.
    window.location.href = "/";
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await fetchWithHandling(
      `${import.meta.env.VITE_BACKEND_URL}/auth/login/`,
      {
        method: "POST",
        body: JSON.stringify({ username, password }),
      },
      "Login successful.",
      () => (window.location.href = "/")
    );

    setLoading(false);
  };

  return (
    <div className="login">
      <PageTitle title="Login" />
      <div className="card">
        <div className="login-leftSide side">
          <h1>
            Welcome to <span id="logo">sketchbook</span>
          </h1>
          <p>
            If you don't make a profile for this demo application, you won't be
            able to check out most of the funcitonalities.
          </p>
          <p>Do you want to try out all functionalities?</p>
          <div>
            <Link to="/register">
              <button>Register</button>
            </Link>
          </div>
        </div>
        <div className="login-rightSide side">
          <h1>Login</h1>
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
            {/* TODO: better loading component */}
            <button onClick={handleLogin}>
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

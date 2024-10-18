import "./auth.css";
import { Link } from "react-router-dom";

export const Login = () => {
  return (
    <div className="login">
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
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button>Login</button>
            {/* TODO: implement login logic, login endpoint on backend */}
          </form>
        </div>
      </div>
    </div>
  );
};

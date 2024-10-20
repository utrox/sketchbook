import "./auth.css";
import { Link } from "react-router-dom";

export const Register = () => {
  return (
    <div className="register">
      <div className="card">
        <div className="register-leftSide side">
          <h1>Register</h1>
          <form>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button>Register</button>
            {/* TODO: implement registration logic, registration endpoint on backend */}
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

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [passValid, setPassValid] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const url = window.location.href;
  const isSignupPage = url.includes("sign-up");

  useEffect(() => {
    const passwordValidation = () => {
      if (password.length < 8) {
        setPasswordError("Password must be at least 8 characters long.");
        setPassValid(false);
      } else if (!/[a-zA-Z]/.test(password)) {
        setPasswordError("Password must contain at least one letter.");
        setPassValid(false);
      } else if (!/\d/.test(password)) {
        setPasswordError("Password must contain at least one number.");
        setPassValid(false);
      } else {
        setPasswordError("");
        setPassValid(true);
      }
    };
    passwordValidation();
  }, [password]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isSignupPage) {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate("/");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/home");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  setTimeout(() => {
    setLoading(false);
  }, 1100);

  if (loading) {
    return <span class="loader"></span>;
  }

  return (
    <div className="loginPage">
      <div className="loginBanner">
        <img src="/public/assets/Logo.png" alt="logo" />
        <div className="LogintextBox">
          <h2>Keep track of your money and save for your future</h2>
          <p>
            Personal finance app puts you in control of your spending. Track
            transactions, set budgets, and add to savings pots easily.
          </p>
        </div>
      </div>
      <div className="loginPanel">
        <form className="loginBox" onSubmit={handleAuth}>
          <h2>{isSignupPage ? "Sign Up" : "Login"}</h2>

          {isSignupPage && (
            <div className="InputBox">
              <span>Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="InputBox">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="InputBox">
            <span>{isSignupPage ? "Create Password" : "Password"}</span>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <img
              src="/public/assets/icons/eye.png"
              alt="eyeicon"
              onClick={() =>
                showPass ? setShowPass(false) : setShowPass(true)
              }
            />
            {isSignupPage && <p className="passwordError">{passwordError}</p>}
          </div>

          {error && <p className="error">{error}</p>}
          {isSignupPage ? (
            <button
              type="submit"
              disabled={!passValid}
              className={passValid ? "" : "disabledBut"}
            >
              Sign Up
            </button>
          ) : (
            <button type="submit">Login</button>
          )}

          <p id="authtext">
            {isSignupPage ? (
              <>
                Already have an account? <Link to="/">Login</Link>
              </>
            ) : (
              <>
                Need to create an account? <Link to="/sign-up">Sign Up</Link>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}

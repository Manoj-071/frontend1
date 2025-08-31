import { useState } from "react";
import "./AuthPage.css";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate=useNavigate();

  // Separate states for each field
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupDob, setSignupDob] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const toggleFlip = () => setIsFlipped(!isFlipped);

  const handleLogin = () => {
    console.log("Login clicked", { loginName, loginPassword });
    fetch("http://localhost:8000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: loginName, password: loginPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
      navigate('/dashboard', { state: { username: loginName } });
    })
      .catch((error) => {
        console.error("Error during login:", error);
        alert("Login failed. Please check your credentials.");
      });
  };

  const handleSignup = () => {
    console.log("Signup clicked", {
      signupName,
      signupEmail,
      signupPassword,
      signupConfirmPassword,
      signupDob,
    });
    if (signupPassword !== signupConfirmPassword || signupPassword === "") {
      alert("Passwords do not match!");
      return;
    }
    fetch("http://localhost:8000/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        dob: signupDob,
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("Signup successful:", data);
      toggleFlip();
        // Handle successful signup (e.g., redirect to login)
      })
      .catch((error) => {
        console.error("Error during signup:", error);
      });
  };

  return (
  <div>
    <div className="auth-container">
    
      <div className={`auth-card ${isFlipped ? "flipped" : ""}`}>
    
        {/* LOGIN SIDE */}
        <div className="auth-front">
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
          <p>
            Don't have an account?{" "}
            <span className="link" onClick={toggleFlip}>
              Sign Up
            </span>
          </p>
        </div>
        {/* SIGNUP SIDE */}
        <div className="auth-back">
          <h2>Sign Up</h2>
          <input
            type="text"
            placeholder="Name"
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="DOB"
            value={signupDob}
            onChange={(e) => setSignupDob(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={signupConfirmPassword}
            onChange={(e) => setSignupConfirmPassword(e.target.value)}
          />

          <button onClick={handleSignup}>Sign Up</button>
          <p>
            Already have an account?{" "}
            <span className="link" onClick={toggleFlip}>
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
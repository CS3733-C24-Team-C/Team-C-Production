import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const SignInRoute = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username != "admin" || password != "admin") {
      alert("Wrong Password or Account");
      return;
    }
    console.log(username);
    console.log(password);
    navigate("/");
  };

  const handleResetPassword = (e: FormEvent) => {
    e.preventDefault();
    navigate("/sign-in/reset-password");
  };

  const handleCreateAccount = (e: FormEvent) => {
    e.preventDefault();
    navigate("/sign-in/new-account");
  };

  return (
    <form onSubmit={handleSubmit} className={"centeredElement"}>
      <h1>Sign In</h1>
      <div>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Sign In</button>
      <br />
      <button type="button" role="link" onClick={handleResetPassword}>
        Reset Password
      </button>
      <br />
      <button type="button" role="link" onClick={handleCreateAccount}>
        Create an Account
      </button>
    </form>
  );
};

export default SignInRoute;

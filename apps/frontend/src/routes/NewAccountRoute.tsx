import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const NewAccountRoute = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password !== checkPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log(username);
    console.log(password);
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className={"centeredElement"}>
      <h1>Create an Account:</h1>
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
      <div>
        <input
          type="password"
          id="verify-password"
          name="verify-password"
          placeholder="Verify Password"
          required
          value={checkPassword}
          onChange={(e) => setCheckPassword(e.target.value)}
        />
      </div>
      <button type="submit">Create Account</button>
    </form>
  );
};

export default NewAccountRoute;

import axios from "axios";
import { useState } from "react";
import "./resetPassword.css";
import { Link, useNavigate, Navigate } from "react-router-dom";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [code, setcode] = useState("");
  const [pass, setpass] = useState("");
  const [foundUser, setFoundUser] = useState(true);
  const [foundsend, setFoundsend] = useState(null);
  const [open, setopen] = useState(null);

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setEmail(event.target.value);
  };
  const sendCode = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/forgotpassword`, { email: email});
      if (data.msg === "User not found") {
        setFoundUser(false)
      }
      setFoundsend(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  const validate = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/validateResetCode`, { email: foundUser.email, code: code });
      if (data.message === "ok") {
        setFoundsend(false);
        setopen(true);
      }
      else {
        alert(data.message)
      }

    } catch (error) {
      console.log(error.message)
    }
  }
  const changep = async (e) => {
    e.preventDefault();
    if (pass.length <= 8) {
      alert("PASSWORD LENGTH SHOULD BE MORE THAN 8")
      return;
    }
    if (!pass) {
      return;
    }

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/changePassword`, { email: foundUser.email, password: pass });
      if (data.message === "ok") {
        alert("Password Changed");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
      else {
        alert(data.message)
      }
    } catch (error) {
      alert(error.message)
    }
  }
  return (
    <div className="user-search">
      {" "}
      {/* Add the "user-search" class to the container */}
      <label htmlFor="email-input">Email address:</label>
      <input
        type="email"
        id="email-input"
        value={email}
        onChange={handleInputChange}
        className="user-search-input"
      />
      <button onClick={sendCode()} className="user-search-button">
        Send code
      </button>
      <div className={`${foundsend ? "" : "hidden"}`}>
        <form className="">
          <label htmlFor="email-input">Code Has been Sent to your email</label>
          <input
            type="text"
            // id="email-input"
            value={code}
            placeholder="CODE"

            onChange={e => { setcode(e.target.value) }}
            className="user-search-input"
          />
          <button onClick={validate} >Verify</button>

        </form>
      </div>
      <div className={`${open ? "" : "hidden"}`}>
        <form className="">
          <label htmlFor="email-input">Enter Your new Password</label>
          <input
            type="password"
            // id="email-input"
            value={pass}
            placeholder="NEW PASSWORD"
            onChange={e => { setpass(e.target.value) }}
            className="user-search-input"
          />
          <button onClick={e => changep(e)} >Confirm</button>

        </form>
      </div>
    </div>
  );
}

export default ResetPassword;

import React, { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import db, { auth } from "../../Firebase";

import "./Login.css";

function Login() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [allUserData,setAllUserdata]=useState([]);
  useLayoutEffect(()=>{
    getAllUser()
  },[])
   const getAllUser=()=>{
    let tmp=[];
    db.collection("users")
    .get()
    .then((allproducts) => {
      allproducts.docs.map((product) => {
        tmp.push({ id: product.id, ...product.data() });
      });
      console.log(tmp);
      setAllUserdata(tmp);
    });
  }
  const getUserDetails = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user || null; // Return the user object or null if not found
  };

  const logintapped = () => {
    if (email === "" || password === "") {
      alert("Please enter Email and Password");
    } else {
     
    }
  };

  return (
    <div className="loginregion">
      <div className="logininnerregion">
        <h3>Login to your account</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <h5>Email</h5>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <h5>Password</h5>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input type="submit" onClick={logintapped} value="Login" />
        </form>
      </div>
    </div>
  );
}

export default Login;

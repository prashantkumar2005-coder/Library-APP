import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {

  const [token, setToken] = useState(
    !!localStorage.getItem("token")
  );


  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Home</Link>

      <div className="navbar-links">
       

        {token ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <NavLink to="/Register">Register</NavLink>
            <NavLink to="/Login">Login</NavLink>
          </>
        )}
        <NavLink to="/Store">Store</NavLink>
      </div>
    </nav>
  );
}
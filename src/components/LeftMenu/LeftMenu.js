import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../Firebase";
import "./LeftMenu.css";
import { getLocalStorageItem } from "../../content/helper";

function LeftMenu({ active }) {
  const [role, setRole] = useState("");
  useEffect(() => {
    const userData = getLocalStorageItem("userData");
    setRole(userData.role);
  }, []);
  const navigate = useNavigate();

  const signout = () => {
    auth.signOut().then(() => {
      navigate("/");
    });
  };

  console.log("activee>>", active);

  return (
    <div className="leftmenu">
      <div className="div1">
        <button
          className={active === "home" ? "active" : ""}
          onClick={() => navigate("/home")}
        >
          Home
        </button>
        <button
          className={active === "products" ? "active" : ""}
          onClick={() => navigate("/products")}
        >
          Products
        </button>
        {/* ordered products to be shown to staff */}
        {/* {role === "admin" ? ( */}
        <>
          <button
            className={active === "orders" ? "active" : ""}
            onClick={() => navigate("/orders")}
          >
            Purchase Orders
          </button>
          <button
            className={active === "orderssales" ? "active" : ""}
            onClick={() => navigate("/orderssales")}
          >
            Sales Orders
          </button>
          <button
            className={active === "payments" ? "active" : ""}
            onClick={() => navigate("/payments")}
          >
            Payments
          </button>
        </>
        {/* ) : null} */}
        {/* <button
          className={active === "collections" ? "active" : ""}
          onClick={() => navigate("/collections")}
        >
          Collections
        </button>
        <button
          className={active === "customers" ? "active" : ""}
          onClick={() => navigate("/customers")}
        >
          Customers
        </button>
        <button
          className={active === "vendors" ? "active" : ""}
          onClick={() => navigate("/vendors")}
        >
          Vendors
        </button>
      </div> */}
      </div>
      <div>
        <button onClick={() => signout()}>Sign Out</button>
      </div>
    </div>
  );
}

export default LeftMenu;

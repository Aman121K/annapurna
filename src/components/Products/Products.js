import React, { useState, useEffect } from "react";
import db, { auth } from "../../Firebase";
import { useNavigate } from "react-router-dom";
import LeftMenu from "../LeftMenu/LeftMenu";
import "./Products.css";
import { realDate } from "../../content/helper";
import { getLocalStorageItem } from "../../content/helper";

function Products() {
  const [allProducts, setAllProducts] = useState([]);
  const [allFilteredProducts, setAllFilteredProducts] = useState([]);
  const [searchterm, setSearchterm] = useState("");
  const [userRole, setUserRole] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const userData = getLocalStorageItem("userData");
    setUserRole(userData?.role);

    // auth.onAuthStateChanged((user) => {
    //   if (user) {
    //   } else {
    //     navigate("/");
    //   }
    // });
  }, []);

  useEffect(() => {
    var tmp = [];
    db.collection("products")
      .get()
      .then((allproducts) => {
        allproducts.docs.map((product) => {
          tmp.push({ id: product.id, ...product.data() });
        });
        console.log("temp...", tmp);
        setAllProducts(tmp);
        setAllFilteredProducts(tmp);
      });
  }, []);

  useEffect(() => {
    if (searchterm === "") {
      setAllFilteredProducts(allProducts);
    } else {
      setAllFilteredProducts(
        allProducts.filter((pro) =>
          pro.name.toLowerCase().includes(searchterm.toLowerCase())
        )
      );
    }
  }, [searchterm]);

  const staffAllowedStatuses = ["Completed", "Initated", "Patirallly_Complete"];
  const accountAllowedStatuses = ["Completed", "Patirallly_Complete"];

  return (
    <div className="products">
      <LeftMenu active="products" />
      <div className="productsregion">
        <div className="addandfilter">
          {userRole !== "staff" ||
            (userRole !== "account" && (
              <button onClick={() => navigate(`/product/new`)}>
                Add New Product
              </button>
            ))}
          <input
            type="text"
            placeholder="Search Here"
            value={searchterm}
            onChange={(e) => setSearchterm(e.target.value)}
          />
        </div>
        <div>
          {allProducts.length > 0 && (
            <div className="productslist">
              <div className="eachproduct highlight">
                <h4>Product Name</h4>
                <h4>Stock</h4>
                <h4>Received Stock</h4>
                <h4>Unit of Measurement</h4>
                {userRole !== "staff" && (
                  <>
                    <h4>Per uinit Price</h4>
                    <h4>Total Price</h4>
                  </>
                )}
                <h4>Status</h4>
                <h4>Date</h4>
              </div>
              {allFilteredProducts.map((prod) => {
                if (
                  userRole === "staff" &&
                  !staffAllowedStatuses.includes(prod.status)
                ) {
                  return null; // Don't render this product for staff with disallowed status
                } else if (
                  userRole === "account" &&
                  !accountAllowedStatuses.includes(prod.status)
                ) {
                  return null;
                }
                return (
                  <div className="eachproduct">
                    <h4>{prod.name}</h4>
                    <h4>{prod.stock}</h4>
                    <h4>{prod.receivedStock}</h4>
                    <h4>{prod.unitOfMeasurement}</h4>
                    {userRole !== "staff" && (
                      <>
                        <h4>Rs {prod.perUnitPrice || 0}</h4>
                        <h4>Rs {prod.totalPrice || 0}</h4>
                      </>
                    )}
                    <h4>{prod.status}</h4>
                    <h4>{realDate(prod?.createdOn)}</h4>
                    <button
                      style={{ marginRight: 10 }}
                      onClick={() => navigate(`/product/${prod.id}`)}
                    >
                      Edit Product
                    </button>
                    <button onClick={() => navigate(`/product/${prod.id}`)}>
                      View Product
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;

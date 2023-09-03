import React, { useState, useEffect } from "react";
import db, { auth } from "../../Firebase";
import { useNavigate } from "react-router-dom";
import LeftMenu from "../LeftMenu/LeftMenu";
import "./Products.css";
import { realDate } from "../../content/helper";
import { getLocalStorageItem } from "../../content/helper";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

function Products() {
  const [allProducts, setAllProducts] = useState([]);
  const [allFilteredProducts, setAllFilteredProducts] = useState([]);
  const [searchterm, setSearchterm] = useState("");
  const [userRole, setUserRole] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const userData = getLocalStorageItem("userData");
    console.log(userData.role);
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

  const priceBodyTemplate = (allProducts) => {
    return realDate(allProducts.createdOn);
  };

  const remainingStock = (allProducts) => {
    return allProducts.stock - allProducts.receivedStock;
  };

  const perUntiPrice = (allProducts) => {
    if (userRole !== "staff") {
      return allProducts.perUnitPrice;
    }
  };

  const totalPrice = (allProducts) => {
    if (userRole !== "staff") {
      return allProducts.totalPrice;
    }
  };

  const buttonTemplate = (allProducts) => {
    return (
      <>
        <div className="actionButtons">
          <Button
            onClick={() => navigate(`/product/${allProducts.id}`)}
            label="Edit Product"
            outlined
            size="small"
          />{" "}
          <Button
            onClick={() => navigate(`/product/${allProducts.id}`)}
            label="View Product"
            outlined
            size="small"
          />
        </div>
      </>
    );
  };

  const filteredProducts = allFilteredProducts.filter((prod) => {
    if (userRole === "staff") {
      return staffAllowedStatuses.includes(prod.status);
    } else if (userRole === "account") {
      return accountAllowedStatuses.includes(prod.status);
    }
    return true; // Show all products for admin role
  });
  return (
    <div className="products">
      <LeftMenu active="products" />
      <div className="productsregion">
        <div className="addandfilter">
          {/* {userRole !== "staff" ||
            (userRole !== "account" && (
              <button onClick={() => navigate(`/product/new`)}>
                Add New Product
              </button>
            ))} */}
          {userRole === "admin" && (
            <button onClick={() => navigate(`/product/new`)}>
              Add New Product
            </button>
          )}
          <input
            type="text"
            placeholder="Search Here"
            value={searchterm}
            onChange={(e) => setSearchterm(e.target.value)}
          />
        </div>
        <div>
          <DataTable
            scrollable={true}
            scrollHeight="70vh"
            value={filteredProducts}
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column field="name" header="Product Name"></Column>
            <Column field="stock" header="Stock"></Column>
            <Column field="receivedStock" header="Received Stock"></Column>
            <Column
              field="unitOfMeasurement"
              header="Unit of Measurement"
            ></Column>
            <Column
              field="quantity"
              header="Remaining Stock"
              body={remainingStock}
            ></Column>
            <Column
              field="perUnitPrice"
              header="Per uinit Price"
              body={perUntiPrice}
            ></Column>
            <Column
              field="totalPrice"
              header="Total Price"
              body={totalPrice}
            ></Column>
            <Column field="status" header="Status"></Column>

            <Column
              field="createdOn"
              header="Date"
              body={priceBodyTemplate}
            ></Column>
            <Column field="actions" body={buttonTemplate}></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
}

export default Products;

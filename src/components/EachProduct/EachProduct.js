import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import db, { auth } from "../../Firebase";
import LeftMenu from "../LeftMenu/LeftMenu";
import { getLocalStorageItem } from "../../content/helper";
import "./EachProduct.css";

function EachProduct() {
  const orderStatus = [
    "Completed",
    "Initated",
    "Failed",
    "Patirallly_Complete",
    "cancelled",
  ];
  const { productId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    unit: "",
    perUnitPrice: "",
    totalPrice: "",
    stock: 0,
    receivedQuantity: "",
    vendor: "",
    status: orderStatus[0],
  });
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // auth.onAuthStateChanged((user) => {
    //   if (user) {
    //   } else {
    //     navigate("/");
    //   }
    // });
    const userData = getLocalStorageItem("userData");
    setUserRole(userData?.role);
  }, []);

  useEffect(() => {
    if (productId !== "new") {
      db.collection("products")
        .doc(productId)
        .get()
        .then((product) => {
          const data = product.data();
          console.log("receied data..", data);
          setFormData({
            ...formData,
            productName: data.name,
            unit: data.unitOfMeasurement,
            perUnitPrice: data.perUnitPrice,
            totalPrice: data.totalPrice,
            receivedQuantity: data.receivedStock,
            stock: data.stock,
            vendor: data.vendor,
            status: data.status,
          });
          // setProductName(product.data().name);
          // setUnit(product.data().unit);
        });
    }
  }, []);

  const saveproduct = () => {
    console.log("formData...", formData);
    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000);
    if (!formData?.productName || !formData?.unit) {
      alert("Please enter both product name and unit");
      return;
    }
    const productData = {
      createdOn: timestamp,
      name: formData.productName,
      perUnitPrice: formData?.perUnitPrice,
      receivedStock: formData?.receivedQuantity,
      status: formData?.status,
      stock: formData?.stock,
      totalPrice: parseInt(formData?.totalPrice),
      unitOfMeasurement: formData.unit,
      vendor: formData?.vendor,
    };
    if (productId === "new") {
      const newProdId = db.collection("products").doc().id;
      db.collection("products")
        .doc(newProdId)
        .set(productData)
        .then((product) => {
          alert("Product Added");
        });
    } else {
      db.collection("products")
        .doc(productId)
        .update(productData)
        .then((product) => {
          alert("Product Updated");
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="eachproducts">
      <LeftMenu />
      <div className="eachproductsregion">
        <h4>Enter Product Details</h4>
        <h5>Product Name</h5>
        <input
          disabled={userRole === "staff"}
          name="productName"
          type="text"
          placeholder="Product Name"
          value={formData?.productName}
          onChange={handleInputChange}
        />
        <h5>Unit of measurement</h5>
        <input
          disabled={userRole === "staff"}
          name="unit"
          type="text"
          placeholder="Unit"
          value={formData.unit}
          onChange={handleInputChange}
        />
        {userRole !== "staff" && (
          <>
            <h5>Per Unit Price</h5>
            <input
              name="perUnitPrice"
              type="text"
              placeholder="Per Unit Price"
              value={formData.perUnitPrice}
              onChange={handleInputChange}
            />
          </>
        )}

        {userRole !== "staff" && (
          <>
            <h5>Total Price</h5>
            <input
              name="totalPrice"
              type="text"
              placeholder="Total Price"
              value={formData.totalPrice}
              onChange={handleInputChange}
            />
          </>
        )}
        <h5>Received Quantity</h5>
        <input
          name="receivedQuantity"
          type="text"
          placeholder="Received Quantity"
          value={formData.receivedQuantity}
          onChange={handleInputChange}
        />
        <h5>Stock</h5>
        <input
          name="stock"
          type="text"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleInputChange}
        />
        <h5>Vendor</h5>
        <input
          disabled={userRole === "staff"}
          name="vendor"
          type="text"
          placeholder="Vendor"
          value={formData.vendor}
          onChange={handleInputChange}
        />

        <h5>Status</h5>
        <select
          name="status"
          value={formData?.status}
          onChange={handleInputChange}
        >
          {orderStatus?.map((item, idx) => (
            <option key={idx} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button onClick={saveproduct}>Save</button>
      </div>
    </div>
  );
}

export default EachProduct;

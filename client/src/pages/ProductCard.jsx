import React from "react";
import "./ProductCard.css";

function ProductCard({ product, addToCart }) {
  return (
    <div className="card product-card h-100">
      <img
        src={product.image || "/placeholder.svg"} // Using placeholder if no image
        className="card-img-top"
        alt={product.name || "Product image"}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{product.description}</p>
        <p className="card-text mt-auto">
          <strong>${product.price?.toFixed(2)}</strong>
        </p>
        <Button className="mt-2" onClick={() => addToCart(product)}>
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

export default ProductCard;

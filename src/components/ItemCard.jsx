import React from "react";

const ItemCard = ({ item, onAddToOrder, inCart, signedUp, quantity }) => {
  return (
    <div className="item-card">
      <img src={item.image} alt={item.name} className="item-card-img" />
      <div className="item-card-details">
        <div className="item-card-name">{item.name}</div>
        <div className="item-card-desc">{item.description}</div>
        <div className="item-card-price">₹{item.price}</div>
        <div className="item-card-actions">
          <button
            className="item-card-button"
            onClick={() => onAddToOrder(item)}
          >
            Add to Cart
          </button>
          {quantity > 0 && (
            <span style={{ marginLeft: "1em", fontWeight: 600 }}>
              In Cart: {quantity}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;

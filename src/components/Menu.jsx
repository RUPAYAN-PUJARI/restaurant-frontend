import React, { useState } from "react";
import ItemCard from "./ItemCard";

const categoryOptions = [
  "All",
  "Starters",
  "Main Course",
  "Dessert",
  "Drinks",
  "Today's Specials",
];

const Menu = ({ menu, onAddToOrder, orderItems, signedUp }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);

  // Flatten all items with category/type and ensure unique id
  const allItems = menu.reduce((acc, cat) => {
    acc.push(
      ...cat.veg.map((item) => ({
        ...item,
        category: cat.category,
        type: "Veg",
        id: item.id || `${cat.category}-veg-${item.name}`,
      }))
    );
    acc.push(
      ...cat.nonveg.map((item) => ({
        ...item,
        category: cat.category,
        type: "Non-Veg",
        id: item.id || `${cat.category}-nonveg-${item.name}`,
      }))
    );
    return acc;
  }, []);

  // Filter logic
  const filteredItems = allItems.filter((item) => {
    const categoryMatch =
      selectedCategory === "All" ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();
    const vegMatch = !vegOnly || item.type === "Veg";
    return categoryMatch && vegMatch;
  });

  return (
    <div className="menu-section">
      <img
        src="/menu_banner.png"
        alt="Menu Banner"
        className="menu-banner-img"
        style={{
          width: "100%",
          maxHeight: "450px",
          objectFit: "cover",
          borderRadius: "1.5em",
          marginBottom: "2em",
          boxShadow: "0 4px 24px 0 rgba(31, 38, 135, 0.10)",
        }}
      />
      <div
        className="menu-filter-bar"
        style={{
          display: "flex",
          gap: "1.5rem",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <label htmlFor="category-select" style={{ fontWeight: 600 }}>
          Category:
        </label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: "0.5em 1em",
            borderRadius: "8px",
            border: "1.5px solid #90caf9",
            fontSize: "1em",
          }}
        >
          {categoryOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <button
          className={vegOnly ? "veg-toggle active" : "veg-toggle"}
          style={{
            padding: "0.5em 1.2em",
            borderRadius: "8px",
            border: vegOnly ? "2px solid #43a047" : "2px solid #90caf9",
            background: vegOnly ? "#e8f5e9" : "#fff",
            color: vegOnly ? "#43a047" : "#1976d2",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "1em",
            transition: "all 0.18s",
          }}
          onClick={() => setVegOnly((v) => !v)}
        >
          Veg Only
        </button>
      </div>
      <div className="menu-list">
        {filteredItems.map((item, idx) => {
          const cartItem = orderItems.find(
            (cartItem) => cartItem.name === item.name
          );
          return (
            <ItemCard
              key={item.name}
              item={item}
              onAddToOrder={onAddToOrder}
              inCart={!!cartItem}
              signedUp={signedUp}
              quantity={cartItem ? cartItem.quantity : 0}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Menu;

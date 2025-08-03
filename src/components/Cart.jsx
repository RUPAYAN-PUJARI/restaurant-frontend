import React, { useState, useEffect } from "react"; // <-- add useEffect

const Cart = ({
  orderItems,
  setOrderItems,
  user,
  setUser,
  signedUp,
  setSignedUp,
  updateQuantity,
  removeFromOrder,
  onSignOut, // <-- add onSignOut prop
}) => {
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const totalPrice = orderItems.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!user.name || !user.phone || !user.address) {
      setMessage("All fields are required.");
      return;
    }
    try {
      const res = await fetch(
        "https://restaurant-backend-w0eu.onrender.com/api/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.name,
            phone: user.phone,
            address: user.address,
            cart: orderItems,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage("Sign-up successful! You can now checkout.");
        setSignedUp(true);
        setOrderItems(data.cart || []); // <-- optionally update cart
      } else {
        setMessage(data.error || "Sign-up failed.");
      }
    } catch (err) {
      setMessage("Sign-up failed. Server error.");
    }
  };

  // 🔥 NEW: Fetch cart when signed in
  useEffect(() => {
    const fetchUserCart = async () => {
      if (user.phone && signedUp) {
        try {
          const res = await fetch(
            `https://restaurant-backend-w0eu.onrender.com/api/users/${user.phone}`
          );
          const data = await res.json();
          if (res.ok) {
            setOrderItems(data.cart || []);
          } else {
            console.error("Failed to fetch cart:", data.error);
          }
        } catch (err) {
          console.error("Error fetching cart:", err);
        }
      }
    };

    fetchUserCart();
  }, [user.phone, signedUp, setOrderItems]);

  const handleCheckout = async () => {
    if (!user.name || !user.phone || !user.address || orderItems.length === 0) {
      setMessage("Incomplete order data.");
      return;
    }

    try {
      const res = await fetch(
        "https://restaurant-backend-w0eu.onrender.com/api/orders",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.name,
            phone: user.phone,
            address: user.address,
            cart: orderItems, // ✅ this is the correct key
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMessage("Checkout complete! Thank you for your order.");
        setOrderItems([]); // ✅ clear cart after checkout
      } else {
        setMessage(data.error || "Checkout failed.");
      }
    } catch (err) {
      setMessage("Server error during checkout.");
    }
  };

  useEffect(() => {
    if (message) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
        setMessage("");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="cart-container">
      <div className="cart-title">Your Cart</div>
      {orderItems.length === 0 ? (
        <div className="cart-empty">
          Your cart is empty. Add some delicious items!
        </div>
      ) : (
        <ul className="cart-items-list">
          {orderItems.map((item, idx) => (
            <li key={idx} className="cart-item-card">
              <div className="cart-item-details">
                <span className="cart-item-name">{item.name}</span>
                <span className="cart-item-qty">Qty: {item.quantity || 1}</span>
                <span className="cart-item-price">
                  ${item.price * (item.quantity || 1)}
                </span>
              </div>
              <div className="cart-item-actions">
                <button
                  className="cart-action-btn"
                  onClick={() =>
                    updateQuantity(item.name, (item.quantity || 1) - 1)
                  }
                  disabled={(item.quantity || 1) <= 1}
                >
                  -
                </button>
                <button
                  className="cart-action-btn"
                  onClick={() =>
                    updateQuantity(item.name, (item.quantity || 1) + 1)
                  }
                >
                  +
                </button>
                <button
                  className="cart-action-btn"
                  onClick={() => removeFromOrder(item.name)}
                  style={{ marginLeft: "1em" }}
                >
                  &times;
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {orderItems.length > 0 && (
        <div className="cart-summary">
          <div className="cart-total">Total: ${totalPrice}</div>
          <button
            className="order-btn"
            onClick={handleCheckout}
            disabled={orderItems.length === 0}
          >
            Checkout
          </button>
        </div>
      )}
      {!signedUp && (
        <form
          className="signup-form"
          onSubmit={handleSignup}
          style={{ marginBottom: "1.5em" }}
        >
          <h3>Sign In to Checkout</h3>
          <input
            type="text"
            placeholder="Name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
            className="cart-input"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={user.phone}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            required
            className="cart-input"
          />
          <input
            type="text"
            placeholder="Address"
            value={user.address}
            onChange={(e) => setUser({ ...user, address: e.target.value })}
            required
            className="cart-input"
          />
          <button type="submit" className="order-btn signin-btn">
            Sign In
          </button>
        </form>
      )}
      {signedUp && (
        <button
          className="order-btn signout-btn"
          onClick={onSignOut}
          style={{ marginBottom: "1em" }}
        >
          Sign Out
        </button>
      )}
      {message && (
        <div className={`message-float${showMessage ? " show" : ""}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Cart;

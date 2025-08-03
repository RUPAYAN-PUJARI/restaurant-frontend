import Menu from "./components/Menu";
import Reservation from "./components/Reservation";
import Events from "./components/Events";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import menuData from "./readme.json";
import Cart from "./components/Cart";

function App() {
  const [menu, setMenu] = useState(menuData.menu || []);
  const [events, setEvents] = useState(menuData.events || []);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [user, setUser] = useState({ name: "", phone: "", address: "" });
  const [signedUp, setSignedUp] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const [sessionId] = useState(() => {
    let id = localStorage.getItem("sessionId");
    if (!id) {
      id = Math.random().toString(36).substr(2, 9);
      localStorage.setItem("sessionId", id);
    }
    return id;
  });

  // Restore user and cart on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedSignedUp = localStorage.getItem("signedUp");

    if (storedUser && storedSignedUp === "true") {
      const userObj = JSON.parse(storedUser);
      setUser(userObj);
      setSignedUp(true);
      fetch(
        `https://restaurant-backend-w0eu.onrender.com/api/users/${userObj.name}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.cart) setOrderItems(data.cart);
        });
    } else {
      const storedCart = localStorage.getItem("orderItems");
      if (storedCart) {
        setOrderItems(JSON.parse(storedCart));

        fetch(
          `https://restaurant-backend-w0eu.onrender.com/api/users/${sessionId}`
        )
          .then((res) => {
            if (res.ok) return res.json();
            else throw new Error("Anonymous session not found");
          })
          .then((data) => {
            if (data.cart) setOrderItems(data.cart);
          })
          .catch((err) =>
            console.log("Anonymous session skipped:", err.message)
          );
      }
    }
  }, []);

  // Sync cart to backend (user or session)
  useEffect(() => {
    localStorage.setItem("orderItems", JSON.stringify(orderItems));

    const payload =
      signedUp && user.name
        ? {
            name: user.name,
            phone: user.phone,
            address: user.address,
            cart: orderItems,
          }
        : { name: sessionId, phone: "", address: "", cart: orderItems };

    fetch("https://restaurant-backend-w0eu.onrender.com/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }, [orderItems]);

  const handleSignup = async (userData) => {
    try {
      const res = await fetch(
        `https://restaurant-backend-w0eu.onrender.com/api/users/${userData.name}`
      );
      if (res.ok) {
        const data = await res.json();
        setUser({ name: data.name, phone: data.phone, address: data.address });
        setSignedUp(true);
        if (data.cart) setOrderItems(data.cart);
      } else {
        const postRes = await fetch(
          "https://restaurant-backend-w0eu.onrender.com/api/users",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...userData, cart: orderItems }),
          }
        );
        if (postRes.ok) {
          setUser(userData);
          setSignedUp(true);
        }
      }
    } catch (err) {
      setMessage("Signup failed.");
    }
  };

  const handleSignin = async (userData) => {
    try {
      const res = await fetch(
        "https://restaurant-backend-w0eu.onrender.com/api/signin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );
      const resData = await res.json();
      if (res.ok) {
        setUser({
          name: resData.name,
          phone: resData.phone,
          address: resData.address,
        });
        setSignedUp(true);

        // 🧠 Rename variable to avoid name clash
        const userRes = await fetch(
          `https://restaurant-backend-w0eu.onrender.com/api/users/${resData.name}`
        );
        const fetchedUserData = await userRes.json();

        setOrderItems(fetchedUserData.cart || []);

        localStorage.setItem("user", JSON.stringify(resData));
        localStorage.setItem("signedUp", "true");
        localStorage.setItem(
          "orderItems",
          JSON.stringify(fetchedUserData.cart || [])
        );
      } else {
        setMessage(resData.error || "Sign-in failed.");
      }
    } catch (err) {
      setMessage("Sign-in failed. Server error.");
    }
  };

  const addToOrder = (item) => {
    setOrderItems((prev) => {
      const idx = prev.findIndex((cartItem) => cartItem.name === item.name);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        return updated;
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromOrder = (itemName) => {
    setOrderItems((prev) => prev.filter((item) => item.name !== itemName));
  };

  const updateQuantity = (itemName, qty) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.name === itemName ? { ...item, quantity: qty } : item
      )
    );
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(
        "https://restaurant-backend-w0eu.onrender.com/api/orders",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart: orderItems,
            name: user.name,
            phone: user.phone,
            address: user.address,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage("Order placed successfully!");
        setOrderItems([]);
        localStorage.setItem("orderItems", JSON.stringify([]));
        if (signedUp && user.name) {
          await fetch(
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
        }
      } else {
        setMessage(data.error || "Order failed.");
      }
    } catch (err) {
      setMessage("Order failed. Server error.");
    }
    setLoading(false);
  };

  const handleReserve = async (reservation) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(
        "https://restaurant-backend-w0eu.onrender.com/api/reservations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reservation),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage("Reservation successful!");
      } else {
        setMessage(data.error || "Reservation failed.");
      }
    } catch (err) {
      setMessage("Reservation failed. Server error.");
    }
    setLoading(false);
  };

  const handleSignOut = () => {
    setUser({ name: "", phone: "", address: "" });
    setSignedUp(false);
    setOrderItems([]);
    localStorage.removeItem("user");
    localStorage.removeItem("signedUp");
    localStorage.removeItem("orderItems");
    setMessage("Signed out successfully.");
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
    <Router>
      <div className="App">
        <nav className="navbar">
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/menu">Menu</Link>
            </li>
            <li>
              <Link to="/cart">My Cart</Link>
            </li>
            <li>
              <Link to="/reservation">Reservation</Link>
            </li>
            <li>
              <Link to="/events">Upcoming Events</Link>
            </li>
            {/* Sign Out button removed from navbar as requested */}
          </ul>
        </nav>

        {/* Floating message for global notifications */}
        {message && (
          <div className={`message-float${showMessage ? " show" : ""}`}>
            {message}
          </div>
        )}
        {loading && <div className="loading">Processing...</div>}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/menu"
            element={
              <div className="main-content centered">
                <Menu
                  menu={menu}
                  onAddToOrder={addToOrder}
                  orderItems={orderItems}
                  signedUp={signedUp}
                />
              </div>
            }
          />
          <Route
            path="/reservation"
            element={<Reservation onReserve={handleReserve} />}
          />
          <Route
            path="/cart"
            element={
              <Cart
                orderItems={orderItems}
                setOrderItems={setOrderItems}
                onOrderSubmit={handleOrderSubmit}
                user={user}
                setUser={setUser}
                signedUp={signedUp}
                setSignedUp={setSignedUp}
                updateQuantity={updateQuantity}
                removeFromOrder={removeFromOrder}
                onSignOut={handleSignOut}
              />
            }
          />
          <Route path="/events" element={<Events events={events} />} />
        </Routes>

        <footer className="footer">
          <div>
            Chef's Lair &copy; 2025 | 123 Main St, Food City | Phone: (123)
            456-7890
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;

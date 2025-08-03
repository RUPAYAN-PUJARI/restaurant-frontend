import React, { useState } from "react";
import restaurant1 from "../assets/restaurant1.jpg";
import restaurant2 from "../assets/restaurant2.jpg";
import springrolls from "/spring_rolls.jpg";

const Reservation = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: 1,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://restaurant-backend-w0eu.onrender.com/api/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage("✅ Reservation successful!");
        setForm({ name: "", phone: "", date: "", time: "", guests: 1 });
      } else {
        setMessage("❌ " + result.error);
      }
    } catch (error) {
      setMessage("❌ Something went wrong.");
      console.error("Reservation error:", error);
    }
  };

  return (
    <div className="reservation-page-row reservation-page-row--centered">
      <div className="reservation-section">
        <h2>Make a Reservation</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
          />
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
          />
          <input
            name="time"
            type="time"
            value={form.time}
            onChange={handleChange}
            required
          />
          <input
            name="guests"
            type="number"
            min="1"
            value={form.guests}
            onChange={handleChange}
            required
          />
          <button type="submit">Reserve</button>
        </form>
        {message && <p style={{ marginTop: "10px" }}>{message}</p>}
      </div>
    </div>
  );
};

export default Reservation;

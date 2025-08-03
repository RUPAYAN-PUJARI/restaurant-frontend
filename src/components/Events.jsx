import React from "react";

const defaultEventImg = "/event_default.jpg";

const Events = ({ events }) => (
  <div className="events-section">
    <h2>Upcoming Events</h2>
    <ul className="events-list">
      {events.map((event, idx) => (
        <li key={idx} className="event-item">
          <div className="event-card">
            <img
              src={event.image || defaultEventImg}
              alt={event.title}
              className="event-img"
            />
            <div className="event-info">
              <div className="event-title">{event.title}</div>
              <div className="event-date">{event.date}</div>
              <div className="event-desc">{event.description}</div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default Events;

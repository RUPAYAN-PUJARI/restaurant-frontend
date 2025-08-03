import React, { useState } from "react";
import { Link } from "react-router-dom";
import street_view from "../assets/street_view.png";
import restaurant1 from "../assets/restaurant1.jpg";
import restaurant2 from "../assets/restaurant2.jpg";
import restaurant3 from "../assets/restaurant3.jpg";
import roganjosh from "/mutton_rogan_josh.jpg";
import vegbiryani from "/veg_biryani.jpg";
import tiramisu from "/tiramisu.jpg";

const galleryImages = [restaurant1, restaurant2, restaurant3];
const foodImages = [vegbiryani, roganjosh, tiramisu];

function Home() {
  const [current, setCurrent] = useState(0);
  const [currentFood, setCurrentFood] = useState(0);
  const next = () => setCurrent((c) => (c + 1) % galleryImages.length);
  const prev = () =>
    setCurrent((c) => (c - 1 + galleryImages.length) % galleryImages.length);
  const nextFood = () => setCurrentFood((c) => (c + 1) % foodImages.length);
  const prevFood = () =>
    setCurrent((c) => (c - 1 + foodImages.length) % foodImages.length);

  return (
    <div className="home-page">
      <img
        src="/home-banner.png"
        alt="Chef's Lair Banner"
        className="home-banner"
      />
      <div className="gallery-row">
        {/* Left review boxes */}
        <div className="gallery-review-column">
          <div className="gallery-review-box left">
            <img
              src="/john_doe.png"
              alt="Reviewer 1"
              className="reviewer-img"
            />
            <div className="gallery-review-text">
              Great ambiance and delicious food!
              <br />
              Friendly staff and a cozy atmosphere.
              <br />
              Perfect for family dinners or date nights.
            </div>
            <div className="gallery-review-author">- John Doe</div>
          </div>
          <div className="gallery-review-box left">
            <img
              src="/priya_singh.png"
              alt="Reviewer 2"
              className="reviewer-img"
            />
            <div className="gallery-review-text">
              The desserts are to die for!
              <br />
              Loved the quick service and beautiful interiors.
              <br />
              Will visit again soon.
            </div>
            <div className="gallery-review-author">- Priya Singh</div>
          </div>
        </div>
        {/* Gallery center */}
        <div className="gallery-container-parent">
          <div className="gallery-container">
            <button className="gallery-arrow" onClick={prev}>
              &lt;
            </button>
            <img
              src={galleryImages[current]}
              alt="Restaurant"
              className="gallery-image"
            />
            <button className="gallery-arrow-right" onClick={next}>
              &gt;
            </button>
          </div>
          <div className="gallery-container">
            <button className="gallery-arrow" onClick={prevFood}>
              &lt;
            </button>
            <img
              src={foodImages[currentFood]}
              alt="Restaurant"
              className="gallery-image"
            />
            <button className="gallery-arrow-right" onClick={nextFood}>
              &gt;
            </button>
          </div>
        </div>
        {/* Right review boxes */}
        <div className="gallery-review-column">
          <div className="gallery-review-box right">
            <img
              src="mary_jane.png"
              alt="Reviewer 3"
              className="reviewer-img"
            />
            <div className="gallery-review-text">
              I am absolutely in love with the food at Chef's Lair!
              <br />
              The flavors are exquisite and the presentation is top-notch.
            </div>
            <div className="gallery-review-author">- Mary Jane</div>
          </div>
          <div className="gallery-review-box right">
            <img
              src="/alex_kim.png"
              alt="Reviewer 4"
              className="reviewer-img"
            />
            <div className="gallery-review-text">
              The appetizers are amazing!
              <br />
              Loved the spring rolls and the ambiance.
              <br />
              Highly recommended for foodies.
            </div>
            <div className="gallery-review-author">- Alex Kim</div>
          </div>
        </div>
      </div>
      <div className="gallery-row">
        <div
          className="home-section"
          style={{
            backgroundImage: `linear-gradient(120deg, rgba(250,253,255,0.10) 60%, rgba(227,233,247,0.10) 100%), url("/spring_rolls.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "340px",
            minWidth: "340px",
            maxWidth: "900px",
            width: "90vw",
            margin: "0rem auto 2rem auto",
          }}
        >
          <h2>
            Experience the true essence of fine dining with our delicious menu.
            Savour the taste of every bite.
          </h2>
          <Link to="/menu" className="view-menu-link">
            View Menu 👉
          </Link>
        </div>
        <div
          className="home-section"
          style={{
            backgroundImage: `linear-gradient(120deg, rgba(250,253,255,0.10) 60%, rgba(227,233,247,0.10) 100%), url("/stuffed_bell_peppers.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            maxHeight: "370px",
            maxWidth: "300px",
            margin: "0rem auto 2rem auto",
          }}
        >
          <h2>Try our today's specials</h2>
          <Link to="/menu" className="view-menu-link">
            Try Now 👉
          </Link>
        </div>
      </div>
      <div className="contact-section">
        <img src={street_view} alt="Street View" className="street-view" />
        <div className="contact-map-section">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.123456789012!2d-122.419415684681!3d37.774929779759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c8b8b8b8b%3A0x8b8b8b8b8b8b8b8b!2sChef's%20Lair%20Restaurant!5e0!3m2!1sen!2sus!4v1616161616161"
            width="300"
            height="350"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
        <div className="contact-location-section">
          <h3>Contact & Location</h3>
          <p>123 Main St, Food City</p>
          <p>Phone: (123) 456-7890</p>
          <p>Email: info@chefslair.com</p>
          <p>Open: 11:00 AM - 11:00 PM, All Days</p>
        </div>
      </div>
    </div>
  );
}

export default Home;

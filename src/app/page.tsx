"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Image from "next/image";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import "../styles/pages/homePage.css";

// ---------- Types ----------
interface Luthier {
  id: number;
  name: string;
  type: string;
  bio: string;
  location: string;
  photo_url: string;
}

interface InstrumentMedia {
  id: number;
  instrument_id: number;
  url: string;
}

interface Instrument {
  id: number;
  title: string;
  year_built: number;
  condition: string;
  price: number;
  location: string;
  luthier_name: string;
  media: InstrumentMedia[];
}

export default function HomePage() {
  const [featuredLuthiers, setFeaturedLuthiers] = useState<Luthier[]>([]);
  const [featuredInstruments, setFeaturedInstruments] = useState<Instrument[]>([]);

  // Fetch featured luthiers
  useEffect(() => {
    fetch("/api/featured_luthiers")
      .then((res) => res.json())
      .then((data: Luthier[]) => {
        console.log("Fetched luthiers:", data);
        setFeaturedLuthiers(data);
      })
      .catch((err) => console.error("Error fetching luthiers:", err));
  }, []);

  // Fetch featured instruments
  useEffect(() => {
    fetch("/api/featured_instruments")
      .then((res) => res.json())
      .then((data: Instrument[]) => {
        console.log("Fetched instruments:", data);
        setFeaturedInstruments(data);
      })
      .catch((err) => console.error("Error fetching instruments:", err));
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <h1>Discover Luthiers Near You</h1>
        <p>
          Explore a world of hand-crafted violins, cellos, and bows—right in your
          neighborhood.
        </p>
        <button className="explore-btn">Explore Luthiers</button>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-icon">🔍</div>
            <h3>1. Search</h3>
            <p>Find luthiers or shops based on your location or preferences.</p>
          </div>
          <div className="step">
            <div className="step-icon">⚖️</div>
            <h3>2. Compare</h3>
            <p>View profiles, read reviews, and compare instruments and bows.</p>
          </div>
          <div className="step">
            <div className="step-icon">🤝</div>
            <h3>3. Connect</h3>
            <p>
              Reach out to luthiers to schedule visits or ask questions directly.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Luthiers */}
      <section className="featured">
        <h2>Featured Luthiers</h2>
        {featuredLuthiers.length === 0 ? (
          <p>No luthiers found.</p>
        ) : (
          <Slider
            dots
            infinite
            speed={500}
            slidesToShow={5}
            slidesToScroll={1}
            autoplay
            autoplaySpeed={10000}
            responsive={[
              { breakpoint: 1024, settings: { slidesToShow: 2 } },
              { breakpoint: 600, settings: { slidesToShow: 1 } },
            ]}
          >
            {featuredLuthiers.map((l) => (
              <div className="card" key={l.id}>
                <div className="photo-wrapper">
                  <Image
                    src={
                      l.photo_url?.startsWith("http")
                        ? l.photo_url
                        : `/uploads/luthiers/${l.photo_url || "placeholder.jpg"}`
                    }
                    alt={l.name}
                    className="luthier-photo"
                    width={200}
                    height={200}
                  />
                </div>
                <div className="card-info">
                  <h4>{l.name}</h4>
                  <p>
                    <strong>Type:</strong> {l.type}
                  </p>
                  <p>
                    <strong>Location:</strong> {l.location}
                  </p>
                  <p className="bio">{l.bio}</p>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </section>

      {/* Featured Instruments */}
      <section className="featured">
        <h2>Featured Instruments</h2>
        {featuredInstruments.length === 0 ? (
          <p>No instruments found.</p>
        ) : (
          <Slider
            dots
            infinite
            speed={500}
            slidesToShow={5}
            slidesToScroll={1}
            autoplay
            autoplaySpeed={3500}
            responsive={[
              { breakpoint: 1024, settings: { slidesToShow: 2 } },
              { breakpoint: 600, settings: { slidesToShow: 1 } },
            ]}
          >
            {featuredInstruments.map((inst) => (
              <div className="card instrument-card" key={inst.id}>
                {/* Image carousel inside card */}
                <Slider
                  dots
                  infinite
                  speed={500}
                  slidesToShow={1}
                  slidesToScroll={1}
                  arrows={false}
                >
                  {inst.media?.map((m) => (
                    <div key={m.id} className="instrument-photo-wrapper">
                      <Image
                        src={
                          m.url?.startsWith("http")
                            ? m.url
                            : `/uploads/instruments/${m.url || "placeholder.jpg"}`
                        }
                        alt={inst.title}
                        className="instrument-photo"
                        width={300}
                        height={200}
                      />
                    </div>
                  ))}
                </Slider>

                {/* Info */}
                <div className="instrument-info">
                  <h4>
                    {inst.title} ({inst.year_built})
                  </h4>
                  <p>
                    <strong>Condition:</strong> {inst.condition}
                  </p>
                  <p>
                    <strong>Price:</strong> €
                    {Number(inst.price).toLocaleString()}
                  </p>
                  <p>
                    <strong>Location:</strong> {inst.location}
                  </p>
                  <p>
                    <strong>Luthier:</strong> {inst.luthier_name}
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </section>
    </div>
  );
}

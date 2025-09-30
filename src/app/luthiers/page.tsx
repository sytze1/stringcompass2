"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "../../styles/pages/luthiersPage.css";

interface Luthier {
  id: number;
  name: string;
  type: string;
  bio: string;
  location: string;
  photo_url: string;
}

export default function LuthiersPage() {
  const [luthiers, setLuthiers] = useState<Luthier[]>([]);

  useEffect(() => {
    fetch("/api/luthiers")
      .then((res) => res.json())
      .then((data: Luthier[]) => setLuthiers(data))
      .catch((err) => console.error("Error fetching luthiers:", err));
  }, []);

  return (
    <div className="luthiers-page">
      <h1>All Luthiers</h1>
      <div className="luthiers-grid">
        {luthiers.map((l) => (
          <div className="luthier-card" key={l.id}>
            <div className="photo-wrapper">
              <Image
                src={l.photo_url}
                alt={l.name}
                className="luthier-photo"
                width={250}
                height={180}
              />
            </div>
            <div className="card-info">
              <h3>{l.name}</h3>
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
      </div>
    </div>
  );
}

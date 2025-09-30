"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import "../../styles/pages/luthiersPage.css";

const LuthierMap = dynamic(() => import("@/components/luthier-map"), {
  ssr: false,
});

interface RawLuthier {
  id: number;
  userId: number | null;
  name: string;
  type: string;
  bio: string | null;
  website: string | null;
  verified: boolean;
  createdAt: string;
  street: string | null;
  houseNumber: string | null;
  postcode: string | null;
  city: string | null;
  country: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  photoUrl: string | null;
  instruments: string[] | null;
}

export interface Luthier extends Omit<RawLuthier, "latitude" | "longitude"> {
  latitude: number;
  longitude: number;
  instruments: string[];
}

interface LuthierWithDistance extends Luthier {
  distanceKm: number | null;
}

type UserLocation = {
  lat: number;
  lon: number;
  label: string;
};

const EARTH_RADIUS_KM = 6371;
const DEFAULT_SEARCH = "Amsterdam";

interface GeocodeResult {
  lat: string;
  lon: string;
  display_name: string;
}

const toRadians = (deg: number) => (deg * Math.PI) / 180;

function haversineDistance(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number }
) {
  const dLat = toRadians(b.lat - a.lat);
  const dLon = toRadians(b.lon - a.lon);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);

  const aVal =
    sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;
  const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
  return EARTH_RADIUS_KM * c;
}

function formatAddress(luthier: Luthier) {
  const street = [luthier.street, luthier.houseNumber]
    .filter(Boolean)
    .join(" ");
  const cityLine = [luthier.postcode, luthier.city].filter(Boolean).join(" ");
  const parts = [street, cityLine, luthier.country].filter(Boolean);
  return parts.join(", ");
}

const INSTRUMENT_FILTERS = [
  { value: "violin", label: "Violins" },
  { value: "viola", label: "Violas" },
  { value: "cello", label: "Cellos" },
  { value: "contrabass", label: "Contrabasses" },
] as const;

type InstrumentFilterValue = (typeof INSTRUMENT_FILTERS)[number]["value"];

const instrumentMatchers: Record<InstrumentFilterValue, (name: string) => boolean> = {
  violin: (name) => name.includes("violin"),
  viola: (name) => name.includes("viola"),
  cello: (name) => name.includes("cello"),
  contrabass: (name) => name.includes("bass") || name.includes("contra"),
};

function matchesInstrumentFilter(
  instruments: string[],
  filter: InstrumentFilterValue
) {
  if (instruments.length === 0) return false;
  const normalized = instruments.map((instrument) => instrument.toLowerCase());
  return normalized.some((name) => instrumentMatchers[filter](name));
}

function formatInstrumentList(instruments: string[]) {
  const unique = Array.from(new Set(
    instruments.map((instrument) => instrument.trim()).filter((instrument) => instrument.length > 0)
  ));

  if (unique.length === 0) return "";

  return unique
    .map((instrument) =>
      instrument
        .split(/[_\s-]+/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    )
    .join(", ");
}

export default function LuthiersPage() {
  const [luthiers, setLuthiers] = useState<Luthier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState(DEFAULT_SEARCH);
  const [searchStatus, setSearchStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [distanceFilterEnabled, setDistanceFilterEnabled] = useState(false);
  const [maxDistanceKm, setMaxDistanceKm] = useState(150);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [selectedInstrumentTypes, setSelectedInstrumentTypes] =
    useState<Set<InstrumentFilterValue>>(new Set());
  const [onlyVerified, setOnlyVerified] = useState(false);

  useEffect(() => {
    async function loadLuthiers() {
      try {
        setLoading(true);
        const res = await fetch("/api/luthiers");
        if (!res.ok) {
          throw new Error("Failed to fetch luthiers");
        }
        const data: RawLuthier[] = await res.json();
        const normalized = data
          .map((item) => ({
            ...item,
            latitude: item.latitude == null ? NaN : Number(item.latitude),
            longitude: item.longitude == null ? NaN : Number(item.longitude),
            instruments: Array.isArray(item.instruments)
              ? item.instruments.filter((instrument): instrument is string => Boolean(instrument))
              : [],
          }))
          .filter((item) => !Number.isNaN(item.latitude) && !Number.isNaN(item.longitude));
        setLuthiers(normalized);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Er ging iets mis bij het ophalen van de luthiergegevens.");
      } finally {
        setLoading(false);
      }
    }

    loadLuthiers();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function performInitialSearch() {
      const initialQuery = DEFAULT_SEARCH;
      if (!initialQuery) return;
      try {
        setSearchStatus("loading");
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(initialQuery)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Geocoding mislukt");
        const payload: GeocodeResult[] = await res.json();
        if (payload.length === 0) {
          setSearchStatus("error");
          return;
        }
        const match = payload[0];
        setUserLocation({
          lat: Number(match.lat),
          lon: Number(match.lon),
          label: match.display_name,
        });
        setSearchStatus("success");
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error(err);
        setSearchStatus("error");
      }
    }

    performInitialSearch();

    return () => controller.abort();
  }, []);

  const typeOptions = useMemo(() => {
    return Array.from(new Set(luthiers.map((item) => item.type))).sort();
  }, [luthiers]);

  const countryOptions = useMemo(() => {
    const countries = Array.from(
      new Set(luthiers.map((item) => item.country).filter(Boolean))
    ) as string[];
    return ["All", ...countries.sort()];
  }, [luthiers]);

  const luthiersWithDistance: LuthierWithDistance[] = useMemo(() => {
    return luthiers.map((luthier) => {
      if (!userLocation) {
        return { ...luthier, distanceKm: null };
      }
      const distance = haversineDistance(userLocation, {
        lat: luthier.latitude,
        lon: luthier.longitude,
      });
      return { ...luthier, distanceKm: distance };
    });
  }, [luthiers, userLocation]);

  const filteredLuthiers = useMemo(() => {
    return luthiersWithDistance
      .filter((luthier) => {
        if (selectedTypes.size === 0) return true;
        return selectedTypes.has(luthier.type);
      })
      .filter((luthier) => {
        if (selectedInstrumentTypes.size === 0) return true;
        return Array.from(selectedInstrumentTypes).some((value) =>
          matchesInstrumentFilter(luthier.instruments, value)
        );
      })
      .filter((luthier) => {
        if (!onlyVerified) return true;
        return luthier.verified;
      })
      .filter((luthier) => {
        if (selectedCountry === "All") return true;
        return luthier.country === selectedCountry;
      })
      .filter((luthier) => {
        if (!distanceFilterEnabled || !userLocation) return true;
        if (luthier.distanceKm == null) return false;
        return luthier.distanceKm <= maxDistanceKm;
      })
      .sort((a, b) => {
        if (a.distanceKm != null && b.distanceKm != null) {
          return a.distanceKm - b.distanceKm;
        }
        if (a.distanceKm != null) return -1;
        if (b.distanceKm != null) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [
    luthiersWithDistance,
    selectedTypes,
    selectedInstrumentTypes,
    onlyVerified,
    selectedCountry,
    distanceFilterEnabled,
    userLocation,
    maxDistanceKm,
  ]);

  const mapLocations = useMemo(() => {
    return filteredLuthiers.map((luthier) => ({
      id: luthier.id,
      name: luthier.name,
      type: luthier.type,
      latitude: luthier.latitude,
      longitude: luthier.longitude,
      distanceKm: luthier.distanceKm,
      city: luthier.city,
      country: luthier.country,
    }));
  }, [filteredLuthiers]);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!searchQuery) return;

    try {
      setSearchStatus("loading");
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error("Geocoding mislukt");
      const payload: GeocodeResult[] = await res.json();
      if (payload.length === 0) {
        setSearchStatus("error");
        return;
      }
      const match = payload[0];
      setUserLocation({
        lat: Number(match.lat),
        lon: Number(match.lon),
        label: match.display_name,
      });
      setSearchStatus("success");
    } catch (err) {
      console.error(err);
      setSearchStatus("error");
    }
  }

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setSearchStatus("error");
      return;
    }
    setSearchStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          label: "Uw huidige locatie",
        });
        setSearchStatus("success");
      },
      (err) => {
        console.error(err);
        setSearchStatus("error");
      },
      { enableHighAccuracy: true }
    );
  }

  function toggleType(type: string) {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }

  function toggleInstrumentType(value: InstrumentFilterValue) {
    setSelectedInstrumentTypes((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  }

  function clearFilters() {
    setSelectedTypes(new Set());
    setSelectedCountry("All");
    setDistanceFilterEnabled(false);
    setMaxDistanceKm(150);
    setSelectedInstrumentTypes(new Set());
    setOnlyVerified(false);
  }

  return (
    <div className="luthiers-page">
      <section className="luthiers-header">
        <div>
          <h1>Vind luthiers bij jou in de buurt</h1>
          <p>
            Vul je locatie in en ontdek vioolbouwers, strijkinstrumentmakers en
            ateliers in de omgeving. Filter op specialisatie om een luthier te
            vinden die bij jouw instrument past.
          </p>
        </div>
        <form className="luthiers-search" onSubmit={handleSearch}>
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Zoek op stad, postcode of adres"
            aria-label="Zoek naar een locatie"
          />
          <button type="submit" disabled={searchStatus === "loading"}>
            {searchStatus === "loading" ? "Zoeken…" : "Zoek"}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={handleUseMyLocation}
            disabled={searchStatus === "loading"}
          >
            Gebruik mijn locatie
          </button>
        </form>
        {userLocation && (
          <p className="luthiers-location-note">
            Resultaten voor: <strong>{userLocation.label}</strong>
          </p>
        )}
        {searchStatus === "error" && (
          <p className="luthiers-error">
            We konden deze locatie niet vinden. Probeer een andere zoekopdracht.
          </p>
        )}
      </section>

      <div className="luthiers-content">
        <aside className="luthiers-filters">
          <div className="filters-header">
            <h2>Filter</h2>
            <button type="button" onClick={clearFilters} className="link">
              Reset
            </button>
          </div>

          <div className="filter-group">
            <h3>Specialisatie</h3>
            {typeOptions.length === 0 && <p className="muted">Geen opties.</p>}
            <div className="filter-options">
              {typeOptions.map((type) => (
                <label key={type} className="filter-option">
                  <input
                    type="checkbox"
                    checked={selectedTypes.has(type)}
                    onChange={() => toggleType(type)}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h3>Instrumenten</h3>
            <div className="filter-options">
              {INSTRUMENT_FILTERS.map(({ value, label }) => (
                <label key={value} className="filter-option">
                  <input
                    type="checkbox"
                    checked={selectedInstrumentTypes.has(value)}
                    onChange={() => toggleInstrumentType(value)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h3>Status</h3>
            <label className="filter-option">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(event) => setOnlyVerified(event.target.checked)}
              />
              Alleen geverifieerde luthiers
            </label>
          </div>

          <div className="filter-group">
            <h3>Land</h3>
            <select
              value={selectedCountry}
              onChange={(event) => setSelectedCountry(event.target.value)}
            >
              {countryOptions.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <h3>Afstand</h3>
            <label className="filter-option">
              <input
                type="checkbox"
                checked={distanceFilterEnabled}
                onChange={(event) => setDistanceFilterEnabled(event.target.checked)}
                disabled={!userLocation}
              />
              Alleen luthiers binnen een straal
            </label>
            <input
              type="range"
              min={10}
              max={500}
              step={10}
              value={maxDistanceKm}
              onChange={(event) => setMaxDistanceKm(Number(event.target.value))}
              disabled={!distanceFilterEnabled || !userLocation}
            />
            <div className="range-value">{maxDistanceKm} km</div>
          </div>
        </aside>

        <div className="luthiers-main">
          <div className="luthiers-map-card">
            <h2>Kaart</h2>
            <div className="map-wrapper">
              <LuthierMap
                luthiers={mapLocations}
                userLocation={userLocation}
              />
            </div>
          </div>

          <section className="luthiers-list">
            <div className="list-header">
              <h2>Luthiers ({filteredLuthiers.length})</h2>
              {distanceFilterEnabled && userLocation && (
                <span className="muted">
                  Gesorteerd op afstand binnen {maxDistanceKm} km
                </span>
              )}
            </div>

            {loading && <p>We laden de luthiers…</p>}
            {error && !loading && <p className="luthiers-error">{error}</p>}

            {!loading && !error && filteredLuthiers.length === 0 && (
              <p className="muted">
                Geen luthiers gevonden met deze filters. Pas je filters aan of
                vergroot de straal.
              </p>
            )}

            <div className="luthiers-grid">
              {filteredLuthiers.map((luthier) => (
                <article key={luthier.id} className="luthier-card">
                  <div className="card-image">
                    <Image
                      src={
                        luthier.photoUrl?.startsWith("http")
                          ? luthier.photoUrl
                          : `/uploads/luthiers/${luthier.photoUrl || "placeholder.jpg"}`
                      }
                      alt={luthier.name}
                      width={240}
                      height={180}
                    />
                  </div>
                  <div className="card-content">
                    <div className="card-header">
                      <h3>{luthier.name}</h3>
                      <div className="chip-stack">
                        <span className="chip">{luthier.type}</span>
                        {luthier.verified && (
                          <span className="chip verified">Verified</span>
                        )}
                      </div>
                    </div>
                    <p className="card-address">{formatAddress(luthier)}</p>
                    {luthier.distanceKm != null && (
                      <p className="card-distance">
                        <strong>{luthier.distanceKm.toFixed(1)} km</strong> van jouw locatie
                      </p>
                    )}
                    {luthier.website && (
                      <p className="card-link">
                        <a href={luthier.website} target="_blank" rel="noreferrer">
                          Bezoek website
                        </a>
                      </p>
                    )}
                    {luthier.instruments.length > 0 && (
                      <p className="card-instruments">
                        <strong>Instrumenten:</strong> {formatInstrumentList(luthier.instruments)}
                      </p>
                    )}
                    {luthier.bio && <p className="card-bio">{luthier.bio}</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

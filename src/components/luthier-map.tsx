"use client";

import { useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

export interface LuthierLocation {
  id: number;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  distanceKm: number | null;
  city: string | null;
  country: string | null;
}

export interface LuthierMapProps {
  luthiers: LuthierLocation[];
  userLocation: { lat: number; lon: number } | null;
}

const DEFAULT_CENTER: LatLngExpression = [52.3702, 4.8952]; // Amsterdam fallback

export default function LuthierMap({ luthiers, userLocation }: LuthierMapProps) {
  const center = useMemo<LatLngExpression>(() => {
    if (userLocation) {
      return [userLocation.lat, userLocation.lon];
    }

    if (luthiers.length > 0) {
      const lat =
        luthiers.reduce((sum, item) => sum + item.latitude, 0) /
        luthiers.length;
      const lon =
        luthiers.reduce((sum, item) => sum + item.longitude, 0) /
        luthiers.length;
      return [lat, lon] as LatLngExpression;
    }

    return DEFAULT_CENTER;
  }, [luthiers, userLocation]);

  const zoom = userLocation ? 9 : 5;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      className="luthiers-map-container"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {userLocation && (
        <CircleMarker
          center={[userLocation.lat, userLocation.lon]}
          radius={10}
          pathOptions={{ color: "#90441d", fillColor: "#90441d", fillOpacity: 0.6 }}
        >
          <Popup>Your location</Popup>
        </CircleMarker>
      )}

      {luthiers.map((luthier) => (
        <CircleMarker
          key={luthier.id}
          center={[luthier.latitude, luthier.longitude]}
          radius={7}
          pathOptions={{ color: "#e88a4f", fillColor: "#e88a4f", fillOpacity: 0.7 }}
        >
          <Popup>
            <strong>{luthier.name}</strong>
            <br />
            {luthier.type}
            {luthier.distanceKm != null && (
              <>
                <br />
                {luthier.distanceKm.toFixed(1)} km away
              </>
            )}
            {(luthier.city || luthier.country) && (
              <>
                <br />
                {[luthier.city, luthier.country].filter(Boolean).join(", ")}
              </>
            )}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

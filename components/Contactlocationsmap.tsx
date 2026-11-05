"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchLocations, LocationItem } from "@/lib/site/services/locations";

type MapLocation = {
  name: string;
  address: string;
  description: string;
  lat: number;
  lng: number;
};

const DEFAULT_DESCRIPTION =
  "Greenpal Pulse station — rent a portable power bank here. Stay charged. Keep moving.";

// Only stations people can actually visit; coming_soon and offline are hidden.
const VISIBLE_STATUSES = ["live", "installing"];

// Rough bounds for North America. Guards the map against records with a
// missing or mistyped coordinate (e.g. a longitude without its minus sign).
const isValidCoordinate = (lat?: number, lng?: number) =>
  typeof lat === "number" &&
  typeof lng === "number" &&
  lat >= 15 &&
  lat <= 75 &&
  lng >= -170 &&
  lng <= -50;

const toMapLocations = (items: LocationItem[]): MapLocation[] =>
  items
    .filter((loc) => VISIBLE_STATUSES.includes(loc.status))
    .filter((loc) => isValidCoordinate(loc.coordinates?.lat, loc.coordinates?.lng))
    .map((loc) => ({
      name: loc.name,
      address: loc.address,
      description: loc.websiteCopy?.trim() || DEFAULT_DESCRIPTION,
      lat: loc.coordinates!.lat as number,
      lng: loc.coordinates!.lng as number,
    }));

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const PIN_COLOR = "#02d683";

export default function ContactLocationsMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const [locations, setLocations] = useState<MapLocation[]>([]);

  // Load stations from the API
  useEffect(() => {
    let cancelled = false;
    fetchLocations()
      .then((data) => {
        if (!cancelled) setLocations(toMapLocations(data));
      })
      .catch((err) => console.error("Failed to load locations for map:", err));
    return () => {
      cancelled = true;
    };
  }, []);

  // Create the map once
  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current, { scrollWheelZoom: false });
    mapRef.current = map;

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);

    // Default view (Alberta) until the stations load
    map.setView([53.5, -113.5], 6);

    // The container is sized by CSS/layout after mount, so re-measure it
    // (otherwise only part of the map renders).
    const resize = () => {
      map.invalidateSize();
      const layer = markersRef.current;
      const markers = layer ? layer.getLayers() : [];
      if (markers.length) {
        map.fitBounds(L.featureGroup(markers).getBounds(), { padding: [40, 40] });
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(containerRef.current);
    const t = window.setTimeout(resize, 300);

    return () => {
      window.clearTimeout(t);
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      markersRef.current = null;
    };
  }, []);

  // Draw pins whenever the stations change
  useEffect(() => {
    const map = mapRef.current;
    const layer = markersRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    if (locations.length === 0) return;

    const points: [number, number][] = [];

    locations.forEach((loc) => {
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:20px;height:20px;border-radius:50%;background:${PIN_COLOR};border:3px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.5)"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10],
      });

      const directions = `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`;

      L.marker([loc.lat, loc.lng], { icon })
        .addTo(layer)
        .bindPopup(
          `<strong>${escapeHtml(loc.name)}</strong><br>${escapeHtml(loc.address)}<br>` +
            `<span style="color:#555">${escapeHtml(loc.description)}</span><br>` +
            `<a href="${directions}" target="_blank" rel="noopener noreferrer">Get directions</a>`,
        );

      points.push([loc.lat, loc.lng]);
    });

    map.fitBounds(points, { padding: [40, 40] });
  }, [locations]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full z-0" />
  );
}

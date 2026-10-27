"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Location = {
    name: string;
    address: string;
    description: string;
    lat: number;
    lng: number;
};

const LOCATIONS: Location[] = [
    {
        name: "Pawn Shop Live",
        address: "6240 99 St NW, Edmonton, AB T6E 6C7",
        description:
            "Greenpal Pulse 12 station — rent a portable power bank here. Stay charged. Keep moving.",
        lat: 53.49866,
        lng: -113.48727,
    },
    {
        name: "Evolution Wonderlounge",
        address: "11508 Jasper Ave NW, Edmonton, AB T5K 0M8",
        description:
            "Greenpal Pulse station — rent a portable power bank here. Stay charged. Keep moving.",
        lat: 53.54125,
        lng: -113.51975,
    },
    {
        name: "B Street Bar",
        address: "11818 111 Ave NW, Edmonton, AB T5G 0E5",
        description:
            "Greenpal Pulse 8 station — rent a portable power bank here. Stay charged. Keep moving.",
        lat: 53.5594,
        lng: -113.52554,
    },
    {
        name: "VRtual Arena",
        address: "11715 170 St NW, Edmonton, AB T5V 1H3",
        description:
            "Greenpal Pulse 12 station — rent a portable power bank here. Stay charged. Keep moving.",
        lat: 53.56849,
        lng: -113.61409,
    },
    {
        name: "Chop Shop Physiques — Sherwood Park",
        address: "Unit 540, 800 Broadmoor Blvd, Sherwood Park, AB T8H 4Y6",
        description:
            "Greenpal Pulse 8 station — rent a portable power bank here. Stay charged. Keep moving.",
        lat: 53.53844,
        lng: -113.32262,
    },
    {
        name: "Chop Shop Physiques — Spruce Grove",
        address: "#315, 280 Pioneer Rd, Spruce Grove, AB T7X 0A7",
        description:
            "Greenpal Pulse 8 station — rent a portable power bank here. Stay charged. Keep moving.",
        lat: 53.55529,
        lng: -113.85977,
    },
    {
        name: "Chop Shop Physiques — Stony Plain",
        address: "#117, 4401 48 St, Stony Plain, AB T7Z 1N3",
        description:
            "Greenpal Pulse 8 station — rent a portable power bank here. Stay charged. Keep moving.",
        lat: 53.53483,
        lng: -114.00095,
    },
    {
        name: "Chop Shop Physiques — Fort Saskatchewan",
        address: "#601, 10471 99 Ave, Fort Saskatchewan, AB T8L 0V6",
        description:
            "Greenpal Pulse 8 station — rent a portable power bank here. Stay charged. Keep moving.",
        lat: 53.71183,
        lng: -113.20495,
    },
    {
        name: "Cure MD — St. Albert",
        address: "Unit 680, 1115 St. Albert Trail, St. Albert, AB T8N 7X6",
        description:
            "Greenpal Pulse 8 station — rent a portable power bank here. Stay charged. Keep moving.",
        lat: 53.67362,
        lng: -113.63752,
    },
];

const PIN_COLOR = "#02d683";

export default function ContactLocationsMap() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const map = L.map(containerRef.current, { scrollWheelZoom: false });

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        const points: [number, number][] = [];

        LOCATIONS.forEach((loc) => {
            const icon = L.divIcon({
                className: "",
                html: `<div style="width:20px;height:20px;border-radius:50%;background:${PIN_COLOR};border:3px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.5)"></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10],
                popupAnchor: [0, -10],
            });

            const directions = `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`;

            L.marker([loc.lat, loc.lng], { icon })
                .addTo(map)
                .bindPopup(
                    `<strong>${loc.name}</strong><br>${loc.address}<br>` +
                    `<span style="color:#555">${loc.description}</span><br>` +
                    `<a href="${directions}" target="_blank" rel="noopener noreferrer">Get directions</a>`
                );

            points.push([loc.lat, loc.lng]);
        });

        map.fitBounds(points, { padding: [40, 40] });

        return () => {
            map.remove();
        };
    }, []);

    return <div ref={containerRef} className="absolute inset-0 w-full h-full z-0" />;
}
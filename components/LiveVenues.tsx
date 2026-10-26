"use client";

import { useEffect, useState } from "react";
import { fetchLocations, LocationItem } from "@/lib/site/services/locations";

export default function LiveVenues() {
    const [locations, setLocations] = useState<LocationItem[]>([]);

    useEffect(() => {
        fetchLocations()
            .then((data) => {
                if (Array.isArray(data)) {
                    setLocations(data.filter((l) => l.status === "live"));
                }
            })
            .catch(() => setLocations([]));
    }, []);

    // Group same-name venues (e.g. Chop Shop x4) into one card with a count
    const grouped = Object.values(
        locations.reduce<Record<string, { name: string; count: number; station?: string }>>(
            (acc, l) => {
                const key = l.name;
                acc[key] = acc[key]
                    ? { ...acc[key], count: acc[key].count + 1 }
                    : { name: l.name, count: 1, station: l.stationName };
                return acc;
            },
            {}
        )
    );

    // Show nothing rather than a loading message or empty box
    if (grouped.length === 0) return null;

    return (
        <section className="py-16 border-b line-rule bg-card/60">
            <div className="container-edit max-w-6xl mx-auto px-4 text-center">
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-signal-dim dark:text-signal font-semibold block mb-3">
                    Live now
                </span>
                <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight mb-8">
                    {locations.length} stations powering real venues
                </h2>

                <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                    {grouped.map((v) => (
                        <div
                            key={v.name}
                            className="border line-rule rounded-2xl bg-card px-6 py-4 shadow-sm"
                        >
                            <div className="font-display font-semibold text-base md:text-lg">
                                {v.name}
                                {v.count > 1 ? ` ×${v.count}` : ""}
                            </div>
                            {v.station && (
                                <div className="font-mono text-xs text-signal-dim dark:text-signal mt-1">
                                    {v.station}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
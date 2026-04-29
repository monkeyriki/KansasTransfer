"use client";

import { useEffect } from "react";
import {
  Circle,
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import type { MapGapZone, TransitStop } from "@/lib/gap-analysis-data";
import { KANSAS_CENTER, MAP_GAPS, MAP_STOPS } from "@/lib/gap-analysis-data";

import "leaflet/dist/leaflet.css";

function MapResizeFix() {
  const map = useMap();
  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 120);
    return () => window.clearTimeout(timer);
  }, [map]);
  return null;
}

function severityStyle(sev: MapGapZone["severity"]) {
  if (sev === "critical") {
    return { color: "#ef4444", fill: "#ef4444", opacity: 0.28 };
  }
  return { color: "#f59e0b", fill: "#f59e0b", opacity: 0.26 };
}

export default function GapsMap() {
  return (
    <MapContainer
      center={KANSAS_CENTER}
      zoom={7}
      scrollWheelZoom
      className="z-0 h-[min(420px,52vh)] w-full rounded-b-lg bg-slate-900 [&_.leaflet-control-attribution]:text-[10px] [&_.leaflet-control-attribution]:text-slate-500"
    >
      <MapResizeFix />
      <TileLayer
        attribution='&copy; OpenStreetMap, &copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {MAP_GAPS.map((g) => {
        const st = severityStyle(g.severity);
        return (
          <Circle
            key={g.id}
            center={g.center}
            radius={g.radiusM}
            pathOptions={{
              color: st.color,
              fillColor: st.fill,
              fillOpacity: st.opacity,
              weight: 1.5,
            }}
          >
            <Popup className="!text-xs">
              <span className="font-semibold text-slate-900">{g.county} County</span>
              <br />
              <span className="text-slate-600">
                Need {g.needScore} · avg {g.distanceKm} km to stop
              </span>
            </Popup>
          </Circle>
        );
      })}
      {MAP_STOPS.map((s: TransitStop) => (
        <CircleMarker
          key={s.id}
          center={[s.lat, s.lng]}
          radius={6}
          pathOptions={{
            color: "#0ea5e9",
            fillColor: "#7dd3fc",
            fillOpacity: 0.95,
            weight: 2,
          }}
        >
          <Popup className="!text-xs">
            <span className="font-semibold text-slate-900">{s.name}</span>
            <br />
            <span className="text-slate-600">{s.county}</span>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

"use client";

import { useEffect } from "react";
import {
  Circle,
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import {
  DEMO_KANSAS_HIGHWAY_POLYLINE,
  KANSAS_CENTER,
  MAP_GAPS,
  MAP_STOPS,
  type MapGapZone,
  type TransitStop,
} from "@/lib/gap-analysis-data";

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

export type OverviewLayerKey = "stops" | "gaps" | "demographics" | "energy";

type Props = {
  layers: Record<OverviewLayerKey, boolean>;
};

export default function OverviewMap({ layers }: Props) {
  return (
    <MapContainer
      center={KANSAS_CENTER}
      zoom={7}
      scrollWheelZoom
      className="z-0 h-[min(420px,55vh)] w-full bg-slate-900 [&_.leaflet-control-attribution]:text-[10px] [&_.leaflet-control-attribution]:text-slate-500"
    >
      <MapResizeFix />
      <TileLayer
        attribution='&copy; OpenStreetMap, &copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {layers.gaps &&
        MAP_GAPS.map((g) => {
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
                  Gap need {g.needScore} · avg {g.distanceKm} km to stop
                </span>
              </Popup>
            </Circle>
          );
        })}

      {layers.stops &&
        MAP_STOPS.map((s: TransitStop) => (
          <CircleMarker
            key={s.id}
            center={[s.lat, s.lng]}
            radius={6}
            pathOptions={{
              color: "#0ea5e9",
              fillColor: "#7dd3fc",
              fillOpacity: 0.95,
              weight: 2,
              opacity: 0.95,
            }}
          >
            <Popup className="!text-xs">{s.name}</Popup>
          </CircleMarker>
        ))}

      {layers.demographics && (
        <Circle
          center={[39.1, -98.3]}
          radius={98000}
          pathOptions={{
            color: "#a855f7",
            fillColor: "#a855f7",
            opacity: 0.75,
            fillOpacity: 0.06,
            weight: 1.5,
            dashArray: "10 14",
          }}
        />
      )}

      {layers.energy && (
        <Circle
          center={[38.2, -97.95]}
          radius={76000}
          pathOptions={{
            color: "#22d3ee",
            fillColor: "#06b6d4",
            opacity: 0.85,
            fillOpacity: 0.08,
            weight: 1.5,
          }}
        />
      )}

      <Polyline
        positions={DEMO_KANSAS_HIGHWAY_POLYLINE}
        pathOptions={{
          color: "#38bdf8",
          weight: 5,
          opacity: 0.92,
          lineCap: "round",
          lineJoin: "round",
        }}
      >
        <Popup className="!text-xs font-medium">
          Demo corridor · Kansas interstate-style polyline (not survey-grade)
        </Popup>
      </Polyline>
    </MapContainer>
  );
}

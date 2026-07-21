"use client";
import React, { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import axios from "axios";
type props = {
  pickUp: string;
  drop: string;
  onChange: (p: string, d: string) => void;
  onDistance: (d: number) => void;
};

function FitBounds({ p1, p2 }: { p1: [number, number]; p2: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    map.fitBounds([p1, p2], {
      padding: [72, 72],
      maxZoom: 15,
      animate: true,
      duration: 1,
    });
  }, [p1, p2, map]);

  return null;
}

const pickUpIcon = new L.DivIcon({
  html: `<div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 6px 18px rgba(0,0,0,0.22))">
      <div style="
        background:#0a0a0a;color:#fff;
        padding:5px 14px;border-radius:100px;
        font-size:10px;font-weight:800;letter-spacing:0.14em;
        text-transform:uppercase;white-space:nowrap;
        font-family:-apple-system,system-ui,sans-serif;
        box-shadow:0 2px 12px rgba(0,0,0,0.25);
      ">PICKUP</div>
      <div style="width:2px;height:10px;background:#0a0a0a;opacity:0.4"></div>
      <div style="
        width:13px;height:13px;background:#0a0a0a;border-radius:50%;
        border:3px solid #fff;
        box-shadow:0 0 0 2px rgba(0,0,0,0.15), 0 3px 10px rgba(0,0,0,0.3);
      "></div>
    </div>`,
  className: "",
  iconSize: [90, 58],
  iconAnchor: [45, 58]
})
const dropIcon = new L.DivIcon({
  html: `<div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 6px 18px rgba(0,0,0,0.22))">
      <div style="
        background:#0a0a0a;color:#fff;
        padding:5px 14px;border-radius:100px;
        font-size:10px;font-weight:800;letter-spacing:0.14em;
        text-transform:uppercase;white-space:nowrap;
        font-family:-apple-system,system-ui,sans-serif;
        box-shadow:0 2px 12px rgba(0,0,0,0.25);
      ">DROP</div>
      <div style="width:2px;height:10px;background:#0a0a0a;opacity:0.4"></div>
      <div style="
        width:13px;height:13px;background:#0a0a0a;border-radius:50%;
        border:3px solid #fff;
        box-shadow:0 0 0 2px rgba(0,0,0,0.15), 0 3px 10px rgba(0,0,0,0.3);
      "></div>
    </div>`,
  className: "",
  iconSize: [90, 58],
  iconAnchor: [45, 58]
})

function SearchMap({ pickUp, drop, onChange, onDistance }: props) {
  const [p1, setP1] = useState<[number, number]>();
  const [p2, setP2] = useState<[number, number]>();

  const geoCoding = async (q: string): Promise<[number, number] | null> => {
    try {
      const { data } = await axios.get(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=1`,
      );
      if (!data.features.length) return null;
      const [lon, lat] = data.features[0].geometry.coordinates;
      return [lat, lon];
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  useEffect(() => {
    if (pickUp && drop) {
      (async () => {
        const a = await geoCoding(pickUp);
        const b = await geoCoding(drop);
        if (!a || !b) {
          return;
        }
        setP1(a);
        setP2(b);
      })();
    }
  }, [pickUp, drop]);
  return (
    <div className="relative h-full w-full bg-zinc-100">
      <MapContainer
        style={{ width: "100%", height: "100%" }}
        center={p1 ?? [0, 0]}
        zoom={13}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {p1 && p2 && <FitBounds p1={p1} p2={p2} />}
        {p1 && <Marker position={p1} icon={pickUpIcon}/>}
        {p2 && <Marker position={p2} icon={dropIcon}/>}
      </MapContainer>
    </div>
  );
}

export default SearchMap;

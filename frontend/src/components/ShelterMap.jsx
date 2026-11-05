import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const createShelterIcon = (occupancy, capacity) => {
  const percentage =
    capacity > 0 ? (occupancy / capacity) * 100 : 0;

  let color = "#47965a";

  if (percentage >= 90) {
    color = "#dc4545";
  } else if (percentage >= 70) {
    color = "#e7a32e";
  }

  return L.divIcon({
    className: "",
    html: `
      <div style="
        background: ${color};
        width: 18px;
        height: 18px;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 1px 5px rgba(0,0,0,0.4);
      "></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
};

function MapFocus({ selectedShelter }) {
  const map = useMap();

  useEffect(() => {
    if (
      selectedShelter &&
      Number.isFinite(Number(selectedShelter.lat)) &&
      Number.isFinite(Number(selectedShelter.lng))
    ) {
      map.flyTo(
        [
          Number(selectedShelter.lat),
          Number(selectedShelter.lng),
        ],
        13,
        { duration: 1 }
      );
    }
  }, [selectedShelter, map]);

  return null;
}


export default function ShelterMap({
  shelters,
  selectedShelter,
  onSelectShelter,
}) {
  
  const validShelters = useMemo(() => {
    return shelters.filter(
      (shelter) =>
        shelter.lat !== null &&
        shelter.lng !== null &&
        shelter.lat !== undefined &&
        shelter.lng !== undefined &&
        Number.isFinite(Number(shelter.lat)) &&
        Number.isFinite(Number(shelter.lng)) &&
        Number(shelter.lat) >= -90 &&
        Number(shelter.lat) <= 90 &&
        Number(shelter.lng) >= -180 &&
        Number(shelter.lng) <= 180
    );
  }, [shelters]);


  const center = useMemo(() => {
    if (validShelters.length === 0) {
      
      return [7.8731, 80.7718];
    }

    const latitude =
      validShelters.reduce(
        (sum, shelter) => sum + Number(shelter.lat),
        0
      ) / validShelters.length;

    const longitude =
      validShelters.reduce(
        (sum, shelter) => sum + Number(shelter.lng),
        0
      ) / validShelters.length;

    return [latitude, longitude];
  }, [validShelters]);

  return (
    <div className="h-full min-h-[420px] w-full overflow-hidden rounded-xl">
      <MapContainer
        center={center}
        zoom={9}
        scrollWheelZoom={true}
        className="h-full min-h-[420px] w-full"
      >
       
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapFocus selectedShelter={selectedShelter} />

        
        {validShelters.map((shelter) => (
          <Marker
            key={shelter.id}
            position={[
              Number(shelter.lat),
              Number(shelter.lng),
            ]}
            icon={createShelterIcon(
              Number(shelter.occupancy) || 0,
              Number(shelter.capacity) || 0
            )}
            eventHandlers={{
              click: () => {
                onSelectShelter(shelter);
              },
            }}
          >
            <Popup>
              <div className="min-w-[170px] space-y-1">
                <h3 className="font-semibold text-slate-800">
                  {shelter.name}
                </h3>

                <p className="text-sm text-slate-600">
                  {shelter.place}
                </p>

                <p className="text-sm">
                  Occupancy: {shelter.occupancy}/
                  {shelter.capacity}
                </p>

                <p className="text-sm">
                  Available spaces:{" "}
                  {Math.max(
                    0,
                    Number(shelter.capacity || 0) -
                      Number(shelter.occupancy || 0)
                  )}
                </p>

                <p className="text-sm">
                  Status: {shelter.status}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Message when no valid coordinates exist */}
      {validShelters.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-lg bg-white/90 px-4 py-3 text-center shadow">
            <p className="text-sm font-medium text-slate-700">
              No shelter locations available
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Valid latitude and longitude are required.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

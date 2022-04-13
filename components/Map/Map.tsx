import { MapContainer, TileLayer, Popup } from "react-leaflet";
import useHasMounted from "../../lib/hooks/useHasMounted";

import "leaflet/dist/leaflet.css";
import useInfo from "../../lib/hooks/useInfo";
import { formatPhone } from "../../lib/utils/utils";

// Use Carto's default light basemap tiles
// See: https://github.com/CartoDB/basemap-styles
const templateUrl =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

const attribution = `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | <a href="https://carto.com/basemaps/">CartoDB</a>`;

const Map: React.FC = () => {
  const info = useInfo();
  const hasMounted = useHasMounted();

  if (!hasMounted) {
    return null;
  }

  return (
    <MapContainer
      center={[45.34680940599906, -122.6536120467825]}
      className="h-100 w-100"
      closePopupOnClick={false}
      doubleClickZoom={false}
      dragging={false}
      scrollWheelZoom={false}
      touchZoom={false}
      zoom={14}
    >
      <TileLayer attribution={attribution} url={templateUrl} />
      <Popup position={[45.34680940599906, -122.6536120467825]}>
        <h5>Avanti - Restaurant & Bar</h5>
        <p className="text-center text-muted">
          {info.contact.address}
          <br />
          {formatPhone(info.contact.phone)}
        </p>
      </Popup>
    </MapContainer>
  );
};

export default Map;

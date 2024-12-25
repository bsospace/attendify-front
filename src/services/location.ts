import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import axios from "axios";

const LocationManager = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [locations, setLocations] = useState([]);
    const [locationData, setLocationData] = useState({
        name: "",
        latitude: 0,
        longitude: 0,
    });
    const [locationId, setLocationId] = useState<number | null>(null);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

    const mapRef = useRef(null);
    const leafletMapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        fetchLocations();
    }, []);

    useEffect(() => {
        if (!leafletMapRef.current && mapRef.current) {
            initializeMap();
        }
    }, [mapRef]);

    const initializeMap = () => {
        if (mapRef.current) {
            leafletMapRef.current = L.map(mapRef.current).setView(
                [locationData.latitude, locationData.longitude],
                15
            );

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: "© OpenStreetMap",
            }).addTo(leafletMapRef.current);

            leafletMapRef.current.on("click", (e) => {
                const { lat, lng } = e.latlng;
                updateMarker({ lat, lng });
                setLocationData((prev) => ({
                    ...prev,
                    latitude: parseFloat(lat.toFixed(6)),
                    longitude: parseFloat(lng.toFixed(6)),
                }));
            });
        }
    };

    interface LatLng {
        lat: number;
        lng: number;
    }

    const updateMarker = (latlng: LatLng) => {
        if (markerRef.current) {
            markerRef.current.setLatLng(latlng);
        } else {
            markerRef.current = L.marker(latlng).addTo(leafletMapRef.current as L.Map);
        }
        (leafletMapRef.current as L.Map).panTo(latlng);
    };

    const fetchLocations = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("/locations");
            setLocations(response.data.data);
        } catch (error) {
            console.error("Failed to fetch locations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const validateLocation = async () => {
        if (!locationData.name) {
            alert("Location name is required.");
            return false;
        }
        try {
            const response = await axios.get(
                `/locations?filters[name][$eq]=${locationData.name}`
            );
            if (response.data.data.length > 0) {
                alert("Location name already exists.");
                return false;
            }
        } catch (error) {
            console.error("Validation failed:", error);
        }
        return true;
    };

    const createLocation = async () => {
        if (!(await validateLocation())) return;
        try {
            await axios.post("/locations", { data: locationData });
            alert("Location created successfully!");
            fetchLocations();
        } catch (error) {
            console.error("Failed to create location:", error);
        }
    };

    const updateLocation = async () => {
        try {
            await axios.put(`/locations/${locationId}`, { data: locationData });
            alert("Location updated successfully!");
            fetchLocations();
        } catch (error) {
            console.error("Failed to update location:", error);
        }
    };

    const clearLocation = () => {
        setLocationData({
            name: "",
            latitude: 0,
            longitude: 0,
        });
        setIsEdit(false);
        updateToCurrentLocation();
    };

    interface LocationAttributes {
        name: string;
        latitude: string;
        longitude: string;
    }

    const editLocation = async (id: number) => {
        clearLocation();
        setIsEdit(true);
        setLocationId(id);
        try {
            const response = await axios.get<{ data: { attributes: LocationAttributes } }>(`/locations/${id}`);
            const location = response.data.data.attributes;
            setLocationData({
                name: location.name,
                latitude: parseFloat(location.latitude),
                longitude: parseFloat(location.longitude),
            });
            updateMap();
        } catch (error) {
            console.error("Failed to edit location:", error);
        }
    };

    interface SearchResult {
        lat: string;
        lon: string;
        display_name: string;
    }

    const searchLocation = async (query: string): Promise<void> => {
        if (query.length > 2) {
            try {
                const response = await axios.get<SearchResult[]>(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
                );
                setSearchResults(response.data);
            } catch (error) {
                console.error("Failed to search location:", error);
            }
        }
    };

    interface SelectLocationProps {
        index: number;
    }

    const selectLocation = ({ index }: SelectLocationProps) => {
        const selectedLocation = searchResults[index];
        setLocationData((prev) => ({
            ...prev,
            latitude: parseFloat(selectedLocation.lat),
            longitude: parseFloat(selectedLocation.lon),
        }));
        updateMap();
    };

    const updateToCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setLocationData((prev) => ({
                ...prev,
                latitude,
                longitude,
            }));
            updateMap();
        });
    };

    const updateMap = () => {
        const { latitude, longitude } = locationData;
        updateMarker({ lat: latitude, lng: longitude });
        leafletMapRef.current?.setView([latitude, longitude], 15);
    };

    return {
        isLoading,
        locations,
        locationData,
        setLocationData,
        isEdit,
        setIsEdit,
        createLocation,
        updateLocation,
        editLocation,
        clearLocation,
        searchLocation,
        selectLocation,
        updateToCurrentLocation,
    };
};

export default LocationManager;
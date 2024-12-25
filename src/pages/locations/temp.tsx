import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Trash, Check, X, Locate } from "lucide-react";
import { Toaster, toast } from "sonner";
import { Input } from "@/components/ui/input";
import axios from "axios";

export function TEMP() {
    const initialLocationDetails = {
        name: "New Location",
        latitude: "13.736717",
        longitude: "100.523186",
    };

    const initialRooms = ["Room 1"];

    const [rooms, setRooms] = useState<string[]>(initialRooms);
    const [locationDetails, setLocationDetails] = useState(initialLocationDetails);
    const [editingField, setEditingField] = useState<"name" | "coordinates" | null>(null);
    const [tempName, setTempName] = useState(locationDetails.name);
    const [tempCoordinates, setTempCoordinates] = useState({
        latitude: locationDetails.latitude,
        longitude: locationDetails.longitude,
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const [editingRoomIndex, setEditingRoomIndex] = useState<number | null>(null);
    const [tempRoomValue, setTempRoomValue] = useState<string>("");

    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (mapRef.current && !leafletMapRef.current) {
            leafletMapRef.current = L.map(mapRef.current).setView(
                [parseFloat(locationDetails.latitude), parseFloat(locationDetails.longitude)],
                13
            );

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap",
            }).addTo(leafletMapRef.current);

            leafletMapRef.current.on("click", (e: L.LeafletMouseEvent) => {
                const { lat, lng } = e.latlng;
                setLocationDetails((prev) => ({
                    ...prev,
                    latitude: lat.toFixed(6),
                    longitude: lng.toFixed(6),
                }));
                updateMarker([lat, lng]);
            });
        }

        return () => {
            leafletMapRef.current?.remove();
            leafletMapRef.current = null;
        };
    }, []);

    const updateMarker = (latlng: [number, number]) => {
        if (markerRef.current) {
            markerRef.current.setLatLng(latlng);
        } else {
            markerRef.current = L.marker(latlng).addTo(leafletMapRef.current!);
        }
        leafletMapRef.current?.panTo(latlng);
    };

    const handleSearch = async () => {
        if (searchQuery.length > 2) {
            try {
                const response = await axios.get(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
                );
                setSearchResults(response.data);
            } catch (error) {
                console.error("Search error:", error);
                toast.error("Error searching for locations.");
            }
        }
    };

    const selectSearchResult = (index: number) => {
        const result = searchResults[index];
        setLocationDetails({
            ...locationDetails,
            latitude: result.lat,
            longitude: result.lon,
        });
        updateMarker([parseFloat(result.lat), parseFloat(result.lon)]);
        setSearchResults([]); // Clear search results after selection
    };

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocationDetails((prev) => ({
                        ...prev,
                        latitude: latitude.toFixed(6),
                        longitude: longitude.toFixed(6),
                    }));
                    updateMarker([latitude, longitude]);
                },
                (error) => {
                    console.error("Location error:", error);
                    toast.error("Failed to fetch your location.");
                }
            );
        } else {
            toast.error("Geolocation not supported.");
        }
    };

    const handleSaveCoordinates = () => {
        setLocationDetails((prev) => ({
            ...prev,
            latitude: tempCoordinates.latitude,
            longitude: tempCoordinates.longitude,
        }));
        setEditingField(null);
        updateMarker([
            parseFloat(tempCoordinates.latitude),
            parseFloat(tempCoordinates.longitude),
        ]);
        toast.success("Coordinates updated successfully!");
    };

    const handleRoomEdit = (index: number) => {
        setEditingRoomIndex(index);
        setTempRoomValue(rooms[index]);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleRoomSave = () => {
        if (rooms.includes(tempRoomValue) && editingRoomIndex !== rooms.indexOf(tempRoomValue)) {
            toast.error("Room name already exists!");
            return;
        }

        const updatedRooms = [...rooms];
        updatedRooms[editingRoomIndex!] = tempRoomValue;
        setRooms(updatedRooms);
        setEditingRoomIndex(null);
        toast.success("Room updated successfully!");
    };

    const handleRoomDiscard = () => {
        setEditingRoomIndex(null);
        setTempRoomValue("");
    };

    const addRoom = () => {
        const newRoom = `Room ${rooms.length + 1}`;
        setRooms([...rooms, newRoom]);
        setEditingRoomIndex(rooms.length);
        setTempRoomValue(newRoom);
    };

    return (
        <div>
            <Toaster position="top-right" />

            <Dialog>
                <DialogTrigger asChild>
                    <Button>TEMP</Button>
                </DialogTrigger>

                <DialogContent className="max-w-6xl md:max-h-6xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Manage Location</DialogTitle>
                        <DialogDescription>
                            Edit location details and manage rooms. Click fields to edit.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Left Side: Location Details */}
                        <div className="flex-1">
                            <Label>Name</Label>
                            <div className="border-b cursor-pointer" onClick={() => setEditingField("name")}>
                                {locationDetails.name}
                            </div>
                            <Label>Coordinates</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    value={tempCoordinates.latitude}
                                    onChange={(e) =>
                                        setTempCoordinates((prev) => ({
                                            ...prev,
                                            latitude: e.target.value,
                                        }))
                                    }
                                />
                                <Input
                                    value={tempCoordinates.longitude}
                                    onChange={(e) =>
                                        setTempCoordinates((prev) => ({
                                            ...prev,
                                            longitude: e.target.value,
                                        }))
                                    }
                                />
                                <Button onClick={handleSaveCoordinates}>
                                    <Check />
                                </Button>
                            </div>
                            <div ref={mapRef} className="h-[300px] border"></div>
                            <Label>Search</Label>
                            <Input
                                placeholder="Search location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Button onClick={handleSearch}>Search</Button>
                            <Button onClick={getUserLocation}>
                                <Locate />
                            </Button>
                            {searchResults.length > 0 && (
                                <ul>
                                    {searchResults.map((result, index) => (
                                        <li
                                            key={index}
                                            onClick={() => selectSearchResult(index)}
                                            className="cursor-pointer"
                                        >
                                            {result.display_name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Right Side: Room Management */}
                        <div className="flex-1">
                            <Label>Room Management</Label>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Room Name</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rooms.map((room, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {editingRoomIndex === index ? (
                                                    <Input
                                                        value={tempRoomValue}
                                                        onChange={(e) => setTempRoomValue(e.target.value)}
                                                    />
                                                ) : (
                                                    <span>{room}</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
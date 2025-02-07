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
import { apiClient } from "@/services/api";
import { envConfig } from "@/config/envConfig";
import { API_ENDPOINTS } from "@/lib/constants";

export function ViewLocation() {
    const initialLocation = {
        name: "New Location",
        latitude: "13.736717",
        longitude: "100.523186",
    };

    const initialRooms = ["Room 1"];

    const [rooms, setRooms] = useState<string[]>(initialRooms);
    const [location, setLocation] = useState(initialLocation);
    const [tempCoordinates, setTempCoordinates] = useState({
        latitude: location.latitude,
        longitude: location.longitude,
    });

    const [existingLocations, setExistingLocations] = useState<Location[]>([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);

    type LocationField = "name" | "latitude" | "longitude";
    const [editingField, setEditingField] = useState<LocationField | null>(null);
    const [tempFieldValue, setTempFieldValue] = useState<string>(""); // Temporary field value for editing
    const [editingRoomIndex, setEditingRoomIndex] = useState<number | null>(null);
    const [tempRoomValue, setTempRoomValue] = useState<string>("");

    const inputRef = useRef<HTMLInputElement | null>(null);
    const tableBodyRef = useRef<HTMLDivElement | null>(null);

    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        if (mapRef.current && !leafletMapRef.current) {
            leafletMapRef.current = L.map(mapRef.current).setView(
                [parseFloat(location.latitude), parseFloat(location.longitude)],
                13
            );

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap",
            }).addTo(leafletMapRef.current);

            leafletMapRef.current.on("click", (e: L.LeafletMouseEvent) => {
                const { lat, lng } = e.latlng;

                setLocation({
                    ...location,
                    latitude: lat.toFixed(6),
                    longitude: lng.toFixed(6),
                });
                updateMarker([lat, lng]);
            });
        }

        return () => {
            leafletMapRef.current?.remove();
            leafletMapRef.current = null;
        };
    }, [location]);

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
                toast.error("Error searching for locations.", { position: "top-right" });
            }
        }
    };

    const selectSearchResult = (index: number) => {
        const result = searchResults[index];
        setLocation({
            ...location,
            latitude: result.lat,
            longitude: result.lon,
        });
        updateMarker([parseFloat(result.lat), parseFloat(result.lon)]);
        setSearchResults([]); // Clear search results after selection
    };

    const handleSaveCoordinates = async () => {
        // อัปเดตทั้งชื่อ (name) และพิกัด (coordinates) พร้อมกัน
        const updatedLocation = {
            name: location.name, // ใช้ค่าชื่อที่อยู่ใน location
            latitude: tempCoordinates.latitude,
            longitude: tempCoordinates.longitude,
        };

        console.log("updatedLocation", updatedLocation);

        setLocation(updatedLocation); // อัปเดตข้อมูลใน state
        setEditingField(null);
        updateMarker([parseFloat(tempCoordinates.latitude), parseFloat(tempCoordinates.longitude)]);

        try {
            const response = await apiClient.post(
                `${envConfig.apiUrl}${API_ENDPOINTS.LOCATIONS.BASE}/create`,
                updatedLocation
            );

            if (response.status === 201) {
                const data = response.data;
                console.log("Location created successfully:", data);
                const newLocation = (data as { data: Location }).data;
                setExistingLocations([...existingLocations, newLocation]);
                toast.success("Location updated successfully!", { position: "top-right" });
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Failed to update location.", { position: "top-right" });
        }
    };

    const handleDialogOpenChange = (isOpen: boolean) => {
        if (isOpen) {
            setLocation(initialLocation);
            setRooms(initialRooms);
            setEditingField(null);
            setEditingRoomIndex(null);
        }
    };

    const handleFieldEdit = (field: LocationField) => {
        setEditingField(field);
        setTempFieldValue(location[field]);
        setTimeout(() => inputRef.current?.focus(), 0); // Focus on input field
    };

    const handleFieldSave = (field: LocationField) => {
        setLocation({ ...location, [field]: tempFieldValue });
        setEditingField(null);

        // Blur input field after saving
        if (inputRef.current) {
            inputRef.current.blur();
        }

        toast.success(`${field} updated successfully!`, { position: "top-right" });
    };

    const handleFieldDiscard = () => {
        setEditingField(null); // Cancel edit mode
        setTempFieldValue(""); // Reset temp value
    };

    const handleRoomEdit = (index: number) => {
        setEditingRoomIndex(index);
        setTempRoomValue(rooms[index]);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleRoomSave = async () => {
        if (rooms.includes(tempRoomValue) && editingRoomIndex !== rooms.indexOf(tempRoomValue)) {
            toast.error("Room already exists!", { position: "top-right" });
            return;
        }

        // Check if there are existing locations before adding room
        // if (existingLocations.length === 0) {
        //     toast.error("Please add a location first!", { position: "top-right" });
        //     return;
        // }

        const updatedRooms = [...rooms];
        updatedRooms[editingRoomIndex!] = tempRoomValue;
        setRooms(updatedRooms);
        setEditingRoomIndex(null);

        // Incremental update to the backend
        try {
            const response = await apiClient.post(
                `${envConfig.apiUrl}${API_ENDPOINTS.ROOMS.BASE}/create`,    
                {
                    existingLocations,
                    rooms: updatedRooms,
                }
            );

            if (response.status === 200) {
                setExistingLocations(response.data as Location[]);
                toast.success("Room updated successfully!", { position: "top-right" });
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Failed to update room.", { position: "top-right" });
        }
    };

    const handleRoomDiscard = () => {
        setEditingRoomIndex(null);
        setTempRoomValue("");
    };

    const addRoom = () => {
        console.log(existingLocations.length);
        
        // Check if there are existing locations before allowing room addition
        // if (existingLocations.length === 0) {
        //     toast.error("Please add a location first!", { position: "top-right" });
        //     return;
        // }

        const newRoom = `Room ${rooms.length + 1}`;
        setRooms([...rooms, newRoom]);
        setEditingRoomIndex(rooms.length);
        setTempRoomValue(newRoom);
        setTimeout(() => inputRef.current?.focus(), 0);
        setTimeout(() => {
            tableBodyRef.current?.scrollTo({
                top: tableBodyRef.current.scrollHeight,
                behavior: "smooth",
            });
        }, 0);
    };

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation((prev) => ({
                        ...prev,
                        latitude: latitude.toFixed(6),
                        longitude: longitude.toFixed(6),
                    }));
                    updateMarker([latitude, longitude]);
                },
                (error) => {
                    console.error("Location error:", error);
                    toast.error("Failed to fetch your location.", { position: "top-right" });
                }
            );
        } else {
            toast.error("Geolocation not supported.", { position: "top-right" });
        }
    };

    return (
        <div>
            <Toaster position="top-right" />
            <Dialog onOpenChange={handleDialogOpenChange}>
                <DialogTrigger asChild>
                    <Button>Add New Location</Button>
                </DialogTrigger>

                <DialogContent className="max-w-6xl md:max-h-6xl h-full md:h-fit overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Location</DialogTitle>
                        <DialogDescription>
                            Edit location details and manage rooms. Click fields to
                            edit.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="md:flex space-x-6">
                        {/* Left Side: Location Details and Map */}
                        <div className="md:w-2/5 w-full space-y-6">
                            <Label>Name</Label>
                            <div className="border-b cursor-pointer" onClick={() => handleFieldEdit("name")}>
                                {editingField === "name" ? (
                                    <div className="flex items-center space-x-2">
                                        <Input
                                            ref={inputRef}
                                            defaultValue={tempFieldValue}
                                            onChange={(e) => setLocation((prev) => ({ ...prev, name: e.target.value }))}
                                        />
                                    </div>
                                ) : (
                                    location.name
                                )}
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
                            <div
                                ref={mapRef}
                                style={{
                                    height: "400px",
                                    width: "100%",
                                }}
                                className="border border-gray-300 rounded"
                            ></div>
                            <div>
                                <Label>Search</Label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        placeholder="Search location..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <Button onClick={handleSearch} variant="outline">
                                        Search
                                    </Button>
                                    <Button size="icon" variant="outline" onClick={getUserLocation}>
                                        <Locate className="w-5 h-5" />
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
                            </div>
                        </div>

                        {/* Right Side: Room Management */}
                        <div className="md:w-3/5 -translate-x-6 md:translate-x-0 w-full space-y-4 md:mt-0 mt-4">
                            <Label>Room Management</Label>
                            <div className="relative border border-gray-200 rounded">
                                <div
                                    ref={tableBodyRef}
                                    className="overflow-y-auto md:max-h-[65dvh] w-full"
                                >
                                    <Table className="w-full">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Room Name</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {rooms.map((room, index) => (
                                                <TableRow key={index} className="flex w-full">
                                                    <TableCell className="flex-grow">
                                                        {editingRoomIndex === index ? (
                                                            <div className="flex items-center space-x-2 w-full">
                                                                <Input
                                                                    ref={inputRef}
                                                                    className="flex-grow"
                                                                    value={tempRoomValue}
                                                                    onChange={(e) =>
                                                                        setTempRoomValue(e.target.value)
                                                                    }
                                                                />
                                                                <Button variant="ghost" size="icon" onClick={handleRoomSave}>
                                                                    <Check className="w-5 h-5 text-green-500" />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" onClick={handleRoomDiscard}>
                                                                    <X className="w-5 h-5 text-red-500" />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className="border-b border-gray-300 py-1 cursor-pointer w-full"
                                                                onClick={() => handleRoomEdit(index)}
                                                            >
                                                                {room}
                                                            </div>
                                                        )}
                                                    </TableCell>

                                                    <TableCell className="flex-shrink-0 w-12 text-center">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                setRooms((prev) =>
                                                                    prev.filter((_, i) => i !== index)
                                                                );
                                                                toast.success("Room removed successfully!", {
                                                                    position: "top-right",
                                                                });
                                                            }}
                                                        >
                                                            <Trash className="w-4 h-4 text-red-500" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}

                                            {/* Add Room Button Styled as a Row */}
                                            <TableRow className="flex w-full">
                                                <TableCell colSpan={2} className="w-full">
                                                    <div
                                                        className="cursor-pointer"
                                                        onClick={addRoom}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            className="w-full justify-start"
                                                            size="sm"
                                                        >
                                                            + Add Room
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

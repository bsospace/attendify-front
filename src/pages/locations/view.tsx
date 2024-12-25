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

export function ViewLocation() {
    const initialLocationDetails = {
        name: "New Location",
        latitude: "13.736717",
        longitude: "100.523186",
    };

    const initialRooms = ["Room 1"];

    const [rooms, setRooms] = useState<string[]>(initialRooms);
    const [locationDetails, setLocationDetails] = useState(initialLocationDetails);
        const [tempCoordinates, setTempCoordinates] = useState({
        latitude: locationDetails.latitude,
        longitude: locationDetails.longitude,
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);

    type LocationField = "name" | "latitude" | "longitude";
    const [editingField, setEditingField] = useState<LocationField | null>(null);
    const [tempFieldValue, setTempFieldValue] = useState<string>("");
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
                [parseFloat(locationDetails.latitude), parseFloat(locationDetails.longitude)],
                13
            );

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap",
            }).addTo(leafletMapRef.current);

            leafletMapRef.current.on("click", (e: L.LeafletMouseEvent) => {
                const { lat, lng } = e.latlng;

                setLocationDetails({
                    ...locationDetails,
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
    }, [locationDetails]);

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
        setLocationDetails({
            ...locationDetails,
            latitude: result.lat,
            longitude: result.lon,
        });
        updateMarker([parseFloat(result.lat), parseFloat(result.lon)]);
        setSearchResults([]); // Clear search results after selection
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
        toast.success("Coordinates updated successfully!", { position: "top-right" });
    };

    const handleDialogOpenChange = (isOpen: boolean) => {
        if (isOpen) {
            setLocationDetails(initialLocationDetails);
            setRooms(initialRooms);
            setEditingField(null);
            setEditingRoomIndex(null);
        }
    };

    const handleFieldEdit = (field: LocationField) => {
        setEditingField(field);
        setTempFieldValue(locationDetails[field]);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleFieldSave = (field: LocationField) => {
        setLocationDetails({ ...locationDetails, [field]: tempFieldValue });
        setEditingField(null);

        // Blur input field after saving
        if (inputRef.current) {
            inputRef.current.blur();
        }

        toast.success(`${field} updated successfully!`, { position: "top-right" });
    };

    const handleFieldDiscard = () => {
        setEditingField(null);
        setTempFieldValue("");
    };

    const handleRoomEdit = (index: number) => {
        setEditingRoomIndex(index);
        setTempRoomValue(rooms[index]);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleRoomSave = () => {
        if (rooms.includes(tempRoomValue) && editingRoomIndex !== rooms.indexOf(tempRoomValue)) {
            toast.error("Room already exists!", { position: "top-right" });
            return;
        }

        const updatedRooms = [...rooms];
        updatedRooms[editingRoomIndex!] = tempRoomValue;
        setRooms(updatedRooms);
        setEditingRoomIndex(null);
        toast.success("Room updated successfully!", { position: "top-right" });
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
                    setLocationDetails((prev) => ({
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
                                    <Button 
                                        onClick={handleSearch}
                                        variant="outline"
                                    >Search</Button>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={getUserLocation}
                                    >
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
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={handleRoomSave}
                                                                >
                                                                    <Check className="w-5 h-5 text-green-500" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={handleRoomDiscard}
                                                                >
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
import { useState, useEffect } from "react";
import { apiClient } from "@/services/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Check, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { User } from "@/hooks/useAuth";

interface AddMemberDialogProps {
    id: string;
    existingUsers: User[];
    isOpen: boolean;
    onClose: () => void;
    onUpdateUsers: (updatedUsers: User[]) => void;
}

export function AddMemberDialog({ id, existingUsers, isOpen, onClose, onUpdateUsers }: AddMemberDialogProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [users, setUsers] = useState<User[]>(existingUsers || []);
    const [isDirty, setIsDirty] = useState(false); // Tracks changes

    useEffect(() => {
        setUsers(existingUsers || []);
        setIsDirty(false); // Reset state when dialog opens
    }, [existingUsers, isOpen]);

    useEffect(() => {
        if (searchQuery.trim() !== "") {
            searchUser();
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isDirty) {
                event.preventDefault();
                event.returnValue = "You have unsaved changes. Are you sure you want to leave?";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isDirty]);

    const searchUser = async () => {
        try {
            const response = await apiClient.get(`/user?search=${searchQuery}`);
            setSearchResults(response.data as User[]);
        } catch (error) {
            if (error instanceof Error && (error as { details?: { message?: string } }).details?.message) {
                toast.error((error as unknown as { details: { message: string } }).details.message);
            } else {
                toast.error("An unknown error occurred");
            }
        }
    };

    const addUser = (user: User) => {
        if (!users.find((u) => u.id === user.id)) {
            const updatedUsers = [...users, user];
            setUsers(updatedUsers);
            onUpdateUsers(updatedUsers);
            setSearchQuery("");
            setSearchResults([]);
            setIsDirty(true);
        } else {
            toast.error("User already added to the group");
        }
    };

    const removeUser = (userId: string) => {
        const updatedUsers = users.filter((user) => user.id !== userId);
        setUsers(updatedUsers);
        onUpdateUsers(updatedUsers);
        setIsDirty(true);
    };

    const handleClose = () => {
        if (isDirty) {
            const confirmClose = window.confirm("You have unsaved changes. Do you really want to close?");
            if (!confirmClose) return;
        }
        onClose();
    };

    const handleSave = () => {
        try {
            if (users.length === 0) {
                toast.error("Please add at least one member to the group");
                return;
            }

            apiClient.put(`/group/group-user/${id}/edit`, {
                users: users.map((user) => ({ id: user.id })),
            });
        } catch {
            toast.error("Failed to add new members");
        }

        toast.success("Members added successfully!");
        setIsDirty(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Manage Group Members</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Label>Group Members</Label>
                    <div className="flex flex-wrap gap-2 border p-2 rounded-md">
                        {users.map((user) => (
                            <Badge key={user.id} className="flex items-center gap-2 rounded-full py-2" variant="secondary">
                                <img src="/images/default-avatar.png" alt="avatar" className="w-6 h-6 rounded-full" />
                                {user.first_name ? `${user.first_name} ${user.last_name}` : user.email}
                                <X className="w-4 h-4 cursor-pointer" onClick={() => removeUser(user.id)} />
                            </Badge>
                        ))}
                        <Input
                            className="border-none outline-none flex-grow bg-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search users..."
                        />
                    </div>
                    <div className="relative">
                        {(searchResults.length > 0) && (
                            <div className="absolute bg-white shadow-lg rounded-lg w-full mt-1 z-10">
                                {searchResults.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                                        onClick={() => addUser(user)}
                                    >
                                        <img src="/images/default-avatar.png" alt="avatar" className="w-8 h-8 rounded-full" />
                                        <div className="flex-1">
                                            <p className="font-medium">{user.first_name} {user.last_name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                        {users.find((u) => u.id === user.id) && <Check className="w-5 h-5 text-green-500" />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <Button className="mr-2" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add Member
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

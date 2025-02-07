import { useState, useEffect } from "react";
import { apiClient } from "@/services/api";
import { User } from "@/hooks/useAuth";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Check, Edit } from "lucide-react";
import { toast } from "sonner";

export function GroupDialog({ existingGroup }: { readonly existingGroup?: { readonly id: string, readonly name: string, readonly description: string, readonly members: readonly User[] } }) {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [groupName, setGroupName] = useState(existingGroup?.name ?? "");
    const [description, setDescription] = useState(existingGroup?.description ?? "");
    const [users, setUsers] = useState<User[]>(existingGroup ? [...existingGroup.members] : []);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [focusInput, setFocusInput] = useState(false);
    const [hoverList, setHoverList] = useState(false);

    useEffect(() => {
        if (searchQuery.trim() !== "") {
            searchUser();
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const searchUser = async () => {
        try {
            const response = await apiClient.get(`/user?search=${searchQuery}`);
            setSearchResults(response.data as User[]);
        } catch {
            toast.error("Failed to search users");
        }
    };

    const addUser = (user: User) => {
        if (!users.find((u) => u.id === user.id)) {
            setUsers([...users, user]);
            setSearchQuery("");
            setSearchResults([]);
            setHoverList(false);
        } else {
            toast.error("User already added to the group");
        }
    };

    const removeUser = (userId: string) => {
        setUsers(users.filter((user) => user.id !== userId));
    };

    const handleSubmit = async () => {
        try {
            setGroupName(groupName.trim());
            setDescription(description.trim());

            if (groupName === "") {
                toast.error("Group name is required");
                return;
            }

            if (existingGroup) {
                // Update existing group
                await apiClient.put(`/group/${existingGroup.id}`, {
                    name: groupName,
                    description: description,
                    users: users.map((user) => ({ id: user.id })),
                });
                toast.success("Group updated successfully!");
            } else {
                // Create new group
                await apiClient.post("/group/create", {
                    name: groupName,
                    description: description,
                    users: users.map((user) => ({ id: user.id })),
                });
                toast.success("Group created successfully!");
            }

            setIsOpen(false);
        } catch {
            toast.error("Failed to save group");
        }
    };

    const openDialog = () => {
        setIsOpen(true);
    };

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    {existingGroup ? (
                        <Button variant="outline" onClick={openDialog}>
                            <Edit className="w-4 h-4 mr-2" /> Edit Group
                        </Button>
                    ) : (
                        <Button onClick={openDialog}>Create New Group</Button>
                    )}
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{existingGroup ? "Edit Group" : "Create Group"} ({step}/2)</DialogTitle>
                    </DialogHeader>

                    {step === 1 && (
                        <div className="space-y-4">
                            <Label>Group Name *</Label>
                            <Input
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                required
                            />
                            <Label>Description (optional)</Label>
                            <Input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <div className="flex justify-end space-x-4">
                                <Button onClick={() => setStep(2)}>Next</Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <Label>Group Members</Label>
                            <div className="flex flex-wrap gap-2 border p-2 rounded-md">
                                {users.map((user) => (
                                    <Badge key={user.id} className="flex items-center gap-2 rounded-full py-2" variant="secondary">
                                        <img src="images/default-avatar.png" alt="avatar" className="w-6 h-6 rounded-full" />
                                        {user.first_name ? `${user.first_name} ${user.last_name}` : user.email}
                                        <X className="w-4 h-4 cursor-pointer" onClick={() => removeUser(user.id)} />
                                    </Badge>
                                ))}
                                <Input
                                    className="border-none outline-none flex-grow bg-transparent"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setFocusInput(true)}
                                    onBlur={() => setFocusInput(false)}
                                    placeholder="Search users..."
                                />
                            </div>
                            <div className="relative">
                                {(searchResults.length > 0 && (focusInput || hoverList)) && (
                                    <div className="absolute bg-white shadow-lg rounded-lg w-full mt-1 z-10">
                                        {searchResults.map((user) => (
                                            <div
                                                key={user.id}
                                                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                                                onClick={() => addUser(user)}
                                                onMouseOver={() => setHoverList(true)}
                                                onFocus={() => setHoverList(true)}
                                            >
                                                <img src="images/default-avatar.png" alt="avatar" className="w-8 h-8 rounded-full" />
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
                            <div className="flex justify-end space-x-4">
                                <Button onClick={() => setStep(1)}>Back</Button>
                                <Button onClick={handleSubmit}>{existingGroup ? "Save Changes" : "Create Group"}</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

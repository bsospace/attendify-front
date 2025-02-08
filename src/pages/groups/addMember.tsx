import { useState, useEffect } from "react";
import { apiClient } from "@/services/api";
import { User } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Check } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface AddMemberProps {
    groupId: string;
    initialMembers: User[];
    onMembersChange: (updatedMembers: User[]) => void;
}

const AddMember = ({ groupId, initialMembers, onMembersChange }: AddMemberProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [members, setMembers] = useState<User[]>(initialMembers);
    const [focusInput, setFocusInput] = useState(false);
    const [hoverList, setHoverList] = useState(false);

    useEffect(() => {
        setMembers(initialMembers);
    }, [initialMembers]);

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
        if (!members.find((u) => u.id === user.id)) {
            const updatedMembers = [...members, user];
            setMembers(updatedMembers);
            onMembersChange(updatedMembers);
            setSearchQuery("");
            setSearchResults([]);
            setHoverList(false);
        } else {
            toast.error("User already added to the group");
        }
    };

    const removeUser = (userId: string) => {
        const updatedMembers = members.filter((user) => user.id !== userId);
        setMembers(updatedMembers);
        onMembersChange(updatedMembers);
    };

    return (
        <div className="space-y-4">
            <Label>Group Members</Label>
            <div className="flex flex-wrap gap-2 border p-2 rounded-md">
                {members.map((user) => (
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
                                <img src="/images/default-avatar.png" alt="avatar" className="w-8 h-8 rounded-full" />
                                <div className="flex-1">
                                    <p className="font-medium">{user.first_name} {user.last_name}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                                {members.find((u) => u.id === user.id) && <Check className="w-5 h-5 text-green-500" />}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddMember;

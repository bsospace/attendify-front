import { useEffect, useState } from "react";
import { apiClient } from "@/services/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { User } from "lucide-react";

export function EditGroupDialog({ existingGroup, isOpen, onClose }: { 
    existingGroup: { id: string, name: string, description: string }, 
    isOpen: boolean, 
    onClose: () => void 
}) {
    const [groupName, setGroupName] = useState(existingGroup.name);
    const [description, setDescription] = useState(existingGroup.description);
    const [loading, setLoading] = useState(false);
    const [isDirty, setIsDirty] = useState(false); // Tracks changes

    useEffect(() => {
        if (existingGroup) {
            setGroupName(existingGroup.name);
            setDescription(existingGroup.description);
            setIsDirty(false); // Reset dirty state when switching groups
        }
    }, [existingGroup]);

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

    const handleInputChange = (setter: (value: string) => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setter(event.target.value);
        setIsDirty(true);
    };

    const handleSubmit = async () => {
        try {
            if (!groupName.trim()) {
                toast.error("Group name is required");
                return;
            }

            setLoading(true);
            await apiClient.put(`/group/${existingGroup.id}/edit`, {
                name: groupName.trim(),
                description: description.trim(),
            });

            toast.success("Group updated successfully!");
            setIsDirty(false); // Reset dirty state after saving
            onClose();
        } catch {
            toast.error("Failed to update group");
        } finally {
            setLoading(false);
        }
    };

    const viewMember = () => {
        if (isDirty) {
            const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave?");
            if (!confirmLeave) return;
        }
        window.location.href = `/group/${existingGroup.name}`;
    };

    const handleClose = () => {
        if (isDirty) {
            const confirmClose = window.confirm("You have unsaved changes. Do you really want to close?");
            if (!confirmClose) return;
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Group</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Label>Group Name *</Label>
                    <Input
                        value={groupName}
                        onChange={handleInputChange(setGroupName)}
                        required
                    />
                    <Label>Description (optional)</Label>
                    <Input
                        value={description}
                        onChange={handleInputChange(setDescription)}
                    />
                    <div className="flex justify-between space-x-4">
                        <Button variant="outline" onClick={viewMember}>
                            <User /> View Member
                        </Button>
                        <div className="justify-end">
                            <Button className="mr-2" variant="outline" onClick={handleClose} disabled={loading}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit} disabled={loading}>
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

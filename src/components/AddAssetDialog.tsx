import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Loader2, Check, ChevronsUpDown, X } from "lucide-react";
import { addAsset, updateAsset, AssetInput, AssetData, getMembers, addMember, deleteMember } from "@/services/assetService";
import { toast } from "sonner";

const assetSchema = z.object({
  category: z.string().min(1, "Category is required"),
  model: z.string().min(1, "Model is required").max(100),
  assignedTo: z.string().min(1, "Assigned to is required").max(100),
  status: z.enum(["Active", "Maintenance", "Retired", "Available"]),
  description: z.string().optional(),
  repairingDescription: z.string().optional(),
});

interface AddAssetDialogProps {
  onAssetAdded: () => void;
  asset?: AssetData;
  onOpenChange?: (open: boolean) => void;
}

export const AddAssetDialog = ({ onAssetAdded, asset, onOpenChange }: AddAssetDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [members, setMembers] = useState<string[]>([]);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [openPopover, setOpenPopover] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  const loadMembers = async () => {
    try {
      const fetchedMembers = await getMembers();
      setMembers(fetchedMembers);
    } catch (error) {
      console.error("Failed to load members:", error);
    }
  };

  const handleAddMember = async () => {
    if (!newMemberName.trim()) return;
    try {
      await addMember(newMemberName.trim());
      setNewMemberName("");
      setIsAddMemberOpen(false);
      loadMembers(); // Reload members
      toast.success("Member added successfully");
    } catch (error) {
      toast.error("Failed to add member");
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;
    try {
      await deleteMember(memberToDelete);
      setMemberToDelete(null);
      loadMembers(); // Reload members
      toast.success("Member deleted successfully");
    } catch (error) {
      toast.error("Failed to delete member");
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const form = useForm<AssetInput>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      category: "",
      model: "",
      assignedTo: "",
      status: "Available",
      description: "",
      repairingDescription: "",
    },
  });

  useEffect(() => {
    if (asset) {
      form.reset({
        category: asset.category,
        model: asset.model,
        assignedTo: asset.assignedTo,
        status: asset.status,
        description: asset.description || "",
        repairingDescription: asset.repairingDescription || "",
      });
    } else {
      form.reset({
        category: "",
        model: "",
        assignedTo: "",
        status: "Available",
        description: "",
        repairingDescription: "",
      });
    }
  }, [asset, form]);

  const onSubmit = async (data: AssetInput) => {
    setIsSubmitting(true);
    try {
      if (asset) {
        await updateAsset(asset.id, data);
        toast.success("Asset has been updated successfully.");
        onOpenChange?.(false); // Close the dialog for editing
      } else {
        await addAsset(data);
        toast.success("Asset has been added successfully.");
        setOpen(false); // Close the dialog for adding
      }
      form.reset();
      onAssetAdded();
    } catch (error) {
      toast.error(`Failed to ${asset ? 'update' : 'add'} asset. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open || !!asset} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) {
        onOpenChange?.(false);
      }
    }}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Asset
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{asset ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
          <DialogDescription>
            {asset ? 'Update the asset details below.' : 'Fill in the details below to add a new IT asset to your inventory.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-172">
                        <SelectItem value="Laptop">Laptop</SelectItem>
                        <SelectItem value="Desktop">Desktop</SelectItem>
                        <SelectItem value="Server">Server</SelectItem>
                        <SelectItem value="Network Device">Network Device</SelectItem>
                        <SelectItem value="Network Equipment">Network Equipment</SelectItem>
                        <SelectItem value="Peripheral">Peripheral</SelectItem>
                        <SelectItem value="Software">Software</SelectItem>
                        <SelectItem value="Keyboard">Keyboard</SelectItem>
                        <SelectItem value="Mouse">Mouse</SelectItem>
                        <SelectItem value="Headphone">Headphone</SelectItem>
                        <SelectItem value="Cable">Cable</SelectItem>
                        <SelectItem value="Phone">Phone</SelectItem>
                        <SelectItem value="Mobile Device">Mobile Device</SelectItem>
                        <SelectItem value="Printer">Printer</SelectItem>
                        <SelectItem value="Monitor">Monitor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Precision 5560" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Retired">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <div className="flex gap-2">
                      <Popover open={openPopover} onOpenChange={setOpenPopover}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openPopover}
                              className="flex-1 justify-between"
                            >
                              {field.value
                                ? members.find((member) => member === field.value)
                                : "Select member..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search member..." />
                            <CommandList>
                              <CommandEmpty>No member found.</CommandEmpty>
                              <CommandGroup>
                                {members.map((member) => (
                                  <CommandItem
                                    key={member}
                                    value={member}
                                    onSelect={() => {
                                      field.onChange(member);
                                      setOpenPopover(false);
                                    }}
                                  >
                                    <Check
                                      className={`mr-2 h-4 w-4 ${
                                        member === field.value ? "opacity-100" : "opacity-0"
                                      }`}
                                    />
                                    {member}
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="ml-auto h-6 w-6 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setMemberToDelete(member);
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setIsAddMemberOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional details about the asset..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="repairingDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repairing Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Details about the repairing process..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (asset) {
                    onOpenChange?.(false);
                  } else {
                    setOpen(false);
                  }
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {asset ? 'Update Asset' : 'Add Asset'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
            <DialogDescription>
              Enter the name of the new member to add to the list.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Member name"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddMember();
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddMemberOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddMember} disabled={!newMemberName.trim()}>
                Add Member
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Member Confirmation */}
      <AlertDialog open={!!memberToDelete} onOpenChange={() => setMemberToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{memberToDelete}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMember}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

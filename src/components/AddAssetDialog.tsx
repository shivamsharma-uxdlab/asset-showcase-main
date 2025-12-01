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
import { Plus, Loader2 } from "lucide-react";
import { addAsset, updateAsset, AssetInput, AssetData, RepairingStatus } from "@/services/assetService";
import { toast } from "sonner";

const assetSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  category: z.string().min(1, "Category is required"),
  model: z.string().min(1, "Model is required").max(100),
  serialNumber: z.string().min(1, "Serial number is required").max(100),
  assignedTo: z.string().min(1, "Assigned to is required").max(100),
  location: z.string().min(1, "Location is required").max(200),
  status: z.enum(["Active", "Maintenance", "Retired", "Available"]),
  vendor: z.string().min(1, "Vendor is required").max(100),
  description: z.string().optional(),
  repairingStatus: z.enum(["Not Applicable", "Pending", "In Progress", "Completed"]).optional(),
  repairingDescription: z.string().optional(),
  extraItems: z.boolean().default(false),
  extraItemsDescription: z.string().optional(),
});

interface AddAssetDialogProps {
  onAssetAdded: () => void;
  asset?: AssetData;
  onOpenChange?: (open: boolean) => void;
}

export const AddAssetDialog = ({ onAssetAdded, asset, onOpenChange }: AddAssetDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AssetInput>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: "",
      category: "",
      model: "",
      serialNumber: "",
      assignedTo: "",
      location: "",
      status: "Available",
      vendor: "",
      description: "",
      repairingStatus: undefined,
      repairingDescription: "",
      extraItems: false,
      extraItemsDescription: "",
    },
  });

  useEffect(() => {
    if (asset) {
      form.reset({
        name: asset.name,
        category: asset.category,
        model: asset.model,
        serialNumber: asset.serialNumber,
        assignedTo: asset.assignedTo,
        location: asset.location,
        status: asset.status,
        vendor: asset.vendor,
        description: asset.description || "",
        repairingStatus: asset.repairingStatus,
        repairingDescription: asset.repairingDescription || "",
        extraItems: asset.extraItems || false,
        extraItemsDescription: asset.extraItemsDescription || "",
      });
    } else {
      form.reset({
        name: "",
        category: "",
        model: "",
        serialNumber: "",
        assignedTo: "",
        location: "",
        status: "Available",
        vendor: "",
        description: "",
        repairingStatus: undefined,
        repairingDescription: "",
        extraItems: false,
        extraItemsDescription: "",
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Dell Precision 5560" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      <SelectContent>
                        <SelectItem value="Laptop">Laptop</SelectItem>
                        <SelectItem value="Desktop">Desktop</SelectItem>
                        <SelectItem value="Server">Server</SelectItem>
                        <SelectItem value="Network Device">Network Device</SelectItem>
                        <SelectItem value="Peripheral">Peripheral</SelectItem>
                        <SelectItem value="Software">Software</SelectItem>
                        <SelectItem value="Keyboard">Keyboard</SelectItem>
                        <SelectItem value="Mouse">Mouse</SelectItem>
                        <SelectItem value="Headphone">Headphone</SelectItem>
                        <SelectItem value="Cable">Cable</SelectItem>
                        <SelectItem value="Phone">Phone</SelectItem>
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
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder="SN789456123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vendor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor</FormLabel>
                    <FormControl>
                      <Input placeholder="Dell Technologies" {...field} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="New York Office - Floor 3" {...field} />
                    </FormControl>
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
              name="extraItems"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Extra Items</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      {field.value ? "Yes" : "No"}
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {form.watch("extraItems") && (
              <FormField
                control={form.control}
                name="extraItemsDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Describe the extra items..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="repairingStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repairing Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select repairing status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                onClick={() => setOpen(false)}
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
    </Dialog>
  );
};

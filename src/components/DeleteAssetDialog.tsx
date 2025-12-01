import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteAsset } from "@/services/assetService";
import { toast } from "sonner";

interface DeleteAssetDialogProps {
  assetId: string;
  assetName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssetDeleted: () => void;
}

export const DeleteAssetDialog = ({
  assetId,
  assetName,
  open,
  onOpenChange,
  onAssetDeleted
}: DeleteAssetDialogProps) => {
  const handleDelete = async () => {
    try {
      await deleteAsset(assetId);
      toast.success("Asset has been deleted successfully.");
      onAssetDeleted();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to delete asset. Please try again.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Asset</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{assetName}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
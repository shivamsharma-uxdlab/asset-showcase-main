import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AssetData } from "@/services/assetService";

interface AssetPreviewDialogProps {
  asset: AssetData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AssetPreviewDialog = ({ asset, open, onOpenChange }: AssetPreviewDialogProps) => {
  if (!asset) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Asset Preview</DialogTitle>
          <DialogDescription>
            Details of the selected asset.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>Asset Name:</strong> {asset.name}
            </div>
            <div>
              <strong>Category:</strong> {asset.category}
            </div>
            <div>
              <strong>Model:</strong> {asset.model}
            </div>
            <div>
              <strong>Serial Number:</strong> {asset.serialNumber}
            </div>
            <div>
              <strong>Vendor:</strong> {asset.vendor}
            </div>
            <div>
              <strong>Status:</strong> {asset.status}
            </div>
            <div>
              <strong>Assigned To:</strong> {asset.assignedTo}
            </div>
            <div>
              <strong>Location:</strong> {asset.location}
            </div>
          </div>
          <div>
            <strong>Description:</strong>
            <p className="mt-1">{asset.description || "No description"}</p>
          </div>
          <div>
            <strong>Repairing Status:</strong> {asset.repairingStatus && asset.repairingStatus !== "Not Applicable" ? asset.repairingStatus : "N/A"}
          </div>
          <div>
            <strong>Repairing Description:</strong>
            <p className="mt-1">{asset.repairingDescription || "No repairing description"}</p>
          </div>
          <div>
            <strong>Extra Items:</strong> {asset.extraItems ? "Yes" : "No"}
          </div>
          {asset.extraItems && (
            <div>
              <strong>Extra Items Description:</strong>
              <p className="mt-1">{asset.extraItemsDescription || "No description"}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
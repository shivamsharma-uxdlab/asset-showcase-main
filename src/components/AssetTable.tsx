import { useState, useMemo, useEffect } from "react";
import { StatusBadge } from "./StatusBadge";
import { AddAssetDialog } from "./AddAssetDialog";
import { DeleteAssetDialog } from "./DeleteAssetDialog";
import { AssetPreviewDialog } from "./AssetPreviewDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAssets, AssetData } from "@/services/assetService";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal
} from "lucide-react";

type SortField = keyof AssetData;
type SortDirection = "asc" | "desc" | null;

const truncateDescription = (description: string | undefined): string => {
  if (!description) return "N/A";
  const words = description.split(" ");
  if (words.length <= 3) return description;
  return words.slice(0, 3).join(" ") + "...";
};

export const AssetTable = () => {
  const [assets, setAssets] = useState<AssetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [editingAsset, setEditingAsset] = useState<AssetData | undefined>(undefined);
  const [deletingAsset, setDeletingAsset] = useState<AssetData | undefined>(undefined);
  const [previewAsset, setPreviewAsset] = useState<AssetData | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const fetchedAssets = await getAssets();
      setAssets(fetchedAssets);
    } catch (error) {
      toast.error("Failed to load assets. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortField(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    if (sortDirection === "asc") return <ArrowUp className="ml-2 h-4 w-4" />;
    if (sortDirection === "desc") return <ArrowDown className="ml-2 h-4 w-4" />;
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  const filteredAndSortedAssets = useMemo(() => {
    let filtered = assets.filter((asset) => {
      const matchesSearch =
        asset.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.status.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || asset.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || asset.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    if (sortField && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortField] || "";
        const bValue = b[sortField] || "";

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [assets, searchQuery, statusFilter, categoryFilter, sortField, sortDirection]);

  const uniqueStatuses = Array.from(new Set(assets.map(asset => asset.status)));

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Asset Inventory</h2>
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `${assets.length} total assets`}
          </p>
        </div>
        <AddAssetDialog
          onAssetAdded={loadAssets}
          asset={editingAsset}
          onOpenChange={(open) => {
            if (!open) {
              setEditingAsset(undefined);
            }
          }}
        />
        <DeleteAssetDialog
          assetId={deletingAsset?.id || ""}
          assetName={deletingAsset?.name || ""}
          open={!!deletingAsset}
          onOpenChange={(open) => {
            if (!open) {
              setDeletingAsset(undefined);
            }
          }}
          onAssetDeleted={loadAssets}
        />
        <AssetPreviewDialog
          asset={previewAsset}
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
        />
      </div>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by assignee or status..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4">
          <Select value={categoryFilter} onValueChange={(value) => {
            setCategoryFilter(value);
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="max-h-172">
              <SelectItem value="all">All Categories</SelectItem>
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
          <Select value={statusFilter} onValueChange={(value) => {
            setStatusFilter(value);
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="Retired">Retired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[60px] font-semibold select-none">#</TableHead>
                <TableHead className="font-semibold select-none">Category</TableHead>
                <TableHead className="font-semibold select-none">Model</TableHead>
                <TableHead className="font-semibold select-none">Assigned To</TableHead>
                <TableHead className="font-semibold select-none">Status</TableHead>
                <TableHead className="font-semibold select-none">Repairing Description</TableHead>
                <TableHead className="w-[50px] font-semibold select-none">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Loading assets...
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedAssets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No assets found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedAssets.map((asset, index) => (
                   <TableRow
                     key={asset.id}
                     className="hover:bg-muted/30 transition-colors cursor-pointer"
                     onClick={() => {
                       setPreviewAsset(asset);
                       setIsPreviewOpen(true);
                     }}
                   >
                    <TableCell className="font-medium text-muted-foreground whitespace-nowrap">
                      UXD-{String(index + 1).padStart(3, '0')}
                    </TableCell>
                    <TableCell>{asset.category}</TableCell>
                    <TableCell>{asset.model}</TableCell>
                    <TableCell>{asset.assignedTo}</TableCell>
                    <TableCell>
                      <StatusBadge status={asset.status} />
                    </TableCell>
                    <TableCell>{truncateDescription(asset.repairingDescription)}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingAsset(asset)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeletingAsset(asset)}
                            className="text-destructive focus:text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setPreviewAsset(asset); setIsPreviewOpen(true); }}>View Details</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
   </div>
  );
};

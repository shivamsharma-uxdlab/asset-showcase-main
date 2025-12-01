import { AssetTable } from "@/components/AssetTable";
import { Server } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Server className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">IT Asset Management</h1>
              <p className="text-sm text-muted-foreground">Track and manage your organization's IT assets</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <AssetTable />
      </div>
    </div>
  );
};

export default Index;

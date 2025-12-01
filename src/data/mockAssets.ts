export interface Asset {
  id: string;
  name: string;
  category: string;
  model: string;
  serialNumber: string;
  assignedTo: string;
  location: string;
  purchaseDate: string;
  warrantyExpiry: string;
  status: "Active" | "Maintenance" | "Retired" | "Available";
  vendor: string;
}

export const mockAssets: Asset[] = [
  {
    id: "AST-001",
    name: "Dell Precision 5560",
    category: "Laptop",
    model: "Precision 5560",
    serialNumber: "SN789456123",
    assignedTo: "Sarah Chen",
    location: "New York Office - Floor 3",
    purchaseDate: "2023-01-15",
    warrantyExpiry: "2026-01-15",
    status: "Active",
    vendor: "Dell Technologies"
  },
  {
    id: "AST-002",
    name: "iPhone 14 Pro",
    category: "Mobile Device",
    model: "iPhone 14 Pro 256GB",
    serialNumber: "IMEI123456789012345",
    assignedTo: "Michael Rodriguez",
    location: "San Francisco Office - Floor 2",
    purchaseDate: "2023-03-22",
    warrantyExpiry: "2024-03-22",
    status: "Active",
    vendor: "Apple Inc."
  },
  {
    id: "AST-003",
    name: "HP LaserJet Pro",
    category: "Printer",
    model: "LaserJet Pro M404dn",
    serialNumber: "HPLJ98765432",
    assignedTo: "IT Department",
    location: "London Office - Floor 1",
    purchaseDate: "2022-08-10",
    warrantyExpiry: "2025-08-10",
    status: "Maintenance",
    vendor: "HP Inc."
  },
  {
    id: "AST-004",
    name: "ThinkPad X1 Carbon",
    category: "Laptop",
    model: "X1 Carbon Gen 10",
    serialNumber: "LEN456789123",
    assignedTo: "Emma Wilson",
    location: "Toronto Office - Floor 4",
    purchaseDate: "2023-05-18",
    warrantyExpiry: "2026-05-18",
    status: "Active",
    vendor: "Lenovo"
  },
  {
    id: "AST-005",
    name: "Dell UltraSharp Monitor",
    category: "Monitor",
    model: "U2723DE 27\"",
    serialNumber: "DELL123456789",
    assignedTo: "Unassigned",
    location: "New York Office - Storage",
    purchaseDate: "2022-11-30",
    warrantyExpiry: "2025-11-30",
    status: "Available",
    vendor: "Dell Technologies"
  },
  {
    id: "AST-006",
    name: "Cisco Router 2900",
    category: "Network Equipment",
    model: "Cisco 2900 Series",
    serialNumber: "CSC987654321",
    assignedTo: "Network Team",
    location: "Data Center - Rack 12",
    purchaseDate: "2021-04-05",
    warrantyExpiry: "2024-04-05",
    status: "Retired",
    vendor: "Cisco Systems"
  }
];

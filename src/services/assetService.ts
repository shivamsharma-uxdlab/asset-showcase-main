import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
  where
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type AssetStatus = "Active" | "Maintenance" | "Retired" | "Available";

export interface AssetInput {
  name: string;
  category: string;
  model: string;
  serialNumber: string;
  assignedTo: string;
  location: string;
  status: AssetStatus;
  description?: string;
  repairingDescription?: string;
  extraItems: boolean;
  extraItemsDescription?: string;
}

export interface AssetData extends AssetInput {
  id: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  description?: string;
  repairingDescription?: string;
  extraItems: boolean;
  extraItemsDescription?: string;
}

const COLLECTION_NAME = "assets";
const MEMBERS_COLLECTION = "members";

export const addAsset = async (assetData: AssetInput): Promise<string> => {
  try {
    const docData: any = {
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    // Only include defined values
    Object.keys(assetData).forEach(key => {
      if (assetData[key as keyof AssetInput] !== undefined) {
        docData[key] = assetData[key as keyof AssetInput];
      }
    });

    const docRef = await addDoc(collection(db, COLLECTION_NAME), docData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding asset:", error);
    throw error;
  }
};

export const updateAsset = async (id: string, assetData: AssetInput): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData: any = {
      updatedAt: Timestamp.now()
    };

    // Only include defined values to avoid Firebase undefined errors
    Object.keys(assetData).forEach(key => {
      if (assetData[key as keyof AssetInput] !== undefined) {
        updateData[key] = assetData[key as keyof AssetInput];
      }
    });

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error("Error updating asset:", error);
    throw error;
  }
};

export const deleteAsset = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting asset:", error);
    throw error;
  }
};

export const getAssets = async (): Promise<AssetData[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "asc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        category: data.category,
        model: data.model,
        serialNumber: data.serialNumber,
        assignedTo: data.assignedTo,
        location: data.location,
        status: data.status,
        description: data.description,
        repairingDescription: data.repairingDescription,
        extraItems: data.extraItems || false,
        extraItemsDescription: data.extraItemsDescription
      } as AssetData;
    });
  } catch (error) {
    console.error("Error fetching assets:", error);
    throw error;
  }
};

export const addMember = async (name: string): Promise<string> => {
  try {
    const docData = {
      name: name.trim(),
      createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, MEMBERS_COLLECTION), docData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding member:", error);
    throw error;
  }
};

export const getMembers = async (): Promise<string[]> => {
  try {
    const q = query(collection(db, MEMBERS_COLLECTION), orderBy("createdAt", "asc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => doc.data().name as string);
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error;
  }
};

export const deleteMember = async (name: string): Promise<void> => {
  try {
    const q = query(collection(db, MEMBERS_COLLECTION), where("name", "==", name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await deleteDoc(docRef);
    }
  } catch (error) {
    console.error("Error deleting member:", error);
    throw error;
  }
};

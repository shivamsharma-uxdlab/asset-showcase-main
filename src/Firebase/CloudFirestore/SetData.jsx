import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

// Add Document to a Collection
export const addDocument = async (collectionName, data) => {
  return await addDoc(collection(db, collectionName), {
    ...data,
  }).catch((err) => console.log(err));
};

// Create a Document with DocId
export const createDocument = async (collectionName, docId, data) => {
 const result = await setDoc(doc(db, collectionName, docId), {
    ...data,
  });
  console.log(result);
  return result
};

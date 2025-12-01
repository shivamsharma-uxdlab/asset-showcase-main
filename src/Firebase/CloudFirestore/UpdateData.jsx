import { updateDoc, arrayUnion, doc, arrayRemove, FieldValue, increment } from "firebase/firestore";
import { db } from "../../firebase";

// Update a document to a Collection
export const updateDocument = async (collectionName, docId, data) => {
  const res = await updateDoc(doc(db, collectionName, docId), {
    ...data,
  }).catch((err) => console.log(err));

  return res;
};

// Update arrays of a Collection
export const updateArray = async (collectionName, docId, key, data) => {
  const res = await updateDoc(doc(db, collectionName, docId), {
    [key]: arrayUnion(data),
  }).catch((err) => console.log(err));

  return res;
};
export const incrementDecrement = async (collectionName, docId, key) => {
  const res = await updateDoc(doc(db, collectionName, docId), {
    [key]: increment(1),

  }).catch((err) => console.log(err));

  return res;
};

export const pushValuetoArrayInDoc=async(collectionName,docId,fieldName,valueToPush)=>{
  let docRef=doc(db, collectionName, docId)
  return await updateDoc(docRef, {
    [fieldName]: arrayUnion(valueToPush)
})
}

export const removeValuetoArrayInDoc=async(collectionName,docId,fieldName,valueToRemove)=>{
  let docRef=doc(db, collectionName, docId)
  return await updateDoc(docRef, {
    [fieldName]: arrayRemove(valueToRemove)
})
}


export const incrementNumber = async (collectionName,documentId, key, value) => {
  const res = await updateDoc(doc(db, collectionName, documentId), {
    [key]: increment(value),

  }).catch((err) => console.log(err));

  return res;
};


export const decrementNumber = async (collectionName,documentId, key, value) => {
  const res = await updateDoc(doc(db, collectionName, documentId), {
    [key]: increment(-(value)),

  }).catch((err) => console.log(err));

  return res;
};

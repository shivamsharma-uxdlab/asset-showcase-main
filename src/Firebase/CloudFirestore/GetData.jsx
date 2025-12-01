import { db } from "../../firebase";
import {
  doc,
  query,
  where,
  getDoc,
  getDocs,
  collection,
  orderBy,
  onSnapshot,
  getCountFromServer,
  limit,
} from "firebase/firestore";

// Get all the data from a collection
export const getCollectionData = async (collectionName) => {
  const arr = [];
  let querySnapshot;

  if (collectionName === "jobs") {
    const dataQuery = query(
      collection(db, collectionName),
      orderBy("submitDate", "desc")
    );
    querySnapshot = await getDocs(dataQuery);
  } else {
    querySnapshot = await getDocs(collection(db, collectionName));
  }

  querySnapshot.forEach((doc) => {
    arr.push({ id: doc.id, ...doc.data() });
  });

  return arr;
};

// Get all the data from a document
export const getDocumentData = async (collectionName, documentName) => {
  const docRef = doc(db, collectionName, documentName);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { ...docSnap.data(), id: documentName };
  } else {
    console.log("No such document!");
  }
};

// Get Number of Documents in Collection
export const numOfDocuments = async (collectionName) => {
  const data = await getCollectionData(collectionName);
  return data.length;
};

// Get Data using a Query
export const getMatchingData = async (collectionName, key, operator, value) => {
  const arr = [];

  const dataQuery = query(
    collection(db, collectionName),
    where(key, operator, value)
  );

  const querySnapshot = await getDocs(dataQuery);

  querySnapshot.forEach((doc) => {
    arr.push({ id: doc.id, ...doc.data() });
  });

  return arr;
};

export const getSnapShotData = async (collectionName, key, operator, value) => {

  const dataQuery = query(
    collection(db, collectionName),
    where(key, operator, value)
  );

  onSnapshot(dataQuery, (snapShot) => {
    let data = snapShot.docs.map((doc) => doc.data());
    console.log(data);
    return data;
  });
};

export const compoundQuery = async (collectionName, QueryArr) => {
  const arr = [];
  const queryParams = [];

  QueryArr.forEach((e) => {
    queryParams.push(where(e.key, e.operator, e.value));
  });

  const dataQuery = query(collection(db, collectionName), ...queryParams);

  const querySnapshot = await getDocs(dataQuery);

  querySnapshot.forEach((doc) => {
    arr.push({ id: doc.id, ...doc.data() });
  });

  return arr;
};


export const getLatestData = async (collectionName, QueryArr, orderByKey) => {

  const arr = [];
  const queryParams = [];

  QueryArr.forEach((e) => {
    queryParams.push(where(e.key, e.operator, e.value));
  });

  const dataQuery = query(collection(db, collectionName), ...queryParams,orderBy("created_at", "desc"),limit(1));

  // const querySnapshot = await getDocs(dataQuery).orderByChild(orderByKey).limitToLast(1)
  const querySnapshot = await getDocs(dataQuery)

  querySnapshot.forEach((doc) => {
    arr.push({ id: doc.id, ...doc.data() });
  });

  return arr;

}

export const getOrderByCollectionData = async (
  collectionName,
  orderByField,
  order
) => {
  const q = query(collection(db, collectionName), orderBy(orderByField, order));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getCoumpoundQueryLength = async (
  collectionName,
  QueryArr
) => {
  try {

    const arr = [];
    const queryParams = [];

    QueryArr.forEach((e) => {
      queryParams.push(where(e.key, e.operator, e.value));
    });

    const dataQuery = query(collection(db, collectionName), ...queryParams);

    let dd = await getCountFromServer(dataQuery)

    return dd.data().count
  } catch (err) {
    console.log(err)
  }
}


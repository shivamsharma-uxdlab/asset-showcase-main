import { auth } from "../../firebase";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import { createDocument } from "../CloudFirestore/SetData";
import { getDocumentData } from "../CloudFirestore/GetData";
// Login users using their Email and Password
export const emailPasswordLogin = async (mail, pass) => {
  const res = await signInWithEmailAndPassword(auth, mail, pass).catch((err) =>{
//  alert("Incorrect Email or Password");
    return false
  }
  );

  return res;
};

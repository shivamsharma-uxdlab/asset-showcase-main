import {
  sendPasswordResetEmail,
  EmailAuthProvider,
  updatePassword,
  reauthenticateWithCredential,
  deleteUser
} from "firebase/auth";
import { auth } from "../../firebase";

export const UserForgotPassword = async (mail) => {
  const res = await sendPasswordResetEmail(auth, mail);
  // .catch((err)=>{
  // console.log(err)
  //   alert("please cheack your email")
  // });
  return res;
};
export const ForgotPassword = async ( password, newPassword) => {
  try {
    const currentUser = auth.currentUser;
    console.log(currentUser);
    // Get the user's credentials and reauthenticate the user
    const credential = await EmailAuthProvider.credential(
      currentUser.email,
      password
    );
    await reauthenticateWithCredential(currentUser, credential);

    // Change the user's password
    await updatePassword(currentUser, newPassword);
  } catch (error) {
    console.log(error);
  }
};



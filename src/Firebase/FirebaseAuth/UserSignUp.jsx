import { async } from "q";
import { auth } from "../../firebase";
import {
  updateProfile,
  sendEmailVerification,
  createUserWithEmailAndPassword,
} from "firebase/auth";

// SignUp users using their Email and Password
export const emailPasswordSignUp = async (name, mail, pass) => {
  const res = await createUserWithEmailAndPassword(auth, mail, pass)
    .then(async (res) => {
      console.log(res, "1");
       let data = {
         uid: res.user.uid,
         email: res.user.email,
       };
       console.log(data, "2");
       
      await updateProfile(auth.currentUser, { displayName: name }).then(
        // async () => {
        //   await sendEmailVerification(auth.currentUser).then((res1) => {
           
        //   });
        // }
      );
      return data; 
    })
    .catch((err) => {
      return err.message;
    });
  console.log( res,"gfhfvhg");
  return res;
};

export const updateName = async (nameOne, nameTwo) => {
  const res = await updateProfile(auth.currentUser, {
    displayName: nameOne || nameTwo,
  });

  return res;
};

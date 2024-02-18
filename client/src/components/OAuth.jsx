import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "flowbite-react";
import { FaGooglePlus } from "react-icons/fa";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const response = await axios.post("/api/auth/google", {
        username: resultsFromGoogle.user.displayName,
        email: resultsFromGoogle.user.email,
        googlePhotoUrl: resultsFromGoogle.user.photoURL,
      });
      if (response.data.success) {
        dispatch(signInSuccess(response.data.user));
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button
      onClick={handleGoogleClick}
      type="button"
      outline
      gradientDuoTone="pinkToOrange"
      pill
      size="lg"
      fullSized
      className="mb-5"
    >
      <FaGooglePlus className="mr-5" size={20} />
      <span>Continue with Google</span>
    </Button>
  );
}

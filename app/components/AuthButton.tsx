"use client";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useAuth } from "../../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Link from "next/link";

export const SignInButton = () => {
  const { user } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Sign-in error", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign-out error", error);
    }
  };

  return (
    <Stack direction="column" alignItems="center" spacing={2}>
      {user ? (
        <Button variant="contained" color="secondary" onClick={handleSignOut}>
          Sign Out
        </Button>
      ) : (
        <>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSignIn}
            startIcon={<FcGoogle />}
            style={{ textTransform: "none" }}
          >
            Sign In with Google
          </Button>
          <Typography variant="body2">
            Don&apos;t have an account?
            <Button color="primary">
              {" "}
              <Link href="/register">Register</Link>
            </Button>
          </Typography>
        </>
      )}
    </Stack>
  );
};

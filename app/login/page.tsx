"use client";
import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { SignInButton } from "../components/AuthButton";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null); // Track authentication state
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Update user state on auth state change
      if (user) {
        router.push("/home"); // Redirect to home page if user is logged in
      }
    });
    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Failed to sign in. Please check your credentials.");
      console.error("Sign-in error", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign-out error", err);
    }
  };

  return (
    <Stack direction="column" alignItems="center" spacing={3} sx={{ mt: 4 }}>
      {user ? (
        <>
          <Typography variant="h4">Welcome, {user.email}</Typography>
          <Button variant="contained" color="secondary" onClick={handleSignOut}>
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h4">Login</Typography>
          <SignInButton />
          <Typography variant="body2" color="textSecondary">
            or login with email and password
          </Typography>
          <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: 400 }}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
              />
              {error && (
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              )}
              <Button variant="contained" color="primary" type="submit">
                Login
              </Button>
            </Stack>
          </form>
        </>
      )}
    </Stack>
  );
}

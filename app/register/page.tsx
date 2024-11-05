"use client";
import React, { useState } from "react";
import { Typography, TextField, Button, Stack } from "@mui/material";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase"; // Ensure this path points to your Firebase config

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setReapeatPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");
  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(""); // Reset error before new attempt

    try {
      // Register user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Optionally, update the display name
      await updateProfile(user, { displayName });

      console.log("User registered:", user);
      // Redirect to another page or clear the form here if needed
    } catch (error: any) {
      console.error("Registration error:", error.message);
      setError(error.message);
    }
  };

  return (
    <Stack spacing={2} alignItems="center">
      <Typography variant="h3">Register</Typography>

      <form onSubmit={handleRegister}>
        <Stack spacing={2} width="300px">
          <TextField
            label="Name"
            variant="outlined"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <TextField
            label=" Repeat Password"
            variant="outlined"
            type="password"
            value={repeatPassword}
            onChange={(e) => setReapeatPassword(e.target.value)}
            required
          />

          {error && (
            <Typography color="error" variant="body2">
              {repeatPasswordError}
            </Typography>
          )}

          <Button variant="contained" color="primary" type="submit">
            Register
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default Register;

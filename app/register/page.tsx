"use client";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "@firebase/auth";
import { useRouter } from "next/navigation";
import {
  collection,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { Button, TextField, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth(); // Access authentication state
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSignOut = async () => {
    await signOut(auth); // Sign out user
    router.push("/login"); // Redirect to login page
  };

  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    // Listen for real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return unsubscribe; // Cleanup on component unmount
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      try {
        await addDoc(collection(db, "messages"), {
          text: newMessage,
          userId: user?.uid,
          userEmail: user?.email, // Store user email for display
          timestamp: serverTimestamp(),
        });
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }
  };

  return (
    <div>
      {user ? (
        <>
          <h1>Welcome, {user.email}</h1>
          <Button variant="contained" color="secondary" onClick={handleSignOut}>
            Sign Out
          </Button>

          <Stack
            spacing={2}
            sx={{ width: "100%", maxWidth: 500, mx: "auto", mt: 4 }}
          >
            <Typography variant="h4" align="center">
              Chat Room
            </Typography>
            <Stack
              spacing={1}
              sx={{
                height: "300px",
                overflowY: "scroll",
                border: "1px solid #ddd",
                padding: 2,
                borderRadius: 1,
              }}
            >
              {messages.map((message) => (
                <div key={message.id}>
                  <Typography
                    variant="body2"
                    color={
                      message.userId === user?.uid ? "primary" : "textSecondary"
                    }
                  >
                    {message.userEmail || "User"}: {message.text}
                  </Typography>
                </div>
              ))}
            </Stack>

            <form onSubmit={handleSendMessage}>
              <Stack direction="row" spacing={1}>
                <TextField
                  fullWidth
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button variant="contained" type="submit">
                  Send
                </Button>
              </Stack>
            </form>
          </Stack>
        </>
      ) : (
        <>
          <h1>Please log in</h1>{" "}
          <Button variant="contained">
            <Link href="/login">Click Here to Login</Link>
          </Button>
        </>
      )}
    </div>
  );
}

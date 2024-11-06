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
import {
  Button,
  TextField,
  Stack,
  Typography,
  Avatar,
  Paper,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import LoginPage from "../login/page";
import { formatRelative } from "date-fns";

export default function Home() {
  const { user } = useAuth(); // Access authentication state
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  useEffect(() => {
    if (!user) return;

    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    return unsubscribe;
  }, [user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      try {
        await addDoc(collection(db, "messages"), {
          text: newMessage,
          userId: user?.uid,
          userEmail: user?.email,
          userPhoto: user?.photoURL || "",
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
        <Stack sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }} spacing={2}>
          <Typography variant="h4" align="center">
            Chat Room
          </Typography>
          <Button variant="contained" color="secondary" onClick={handleSignOut}>
            Sign Out
          </Button>
          <Paper
            elevation={3}
            sx={{
              height: "60vh",
              overflowY: "scroll",
              padding: 2,
              borderRadius: 2,
              border: "1px solid #ddd",
            }}
          >
            {messages.map((message) => (
              <Stack
                key={message.id}
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                  mb: 2,
                  justifyContent:
                    message.userId === user?.uid ? "flex-end" : "flex-start",
                }}
              >
                {message.userId !== user?.uid && (
                  <Avatar src={message.userPhoto} alt="User Avatar" />
                )}
                <Paper
                  sx={{
                    p: 1.5,
                    bgcolor:
                      message.userId === user?.uid
                        ? "primary.light"
                        : "grey.200",
                    borderRadius: 2,
                    maxWidth: "75%",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {message.userId === user?.uid ? "You" : message.userEmail}
                  </Typography>
                  <Typography variant="body1">{message.text}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {message.timestamp?.seconds
                      ? formatRelative(
                          new Date(message.timestamp.seconds * 1000),
                          new Date()
                        )
                      : ""}
                  </Typography>
                </Paper>
                {message.userId === user?.uid && (
                  <Avatar src={user?.photoURL || ""} alt="User Avatar" />
                )}
              </Stack>
            ))}
            <div ref={scrollRef} />
          </Paper>
          <form onSubmit={handleSendMessage}>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button
                variant="contained"
                type="submit"
                disabled={!newMessage.trim()}
              >
                Send
              </Button>
            </Stack>
          </form>
        </Stack>
      ) : (
        <LoginPage />
      )}
    </div>
  );
}

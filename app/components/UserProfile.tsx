"use client";
import { useAuth } from "../../context/AuthContext";
import image from "../../public/image.png";
export const UserProfile = () => {
  const { user } = useAuth();

  if (!user) return <p>Please sign in.</p>;

  return (
    <div>
      <p>Welcome, {user.displayName}!</p>
      <img src={user.photoURL || image} alt="User Profile" />
    </div>
  );
};

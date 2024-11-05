// app/page.tsx

import { AuthProvider } from "../context/AuthContext";
import AuthButton from "./components";
export default function Home() {
  return (
    <AuthProvider>
      <main>
        <AuthButton />
      </main>
    </AuthProvider>
  );
}

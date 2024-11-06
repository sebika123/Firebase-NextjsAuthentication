import { AuthProvider } from "../context/AuthContext";
import LoginPage from "./login/page";
export default function Home() {
  return (
    <AuthProvider>
      <main>
        <LoginPage />
      </main>
    </AuthProvider>
  );
}

import { AuthProvider } from "@/context/AuthContext";
import type { AppProps } from "next/app";

function Home({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default Home;

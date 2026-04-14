import type { AppProps } from "next/app";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "@/components/ui/toaster";
import { WhatsAppFloating } from "@/components/WhatsAppFloating";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Component {...pageProps} />
        <Toaster />
        <WhatsAppFloating />
      </LanguageProvider>
    </ThemeProvider>
  );
}

import "../styles/global.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;

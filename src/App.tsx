import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { Router } from "./pages/Router";

export default function App() {
  return (
      <MantineProvider theme={theme}>
        <Router />
      </MantineProvider>
  );
}

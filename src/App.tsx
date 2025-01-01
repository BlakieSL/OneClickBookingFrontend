import "@mantine/core/styles.css";
import '@mantine/carousel/styles.css';
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { Router } from "./pages/Router";
import './helpers/axiosConfig';
import './css/index.scss';
import '@mantine/dates/styles.css';
import {FiltersProvider} from "./context/FilterContext";

export default function App() {
    return (
        <MantineProvider theme={theme}>
            <FiltersProvider>
                <Router />
            </FiltersProvider>
        </MantineProvider>
    );
}

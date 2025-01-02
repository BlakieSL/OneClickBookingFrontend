import "@mantine/core/styles.css";
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import {MantineProvider} from "@mantine/core";
import {theme} from "./theme";
import {Router} from "./pages/Router";
import './helpers/axiosConfig';
import './css/index.scss';
import '@mantine/dates/styles.css';
import {FiltersProvider} from "./context/FilterContext";
import {Notifications} from "@mantine/notifications";

export default function App() {
    return (
        <MantineProvider theme={theme} >
            <FiltersProvider>
                <Notifications />
                <Router />
            </FiltersProvider>
        </MantineProvider>
    );
}

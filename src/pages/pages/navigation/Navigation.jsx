import {ActionIcon, AppShell, Box, Button, Group} from "@mantine/core";
import {Outlet, useNavigate} from "react-router-dom";
import {IconUsers, IconUser, IconMapPins} from "@tabler/icons-react";
import styles from "./navigation.module.scss";

const Navigation = () => {
    const navigate = useNavigate();

    const handleNavigateToServicePoints = () => {
        navigate('/service-points');
    }

    const handleNavigateToEmployees = () => {
        navigate('/employees');
    }

    const handleNavigateToUser = () => {
        navigate('/user');
    }

    return (
        <AppShell>
            <AppShell.Header className={styles.header}>
                <ActionIcon
                    size={40}
                    onClick={handleNavigateToServicePoints}
                    className={styles.header__icon}
                >
                    <IconMapPins/>
                </ActionIcon>

                <ActionIcon
                    size={40}
                    onClick={handleNavigateToEmployees}
                    className={styles.header__icon}
                >
                    <IconUsers/>
                </ActionIcon>

                <ActionIcon
                    size={40}
                    onClick={handleNavigateToUser}
                    className={styles.header__icon}
                >
                    <IconUser/>
                </ActionIcon>
            </AppShell.Header>
            <AppShell.Main>
                <Box className={styles.main}>
                    <Outlet />
                </Box>
            </AppShell.Main>
        </AppShell>
    )
};

export default Navigation;
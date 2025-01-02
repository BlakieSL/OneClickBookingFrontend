import {ActionIcon, AppShell, Box, Group} from "@mantine/core";
import {Outlet, useNavigate} from "react-router-dom";
import {IconCalendarEvent, IconMapPins, IconStar, IconUser, IconUsers} from "@tabler/icons-react";
import styles from "./navigation.module.scss";
import {isUserAdmin} from "../../../helpers/tokenUtils.js";
import Locale from "../../../components/general/Locale.jsx";

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

    const handleNavigateToAdminReviews = () => {
        navigate('/admin-reviews');
    }

    const handleNavigateToAdminBookings = () => {
        navigate('/admin-bookings');
    }

    return (
        <AppShell>
            <AppShell.Header className={styles.header}>
                <Group>
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
                </Group>

                {isUserAdmin() && (
                    <Group>
                        <ActionIcon
                            size={40}
                            onClick={handleNavigateToAdminBookings}
                            className={styles.header__adminIcon}
                        >
                            <IconCalendarEvent />
                        </ActionIcon>

                        <ActionIcon
                            size={40}
                            onClick={handleNavigateToAdminReviews}
                            className={styles.header__adminIcon}
                        >
                            <IconStar />
                        </ActionIcon>
                    </Group>
                )}

                <Group>
                    <Locale />
                    <ActionIcon
                        size={40}
                        onClick={handleNavigateToUser}
                        className={styles.header__icon}
                    >
                        <IconUser/>
                    </ActionIcon>
                </Group>
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
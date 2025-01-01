import {ActionIcon, AppShell, Box, Button, Group} from "@mantine/core";
import {Outlet, useNavigate} from "react-router-dom";
import {IconUsers, IconUsersGroup, IconUser, IconMapPins, IconCalendarEvent, IconStar} from "@tabler/icons-react";
import styles from "./navigation.module.scss";
import {isUserAdmin} from "../../../helpers/tokenUtils.js";

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

    const handleNavigateToAdminUsers = () => {
        navigate('/admin-users');
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
                            onClick={handleNavigateToAdminUsers}
                            className={styles.header__adminIcon}
                        >
                            <IconUsersGroup />

                        </ActionIcon>

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
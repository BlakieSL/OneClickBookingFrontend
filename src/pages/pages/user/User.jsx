import styles from "./user.module.scss";
import {useEffect, useState} from "react";
import {Container, Group, Loader, NavLink, Paper} from "@mantine/core";
import {getUserById} from "../../../apis/userApi.js";
import {getUser} from "../../../helpers/tokenUtils.js";
import Account from "../../../components/user/Account.jsx";
const User = () => {
    const [activeTab, setActiveTab] = useState('account');
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const userId = getUser();
                const user = await getUserById(userId);
                setUser(user);
            } catch (error) {
                setError("Failed to fetch user");
                console.error(error);
            } finally {
                setUserLoading(false);
            }
        })();
    }, []);

    if (userLoading) {
        return <Loader />;
    }

    return (
        <Container className={styles.outerContainer}>
            <Paper className={styles.sideBarContainer}>
                <Group>
                    <NavLink
                        label="Account"
                        active={activeTab === 'account'}
                        onClick={() => setActiveTab('account')}
                        className={activeTab === 'account' ? styles.activeTab : ''}
                        styles={{

                        }}
                    />
                    <NavLink
                        label="Bookings"
                        active={activeTab === 'bookings'}
                        onClick={() => setActiveTab('bookings')}
                        className={activeTab === 'bookings' ? styles.activeTab : ''}
                    />
                    <NavLink
                        label="Reviews"
                        active={activeTab === 'reviews'}
                        onClick={() => setActiveTab('reviews')}
                        className={activeTab === 'reviews' ? styles.activeTab : ''}
                    />
                </Group>
            </Paper>
            <Paper className={styles.mainContainer}>
                {activeTab === 'account' && <Account user={user} /> }
            </Paper>
        </Container>
    )
}

export default User;
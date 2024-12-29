import styles from "./user.module.scss";
import {useEffect, useState} from "react";
import {Container, Group, Loader, NavLink, Paper} from "@mantine/core";
import {getUserById} from "../../../apis/userApi.js";
import {getUser} from "../../../helpers/tokenUtils.js";
import Account from "../../../components/user/account/Account.jsx";
import UserBookings from "../../../components/user/bookings/UserBookings.jsx";
import UserReviews from "../../../components/user/reviews/UserReviews.jsx";
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
                        label="UserBookings"
                        active={activeTab === 'bookings'}
                        onClick={() => setActiveTab('bookings')}
                        className={activeTab === 'bookings' ? styles.activeTab : ''}
                    />
                    <NavLink
                        label="UserReviews"
                        active={activeTab === 'reviews'}
                        onClick={() => setActiveTab('reviews')}
                        className={activeTab === 'reviews' ? styles.activeTab : ''}
                    />
                </Group>
            </Paper>
            <Paper className={styles.mainContainer}>
                {activeTab === 'account' && <Account user={user} /> }
                {activeTab === 'bookings' && <UserBookings user={user} />  }
                {activeTab === 'reviews' && <UserReviews user={user} /> }
            </Paper>
        </Container>
    )
}

export default User;
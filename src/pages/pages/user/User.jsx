import styles from "./user.module.scss";
import {useEffect, useState} from "react";
import {Box, Container, Group, Loader, NavLink} from "@mantine/core";
import {getUserById} from "../../../apis/userApi.js";
import {getUser} from "../../../helpers/tokenUtils.js";
import Account from "../../../components/user/account/Account.jsx";
import UserBookings from "../../../components/user/bookings/UserBookings.jsx";
import UserReviews from "../../../components/user/reviews/UserReviews.jsx";
import {showErrorNotification} from "../../../helpers/constants.js";
import {useTranslation} from "react-i18next";

const User = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('account');
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    const [highlightedBookingId, setHighlightedBookingId] = useState(null);

    useEffect(() => {
        (async () => {
            await fetchUser();
        })();
    }, []);

    const fetchUser = async () => {
        try {
            const userId = getUser();
            const user = await getUserById(userId);
            setUser(user);
        } catch (error) {
            showErrorNotification(error);
            console.error(error);
        } finally {
            setUserLoading(false);
        }
    }

    const handleSeeBooking = (bookingId) => {
        setActiveTab("bookingCard");
        setHighlightedBookingId(bookingId);
        setTimeout(() => setHighlightedBookingId(null), 1300)
    }

    const handleUpdateUser = async () => {
        await fetchUser();
    }

    if (userLoading) {
        return <Loader />;
    }

    return (
        <Container className={styles.outerContainer}>
            <Box className={styles.sideBarContainer}>
                <Group>
                    <NavLink
                        label={t('user.account')}
                        active={activeTab === 'account'}
                        onClick={() => setActiveTab('account')}
                        className={activeTab === 'account' ? styles.activeTab : ''}
                        styles={{

                        }}
                    />
                    <NavLink
                        label={t('user.bookings')}
                        active={activeTab === 'bookingCard'}
                        onClick={() => setActiveTab('bookingCard')}
                        className={activeTab === 'bookingCard' ? styles.activeTab : ''}
                    />
                    <NavLink
                        label={t('user.reviews')}
                        active={activeTab === 'reviews'}
                        onClick={() => setActiveTab('reviews')}
                        className={activeTab === 'reviews' ? styles.activeTab : ''}
                    />
                </Group>
            </Box>
            <Box className={styles.mainContainer}>
                {activeTab === 'account' && <Account user={user} onUserUpdate={handleUpdateUser} /> }
                {activeTab === 'bookingCard' && <UserBookings user={user} highlightedBookingId={highlightedBookingId} />  }
                {activeTab === 'reviews' && <UserReviews user={user} onSeeBooking={handleSeeBooking} /> }
            </Box>
        </Container>
    )
}

export default User;
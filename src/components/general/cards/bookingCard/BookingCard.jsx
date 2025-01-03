import {Box, Button, Card, Text} from "@mantine/core";
import React from "react";
import styles from "./bookingCard.module.scss";
import {useTranslation} from "react-i18next";


const BookingCard = ({
    booking,
    highlightedBookingId,
    targetRef,
    onUpdateBooking,
    onDeleteBooking,
    onUpdateReview,
    onCreateReview,
    isUserBooking=false
}) => {
    const { t } = useTranslation();
    const isPastBooking = new Date(booking.date) < new Date();

    return (
        <Card
            ref={highlightedBookingId === booking.id ? targetRef : null}
            className={`${styles.card} ${highlightedBookingId === booking.id ? styles.highlightedCard : ""}`}
        >
            <Box className={styles.card__header}>
                <Text className={styles.card__dateAndId}>
                    {new Date(booking.date).toLocaleDateString()}
                    {" "}
                    {new Date(booking.date).toLocaleTimeString()}
                </Text>
                <Text className={styles.card__dateAndId}>ID: {booking.id}</Text>
            </Box>

            <Box className={styles.card__section}>
                {!isUserBooking && (
                    <Text>
                        <span className={styles.card__label}>{t('bookingCard.userId')}</span>
                        {" "}
                        <span className={styles.card__section}>{booking.userId}</span>
                    </Text>
                )}
                <Text>
                    <span className={styles.card__label}>{t('bookingCard.servicePoint')}</span>
                    {" "}
                    <span className={styles.card__value}>{booking.servicePoint.name} ({booking.servicePoint.location})</span>
                </Text>
                {booking.employee && (
                    <Text>
                        <span className={styles.card__label}>{t('general.employee')}</span>
                        {" "}
                        <span className={styles.card__value}>{booking.employee.username}</span>
                    </Text>
                )}
                {booking.treatmentId && (
                    <Text>
                        <span className={styles.card__label}>{t('bookingCard.treatment')}</span>
                        {" "}
                        <span className={styles.card__value}>{booking.treatmentId}</span>
                    </Text>
                )}
            </Box>

            <Box className={styles.card__buttons}>
                <Button disabled={isPastBooking}  onClick={() => onUpdateBooking(booking)}>
                    {isPastBooking ? t('bookingCard.completed') : t('buttons.update')}
                </Button>
                <Button className={styles.card__deleteButton} onClick={() => onDeleteBooking(booking)}>
                    {t('buttons.delete')}
                </Button>
                {booking.reviewId ? (
                    <Button className={styles.card__seeReviewButton} onClick={() => onUpdateReview(booking)}>
                        {t('bookingCard.seeReview')}
                    </Button>
                ) : (
                    <Button className={styles.card__leaveReviewButton} onClick={() => onCreateReview(booking)}>
                        {t('bookingCard.leaveReview')}
                    </Button>
                )}
            </Box>
        </Card>
    );
}

export default BookingCard;
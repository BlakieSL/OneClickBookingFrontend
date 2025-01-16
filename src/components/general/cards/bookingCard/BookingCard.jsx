import {ActionIcon, Box, Button, Card, Text} from "@mantine/core";
import React from "react";
import styles from "./bookingCard.module.scss";
import {useTranslation} from "react-i18next";
import {isUserAdmin} from "../../../../helpers/tokenUtils.js";
import {IconEye, IconStar} from "@tabler/icons-react";


const BookingCard = ({
    booking,
    highlightedBookingId,
    targetRef,
    onUpdateBooking,
    onDeleteBooking,
    onCancelBooking,
    onUpdateReview,
    onCreateReview,
    isUserBooking=false
}) => {
    const { t } = useTranslation();

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
                <ActionIcon
                    size={40}
                    className={
                        booking.reviewId
                            ? styles.card__seeReviewButton
                            : styles.card__leaveReviewButton
                    }
                    onClick={() =>
                        booking.reviewId
                            ? onUpdateReview(booking)
                            : onCreateReview(booking)
                    }
                >
                    {booking.reviewId
                        ? (<IconEye size={40} />)
                        : (<IconStar size={40} />)
                    }
                </ActionIcon>
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
                <Button
                    className={styles.card__updateButton}
                    disabled={booking.status !== 'PENDING'}
                    onClick={() => onUpdateBooking(booking)}
                >
                    {booking.status === 'COMPLETED'
                        ? t('bookingCard.completed')
                        : booking.status === 'PENDING'
                            ? t('buttons.update')
                            : t('bookingCard.cancelled')
                    }
                </Button>
                <Button
                    className={styles.card__cancelButton}
                    disabled={booking.status !== 'PENDING'}
                    onClick={() => onCancelBooking(booking)}
                >
                    {t('buttons.cancel')}
                </Button>
                {isUserAdmin() && (
                    <Button className={styles.card__deleteButton} onClick={() => onDeleteBooking(booking)}>
                        {t('buttons.delete')}
                    </Button>
                )}
            </Box>
        </Card>
    );
}

export default BookingCard;
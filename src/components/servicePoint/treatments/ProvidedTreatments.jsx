import {Box, Button, Card, Text} from "@mantine/core";
import styles from "./providedTreatments.module.scss";
import {useTranslation} from "react-i18next";

const ProvidedTreatments = ({ treatments, onClick }) => {
    const { t } = useTranslation();
    return (
        <Box className={styles.providedTreatments}>
            {treatments.map((treatment) => (
                <Card key={treatment.id} className={styles.providedTreatments__card}>
                    <Text className={styles.providedTreatments__name}>
                        {treatment.name}
                    </Text>

                    <Text className={styles.providedTreatments__price}>
                        {t('providedTreatments.price', { price: treatment.price })}
                    </Text>

                    <Text className={styles.providedTreatments__duration}>
                        {t('providedTreatments.duration', { duration: treatment.duration })}
                    </Text>

                    <Text className={styles.providedTreatments__description}>
                        {treatment.description}
                    </Text>


                    <Button
                        onClick={() => onClick(treatment)}
                        className={styles.providedTreatments__orderButton}
                    >
                        {t('buttons.order')}
                    </Button>
                </Card>
            ))}
        </Box>
    );
}

export default ProvidedTreatments;
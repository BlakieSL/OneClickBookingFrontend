import {Box, Card, Text, Button} from "@mantine/core";
import styles from "./providedTreatments.module.scss";
const ProvidedTreatments = ({ treatments }) => {
    return (
        <Box className={styles.providedTreatments}>
            {treatments.map((treatment) => (
                <Card key={treatment.id} className={styles.providedTreatments__card}>
                    <Text className={styles.providedTreatments__name}>
                        {treatment.name}
                    </Text>

                    <Text className={styles.providedTreatments__description}>
                        {treatment.description}
                    </Text>

                    <Text className={styles.providedTreatments__price}>
                        Price: {treatment.price.toFixed(2)} zl
                    </Text>

                    <Text className={styles.providedTreatments__duration}>
                        Duration: {treatment.duration} minutes
                    </Text>

                    <Button className={styles.providedTreatments__orderButton}>Order</Button>
                </Card>
            ))}
        </Box>
    );
}

export default ProvidedTreatments;
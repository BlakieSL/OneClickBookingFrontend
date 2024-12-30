import {useEffect, useState} from "react";
import {getFirstImageForParent} from "../../../../apis/imageApi.js";
import {Box, Card, Image, Loader, Text} from "@mantine/core";
import {defaultImage} from "../../../../helpers/constants.js";
import styles from "./servicePointCard.module.scss";

const ServicePointCard = ({ servicePoint, isSelected = false, size="medium" }) => {
    const { id, name, location, email, phone } = servicePoint;
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const fetchedImage = await getFirstImageForParent('SERVICE_POINT', id)

                if(fetchedImage?.image) {
                    setImage(`data:image/png;base64,${fetchedImage.image}`);
                } else {
                    setImage(defaultImage);
                }
            } catch(error) {
                setError("Failed to fetch related images");
                console.error(error);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if(loading) {
        return <Loader />;
    }

    return (
        <Card
            className={`${styles.card} ${styles[`card__${size}`]} ${isSelected ? styles.card__selected : ""}`}
        >
            <Card.Section>
                <Image
                    src={image}
                    alt={name}
                    className={styles[`card__${size}__image`]}
                />
            </Card.Section>
            <Text className={styles[`card__${size}__name`]}>{name}</Text>
        </Card>
    );
}

export default ServicePointCard;
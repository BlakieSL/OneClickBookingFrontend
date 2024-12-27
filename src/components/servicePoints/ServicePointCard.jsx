import {useEffect, useState} from "react";
import {getFirstImageForParent} from "../../apis/imageApi.js";
import {Box, Card, Image, Loader, Text} from "@mantine/core";
import {defaultImage} from "../../helpers/constants.js";
import styles from "./servicePointCard.module.scss";

const ServicePointCard = ({ servicePoint }) => {
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


    return (
        <Card className={styles.mediumCard}>
            <Card.Section>
                <Image
                    src={image}
                    alt={name}
                    className={styles.mediumCard__image}
                />
            </Card.Section>
            <Text className={styles.mediumCard__name}>{name}</Text>
        </Card>
    )
}

export default ServicePointCard;
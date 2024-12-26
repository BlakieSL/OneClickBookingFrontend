import {useEffect, useState} from "react";
import {getFirstImageForParent} from "../../../apis/imageApi.js";
import {defaultImage} from "../../../helpers/constants.js";
import {Card, Loader, Text, Image} from "@mantine/core";
import styles from "./servicePointEmployeeCard.module.scss";

const ServicePointEmployeeCard = ({ employee }) => {
    const { id, username } = employee;
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const fetchedImage = await getFirstImageForParent('EMPLOYEE', id)
                setImage(`data:image/png;base64,${fetchedImage.image}`);
            } catch(error) {
                if (error.response && error.response.status === 404) {
                    setImage(defaultImage);
                } else {
                    setError("Failed to fetch related images");
                    console.error(error);
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    return (
        <Card className={styles.smallCard}>
            <Card.Section>
                <Image
                    src={image || defaultImage}
                    alt={username}
                    className={styles.smallCard__image}
                />
            </Card.Section>
            <Text className={styles.smallCard__name}>{username}</Text>
        </Card>
    )
}

export default ServicePointEmployeeCard;
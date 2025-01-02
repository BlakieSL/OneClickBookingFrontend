import {useEffect, useState} from "react";
import {getFirstImageForParent} from "../../../../apis/imageApi.js";
import {defaultImage, showErrorNotification} from "../../../../helpers/constants.js";
import {Card, Image, Loader, Text} from "@mantine/core";
import styles from "./servicePointEmployeeCard.module.scss";
import {useNavigate} from "react-router-dom";

const ServicePointEmployeeCard = ({ employee, isSelected }) => {
    const { id, username } = employee;
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const fetchedImage = await getFirstImageForParent('EMPLOYEE', id)
                if (fetchedImage?.image) {
                    setImage(`data:image/png;base64,${fetchedImage.image}`);
                } else {
                    setImage(defaultImage);
                }
            } catch(error) {
                showErrorNotification(error);
                console.error(error);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);


    if(loading) {
        return <Loader/>;
    }

    return (
        <Card
            className={`${styles.smallCard} ${isSelected ? styles.selected : ""}`}
        >
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
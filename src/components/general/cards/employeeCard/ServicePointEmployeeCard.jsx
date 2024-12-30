import {useEffect, useState} from "react";
import {getFirstImageForParent} from "../../../../apis/imageApi.js";
import {defaultImage} from "../../../../helpers/constants.js";
import {Card, Loader, Text, Image} from "@mantine/core";
import styles from "./servicePointEmployeeCard.module.scss";
import {useNavigate} from "react-router-dom";

const ServicePointEmployeeCard = ({ employee, isSelected }) => {
    const navigate = useNavigate();
    const { id, username } = employee;
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                setError("Failed to fetch related images");
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
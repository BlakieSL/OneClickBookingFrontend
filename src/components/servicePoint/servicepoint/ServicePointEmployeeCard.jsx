import {useEffect, useState} from "react";
import {getFirstImageForParent} from "../../../apis/imageApi.js";
import {defaultImage} from "../../../helpers/constants.js";
import {Card, Loader} from "@mantine/core";

const ServicePointEmployeeCard = ({ employee }) => {
    const { id, username } = employee;
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const fetchedImage = await getFirstImageForParent('EMPLOYEE', id)
                setImage(`data:image/png;base64,${fetchedImage}`);
            } catch(error) {
                if (error.response && error.response.status === 404) {
                    setImage(defaultImage);
                } else {
                    setError("Failed to fetch related image");
                    console.error(error);
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if(loading) {
        return <Loader />
    }

    return (
        <Card className="service-point-employee-card">
            <Card.Section>
                <Image
                    src={image}
                    alt={name}
                    className="service-point-employee-card__image"
                />
            </Card.Section>
            <Text className="service-point-employee-card__name">{username}</Text>
        </Card>
    )
}

export default ServicePointEmployeeCard;
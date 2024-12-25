import {useEffect, useState} from "react";
import {getFirstImageForParent} from "../../apis/imageApi.js";
import {Box, Card, Image, Loader, Text} from "@mantine/core";

const ServicePointCard = ({ servicePoint }) => {
    const { id, name, location, email, phone } = servicePoint;
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const defaultImage = 'https://img.freepik.com/premium-vector/no-result-found-empty-results-popup-design_586724-96.jpg?w=1060';

    useEffect(() => {
        (async () => {
            try {
                const fetchedImage = await getFirstImageForParent('SERVICE_POINT', id)
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
        return <Loader/>
    }

    return (
        <Card className="card">
            <Card.Section>
                <Image
                    src={image}
                    alt={name}
                    className="card__image"
                />
            </Card.Section>
            <Text className="card__name"> {name} </Text>
        </Card>
    )
}

export default ServicePointCard;
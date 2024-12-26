import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getAllServicePoints} from "../../../apis/servicePointApi.js";
import {Box, Container, Loader, SimpleGrid, Text} from "@mantine/core";
import ServicePointCard from "../../../components/servicePoints/ServicePointCard.jsx";
import styles from "./servicePoints.module.scss";

const ServicePoints = () => {
    const [servicePoints, setServicePoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const data = await getAllServicePoints();
                setServicePoints(data);
            } catch (error) {
                setError("Failed to fetch service points.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return <Loader/>
    }

    return (
        <Container className={styles.servicePointContainer}>
            <Box className={styles.servicePointContainer__textContainer}>
                <Text className={styles.servicePointContainer__textContainer__text}>
                    All Service Points
                </Text>
            </Box>
            <SimpleGrid cols={5} className={styles.servicePointContainer__listContainer}>
                {servicePoints.map((servicePoint) => (
                    <Box
                        key={servicePoint.id}
                        onClick={() => navigate(`/service-points/${servicePoint.id}`)}
                        style={{cursor: 'pointer'}}
                    >
                        <ServicePointCard servicePoint={servicePoint}/>
                    </Box>
                ))}
            </SimpleGrid>
        </Container>
    );
}

export default ServicePoints;
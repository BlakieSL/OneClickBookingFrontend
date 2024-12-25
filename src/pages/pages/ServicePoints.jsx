import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getAllServicePoints} from "../../apis/servicePointApi.js";
import {Box, Container, Loader, SimpleGrid} from "@mantine/core";
import ServicePointCard from "../../components/servicePoint/ServicePointCard.jsx";

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
        <Container className="item-list">
            <SimpleGrid cols={5} className="item-list__list-container">
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
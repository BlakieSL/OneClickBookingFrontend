import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getAllServicePoints} from "../../../apis/servicePointApi.js";
import {Box, Container, Loader, SimpleGrid, Text} from "@mantine/core";
import ServicePointCard from "../../../components/general/cards/servicePointCard/ServicePointCard.jsx";
import styles from "./servicePoints.module.scss";
import {showErrorNotification} from "../../../helpers/constants.js";
import {useTranslation} from "react-i18next";

const ServicePoints = () => {
    const { t } = useTranslation();
    const [servicePoints, setServicePoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const data = await getAllServicePoints();
                setServicePoints(data);
            } catch (error) {
                showErrorNotification(error);
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
                    {t('servicePoints.allServicePoints')}
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
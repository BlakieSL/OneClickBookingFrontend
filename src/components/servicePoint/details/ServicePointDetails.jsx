import {Box, Text} from "@mantine/core";
import ServicePointEmployeeCard from "../../general/cards/employeeCard/ServicePointEmployeeCard.jsx";
import {useNavigate} from "react-router-dom";
import {Carousel} from "@mantine/carousel";
import styles from "./servicePointDetails.module.scss";
import {useTranslation} from "react-i18next";

const ServicePointDetails = ({ servicePoint, employees }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const handleClick = (employee) => {
        navigate(`/service-points/${servicePoint.id}/employees/${employee.id}`);
    }

    return (
        <Box className={styles.servicePointDetails}>
            <Box className={styles.servicePointDetails__info}>
                <Box className={styles.servicePointDetails__info__header}>
                    <Text>
                    <span className={styles.servicePointDetails__info__label}>
                        {t('servicePointDetails.name')}
                    </span>
                        {" "}
                        <span className={styles.servicePointDetails__info__value}>
                        {servicePoint.name}
                    </span>
                    </Text>
                </Box>
                <Text>
                    <span className={styles.servicePointDetails__info__label}>
                        {t('servicePointDetails.location')}
                    </span>
                        {" "}
                    <span className={styles.servicePointDetails__info__value}>
                        {servicePoint.location}
                    </span>
                </Text>
                <Text>
                    <span className={styles.servicePointDetails__info__label}>
                        {t('servicePointDetails.email')}
                    </span>
                        {" "}
                    <span className={styles.servicePointDetails__info__value}>
                        {servicePoint.email}
                    </span>
                </Text>
                <Text>
                    <span className={styles.servicePointDetails__info__label}>
                        {t('servicePointDetails.phone')}
                    </span>
                        {" "}
                    <span className={styles.servicePointDetails__info__value}>
                        {servicePoint.phone}
                    </span>
                </Text>
            </Box>
            <Box className={styles.servicePointDetails__textContainer}>
                <Text className={styles.servicePointDetails__textContainer__heading}>
                    {t('servicePointDetails.employees')}
                </Text>
            </Box>

            <Box className={styles.servicePointDetails__carouselOuterBox}>
                <Carousel
                    withIndicators
                    slideGap="sm"
                    align="start"
                    slideSize="10%"
                    height={150}
                    styles={{
                        container: {
                            paddingTop: '5px',
                            userSelect: 'none',
                        },
                        control: {
                            opacity: '50%',
                            width: '32px',
                            height: '32px',
                        },
                        indicators: {
                            bottom: '0px'
                        },
                        indicator: {
                            backgroundColor: '#445649'
                        }
                    }}
                >
                    {employees.map((employee) => (
                        <Carousel.Slide
                            key={employee.id}
                            onClick={() => handleClick(employee)}
                        >
                            <ServicePointEmployeeCard employee={employee}/>
                        </Carousel.Slide>
                    ))}
                </Carousel>
            </Box>

        </Box>
    );
};

export default ServicePointDetails;

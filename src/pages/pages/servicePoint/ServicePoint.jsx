import {data, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getServicePoint} from "../../../apis/servicePointApi.js";
import {getAllImagesForParent} from "../../../apis/imageApi.js";
import {Box, Container, Loader, Modal, Text} from "@mantine/core";
import {getAllTreatmentsByServicePoint} from "../../../apis/treatmentApi.js";
import {getFilteredReviews} from "../../../apis/reviewApi.js";
import {getFilteredEmployees} from "../../../apis/employeeApi.js";
import {defaultImage} from "../../../helpers/constants.js";
import ServicePointDetails from "../../../components/servicePoint/details/ServicePointDetails.jsx";
import ServicePointImages from "../../../components/servicePoint/images/ServicePointImages.jsx";
import styles from "./servicePoint.module.scss";
import ProvidedTreatments from "../../../components/servicePoint/treatments/ProvidedTreatments.jsx";
import Reviews from "../../../components/general/reviews/Reviews.jsx";
import {useDisclosure} from "@mantine/hooks";
import ScheduleModal from "../../../components/general/scheduleModal/ScheduleModal.jsx";
const ServicePoint = () => {
    const navigate = useNavigate();
    const [opened, {open, close}] = useDisclosure(false);
    const { id } = useParams();
    const [selectedTreatment, setSelectedTreatment] = useState(null);

    const [servicePoint, setServicePoint] = useState(null);
    const [images, setImages] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [treatments, setTreatments] = useState([]);
    const [reviews, setReviews] =useState([]);

    const [servicePointLoading, setServicePointLoading] = useState(true);
    const [imagesLoading, setImagesLoading] = useState(true);
    const [employeesLoading, setEmployeesLoading] = useState(true);
    const [treatmentsLoading, setTreatmentsLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try{
                const fetchedServicePoint = await getServicePoint(id);
                setServicePoint(fetchedServicePoint);
            } catch (error) {
                setError("Failed to fetch service point.");
                console.error(error);
            } finally {
                setServicePointLoading(false);
            }
        })();
    }, [id]);

    useEffect(() => {
        (async () => {
            try {
                const fetchedImages = await getAllImagesForParent("SERVICE_POINT", id);

                if(fetchedImages.length === 0){
                    setImages([defaultImage])
                } else {
                    const transformedImages = fetchedImages.map((img) => {
                        return `data:image/png;base64,${img.image}`
                    })
                    setImages(transformedImages);
                }
            } catch(error) {
                setError("Failed to fetch images");
                console.error(error);
            } finally {
                 setImagesLoading(false);
            }
        })();
    },[id]);

    useEffect(() => {
        (async () => {
            try {
                const requestBody = {
                    filterCriteria: [
                        {
                            filterKey: "SERVICE_POINT",
                            value: id,
                            operation: "EQUAL"
                        }
                    ],
                    dataOption: "AND"
                };

                const fetchedEmployees = await getFilteredEmployees(requestBody);
                setEmployees(fetchedEmployees);
            } catch (error) {
                setError("Failed to fetch employees");
                console.error(error);
            } finally {
                setEmployeesLoading(false);
            }
        })();
    }, [id]);

    useEffect(() => {
        (async () => {
            try {
                const fetchedTreatments = await getAllTreatmentsByServicePoint(id);
                setTreatments(fetchedTreatments);
            } catch (error) {
                setError("Fail")
                console.error(error);
            } finally {
                setTreatmentsLoading(false);
            }
        })();
    }, [id]);

    useEffect(() => {
        (async () => {
            try {
                const requestBody = {
                    filterCriteria: [
                        {
                            filterKey: "SERVICE_POINT",
                            value: id,
                            operation: "EQUAL"
                        }
                    ],
                    dataOption: "AND"
                }
                const fetchedReviews = await getFilteredReviews(requestBody);
                setReviews(fetchedReviews);
                console.log(fetchedReviews)
            } catch (error) {
                setError("Failed to fetch reviews");
                setError(error);
            } finally {
                setReviewsLoading(false);
            }
        })();
    },[id]);

    const handleSelectTreatment = (treatment) => {
        setSelectedTreatment(treatment);
        open();
    }


    if(servicePointLoading || imagesLoading || employeesLoading || treatmentsLoading || reviewsLoading) {
        return <Loader/>;
    }

    return (
        <Container className={styles.servicePointContainer}>
            <Box className={styles.textContainer}>
                <Text className={styles.textContainer__heading}>{servicePoint.name}</Text>
            </Box>
            <Box className={styles.innerBox}>
                <Box className={styles.headerBox}>
                    <Box className={styles.headerBox__imageBox}>
                        <ServicePointImages images={images} />
                    </Box>
                    <Box className={styles.headerBox__detailsBox}>
                        <ServicePointDetails servicePoint={servicePoint} employees={employees} />
                    </Box>
                </Box>
                <ProvidedTreatments treatments={treatments} onClick={handleSelectTreatment}/>
                <Reviews data={reviews} />
            </Box>
            {opened && (
                <ScheduleModal
                    employees={employees}
                    treatment={selectedTreatment}
                    servicePoint={servicePoint}
                    opened={opened}
                    onClose={close}
                />
            )}
        </Container>
    );
};


export default ServicePoint;
import {data, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getServicePoint} from "../../apis/servicePointApi.js";
import {getAllImagesForParent} from "../../apis/imageApi.js";
import {Box, Container, Loader} from "@mantine/core";
import {getAllTreatmentsByServicePoint} from "../../apis/treatmentApi.js";
import {getFilteredReviews} from "../../apis/reviewApi.js";
import {getFilteredEmployees} from "../../apis/employeeApi.js";

const ServicePoint = () => {
    const { id } = useParams();
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
    const defaultImage = 'https://img.freepik.com/premium-vector/no-result-found-empty-results-popup-design_586724-96.jpg?w=1060';

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
                        `data:image/png;base64,${img.image}`
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

                const fetchedEmployees = await getFilteredEmployees(data);
                setEmployees(fetchedEmployees);
            } catch (error) {
                setError("Failed to fetch employees");
                console.error(error);
            } finally {
                setEmployeesLoading(false);
            }
        })();
    }, []);

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
                setReviews(reviews);
            } catch (error) {
                setError("Failed to fetch reviews");
                setError(error);
            } finally {
                setReviewsLoading(false);
            }
        })();
    },[id]);

    if(servicePointLoading || imagesLoading || treatmentsLoading || reviewsLoading) {
        return <Loader/>;
    }

    return (
        <Container>
            <Box>

            </Box>
            <Box>

            </Box>
            <Box>

            </Box>
        </Container>
    )
};


export default ServicePoint;
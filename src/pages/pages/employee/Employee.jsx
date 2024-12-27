import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Avatar, Box, Button, Container, Loader, Text} from "@mantine/core";
import {getEmployeeById} from "../../../apis/employeeApi.js";
import {getFilteredReviews} from "../../../apis/reviewApi.js";
import {getFirstImageForParent} from "../../../apis/imageApi.js";
import styles from "./employee.module.scss";
import Reviews from "../../../components/general/reviews/Reviews.jsx";
import {defaultImage} from "../../../helpers/constants.js";

const Employee = () => {
    const navigate = useNavigate();
    const { id, employeeId } = useParams();
    const [employee, setEmployee] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [image, setImage] = useState("");

    const [employeeLoading, setEmployeeLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [imageLoading, setImageLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const fetchedEmployee = await getEmployeeById(employeeId);
                setEmployee(fetchedEmployee);
            } catch (error) {
                setError("Failed to fetch service point.");
                console.error(error);
            } finally {
                setEmployeeLoading(false);
            }
        })();
    }, [id, employeeId]);

    useEffect(() => {
        (async () => {
            try {
                const requestBody = {
                    filterCriteria: [
                        {
                            filterKey: "SERVICE_POINT",
                            value: id,
                            operation: "EQUAL"
                        },
                        {
                            filterKey: "EMPLOYEE",
                            value: employeeId,
                            operation: "EQUAL"
                        }
                    ],
                    dataOption: "AND"
                }
                const fetchedReviews = await getFilteredReviews(requestBody);
                setReviews(fetchedReviews);
            } catch (error) {
                setError("Failed to fetch reviews.");
                console.error(error);
            } finally {
                setReviewsLoading(false);
            }
        })();
    }, [id, employeeId]);

    useEffect(() => {
        (async () => {
            try {
                const fetchedImage = await getFirstImageForParent("EMPLOYEE", employeeId);

                if(fetchedImage?.image) {
                    setImage(`data:image/png;base64,${fetchedImage.image}`);
                } else {
                    setImage(defaultImage);
                }
            } catch (error) {
                setError("Failed to fetch employee image");
                console.error(error);
            } finally {
                setImageLoading(false);
            }
        })();
    }, [id, employeeId]);

    const handleClick = () => {
        navigate(`/service-points/${id}`);
    }

    if(employeeLoading || reviewsLoading || imageLoading) {
        return <Loader />;
    }

    return (
      <Container className={styles.employeeContainer}>
          <Box className={styles.innerBox}>
              <Box className={styles.textContainer}>
                  <Button className={styles.textContainer__button} onClick={handleClick}>
                      Go Back to Service Point
                  </Button>
                  <Box className={styles.textContainer__avatarAndNameBox}>
                      <Text className={styles.textContainer__avatarAndNameBox__heading}>{employee.username}</Text>
                      <Avatar
                          src={image}
                          alt={employee.username}
                          radius="xl"
                          size="lg"
                      />
                  </Box>
              </Box>
              <Box className={styles.innerBox__descriptionBox}>
                  <Text className={styles.innerBox__descriptionBox__text}>{employee.description ? employee.description : "no description"}</Text>
              </Box>
              <Reviews data={reviews} />
          </Box>
      </Container>
    );
}

export default Employee;
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Avatar, Box, Button, Container, Loader, Text} from "@mantine/core";
import {getEmployeeById} from "../../../apis/employeeApi.js";
import {getFilteredReviews} from "../../../apis/reviewApi.js";
import {getFirstImageForParent} from "../../../apis/imageApi.js";
import styles from "./employee.module.scss";
import EmployeeReviews from "../../../components/general/reviews/EmployeeReviews.jsx";
import {defaultImage, showErrorNotification} from "../../../helpers/constants.js";
import {useTranslation} from "react-i18next";

const Employee = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id, employeeId } = useParams();
    const [employee, setEmployee] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [image, setImage] = useState("");

    const [employeeLoading, setEmployeeLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [imageLoading, setImageLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const fetchedEmployee = await getEmployeeById(employeeId);
                setEmployee(fetchedEmployee);
            } catch (error) {
                showErrorNotification(error);
                console.error(error);
            } finally {
                setEmployeeLoading(false);
            }
        })();
    }, [employeeId]);

    useEffect(() => {
        (async () => {
            try {
                const requestBody = {
                    filterCriteria: [
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
                showErrorNotification(error);
                console.error(error);
            } finally {
                setReviewsLoading(false);
            }
        })();
    }, [employeeId]);

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
                showErrorNotification(error);
                console.error(error);
            } finally {
                setImageLoading(false);
            }
        })();
    }, [employeeId]);

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
                  {id && (
                      <Button onClick={handleClick}>
                          {t('employee.goBack')}
                      </Button>
                  )}
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
                  <Text className={styles.innerBox__descriptionBox__text}>
                      {employee.description ? employee.description : t('employee.noDescription')}
                  </Text>
              </Box>
              <EmployeeReviews data={reviews} />
          </Box>
      </Container>
    );
}

export default Employee;
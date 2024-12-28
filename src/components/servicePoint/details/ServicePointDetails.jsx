import {Box, ScrollArea, Text, Loader} from "@mantine/core";
import ServicePointEmployeeCard from "../employeesCard/ServicePointEmployeeCard.jsx";
import styles from "./servicePointDetails.module.scss";
import {useNavigate} from "react-router-dom";

const ServicePointDetails = ({ servicePoint, employees }) => {
    const navigate = useNavigate();

    const handleClick = (employee) => {
        navigate(`/service-points/${servicePoint.id}/employees/${employee.id}`);
    }

    return (
        <Box className={styles.servicePointDetails}>
            <Box className={styles.servicePointDetails__info}>
                <Text>{servicePoint.name}</Text>
                <Text>{servicePoint.location}</Text>
                <Text>{servicePoint.email}</Text>
                <Text>{servicePoint.phone}</Text>
            </Box>
            <Box className={styles.servicePointDetails__textContainer}>
                <Text className={styles.servicePointDetails__textContainer__heading}>Employees</Text>
            </Box>
            <ScrollArea type="auto" className={styles.servicePointDetails__scrollArea}>
                <Box className={styles.servicePointDetails__employees}>
                    {employees.map((employee) => (
                        <Box
                            key={employee.id}
                            onClick={() => handleClick(employee)}
                        >
                            <ServicePointEmployeeCard employee={employee}/>
                        </Box>
                    ))}
                </Box>
            </ScrollArea>
        </Box>
    );
};

export default ServicePointDetails;

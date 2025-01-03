import {useEffect, useState} from "react";
import {getAllEmployees} from "../../../apis/employeeApi.js";
import {Box, Container, Loader, SimpleGrid, Text} from "@mantine/core";
import ServicePointEmployeeCard from "../../../components/general/cards/employeeCard/ServicePointEmployeeCard.jsx";
import {useNavigate} from "react-router-dom";
import styles from "./employees.module.scss";
import {showErrorNotification} from "../../../helpers/constants.js";
import {useTranslation} from "react-i18next";

const Employees = () => {
    const { t } = useTranslation();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const data = await getAllEmployees();
                setEmployees(data);
            } catch (error) {
                showErrorNotification(error);
                console.error(error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if(loading) {
        return <Loader />;
    }

    return (
        <Container className={styles.employeesContainer}>
            <Box className={styles.employeesContainer__textContainer}>
                <Text className={styles.employeesContainer__textContainer__text}>
                    {t('employees.allEmployees')}
                </Text>
            </Box>
            <SimpleGrid className={styles.employeesContainer__listContainer}>
                {employees.map((employee) => (
                    <Box
                        key={employee.id}
                        onClick={() => navigate(`/employees/${employee.id}`)}
                        style={{cursor: 'pointer'}}
                    >
                        <ServicePointEmployeeCard employee={employee} />
                    </Box>
                ))}
            </SimpleGrid>
        </Container>
    )
}

export default Employees;
import {useState} from "react";
import {ActionIcon, Box, Image} from "@mantine/core";
import {defaultImage} from "../../../helpers/constants.js";
import {IconArrowLeft, IconArrowRight} from "@tabler/icons-react";
import styles from "./servicePointImages.module.scss";

const ServicePointImages = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNextImage = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex + 1) % images.length
        );
    }

    const handlePreviousImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    }

    const hasImages = images && images.length > 0;
    const currentImage = hasImages ? images[currentIndex] : defaultImage;

    return (
        <Box className={styles.imageButtonsContainer}>

                <Image
                    src={currentImage}
                    alt="Service Point"
                    className={styles.imageButtonsContainer__image}
                />
            <Box className={styles.imageButtonsContainer__buttonsContainer}>
                    <ActionIcon
                        onClick={handlePreviousImage}
                        className={styles.imageButtonsContainer__buttonsContainer__button}
                    >
                        <IconArrowLeft size={24}/>
                    </ActionIcon>

                    <ActionIcon
                        onClick={handleNextImage}
                        className={styles.imageButtonsContainer__buttonsContainer__button}
                    >
                        <IconArrowRight size={24} />
                    </ActionIcon>
            </Box>
        </Box>
    )
}

export default ServicePointImages;
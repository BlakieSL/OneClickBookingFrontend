import {useState} from "react";
import {Box, Button} from "@mantine/core";
import {defaultImage} from "../../../helpers/constants.js";

const ServicePointImages = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }

    const handlePreviousImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    }

    const hasImages = images && images.length > 0;
    const currentImage = hasImages ? images[currentIndex] : defaultImage;

    return (
        <Box>
            {hasImages &&(
                <Button onClick={handlePreviousImage}>Previous</Button>
            )}
            <Image
                src={currentImage}
                alt="Service Point"
            />
            {hasImages &&(
                <Button onClick={handleNextImage}>Next</Button>
            )}
        </Box>
    )
}

export default ServicePointImages;
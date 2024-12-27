import {Rating} from "@mantine/core";

const StarRating = ({ rating }) =>
    <Rating
        size="xl"
        value={rating}
        fractions={3}
        readOnly
    />
export default StarRating;
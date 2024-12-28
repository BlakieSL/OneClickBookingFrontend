import {Badge} from "@mantine/core";
import styles from "./slotBadge.module.scss";

const SlotBadge = ({ isSelected, slot, onClick }) => {
    return (
        <Badge
            size="xl"
            color="#228be6"
            className={`${styles.badge}`}
            variant={isSelected ? "filled" : "light"}
            key={slot}
            onClick={onClick}
        >
            {slot}
        </Badge>
    );
}

export default SlotBadge;
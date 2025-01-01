import { Checkbox } from "@mantine/core";

const TriStateCheckbox = ({ state, onChange }) => {
    const handleToggle = () => {
        let nextState;
        if (state === null) {
            nextState = "selected";
        } else if (state === "selected") {
            nextState = "deselected";
        } else {
            nextState = null;
        }

        onChange(nextState);
    };

    return (
        <Checkbox
            checked={state === "selected"}
            indeterminate={state === "deselected"}
            onChange={handleToggle}
        />
    );
};

export default TriStateCheckbox;

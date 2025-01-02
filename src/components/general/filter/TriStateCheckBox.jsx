import {Checkbox} from "@mantine/core";
import {IconCheck, IconX} from "@tabler/icons-react";

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
            styles={{
                input: {
                    backgroundColor:
                        state === "deselected"
                            ? "red"
                            : state === "selected"
                                ? "#718977FF"
                                : undefined,
                    borderColor:
                        state === "deselected"
                            ? "red"
                            : state === "selected"
                                ? "#718977FF"
                                : undefined,
                },
            }}
            icon={({ indeterminate, className }) =>
                indeterminate ? (
                    <IconX className={className} />
                ) : (
                    <IconCheck className={className} />
                )
            }
        />
    );
};

export default TriStateCheckbox;

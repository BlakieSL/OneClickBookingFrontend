import {useEffect, useState} from "react";
import {getLocale, setLocale} from "../../helpers/tokenUtils.js";
import {Select} from "@mantine/core";

const Locale = () => {
    const [selectedLocale, setSelectedLocale] = useState(getLocale() || "en");

    useEffect(() => {
        (async () => {
            await setLocale(selectedLocale);
        })();
    }, [selectedLocale]);

    return (
        <Select
            w={100}
            value={selectedLocale}
            onChange={(value) => setSelectedLocale(value)}
            data={[
                { value: "en", label: "English" },
                { value: "ru", label: "Russian" },
                { value: "pl", label: "Polish" },
            ]}
            style={{ maxWidth: 200 }}
        />
    );
};

export default Locale;
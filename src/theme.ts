import { createTheme } from "@mantine/core";

export const theme = createTheme({
    colors: {
        pr: [
            "#f4f7f4", // Very light green
            "#e8ece8", // Lighter green
            "#d9ded9", // Subtle green
            "#b9c4b9", // Soft green
            "#91a691", // Neutral green
            "#6d896d", // Slightly darker green
            "#4f6e4f", // Base green
            "#445649", // Darker green
            "#36463a", // Very dark green
            "#1f2b20", // Deep green
        ],
        sd: [
            "#fde9e9", // Very light red
            "#fbc8c8", // Lighter red
            "#f8a3a3", // Soft pinkish red
            "#f47474", // Bright red
            "#f04848", // Neutral red
            "#db2323", // Slightly darker red
            "#b41d1d", // Base red
            "#921919", // Dark red
            "#6e1414", // Very dark red
            "#4b0d0d", // Deep red
        ],
        th: [
            "#eaf4fd", // Very light blue
            "#d4e8fb", // Lighter blue
            "#a9d2f7", // Soft sky blue
            "#7dbbf4", // Bright blue
            "#529af0", // Neutral blue
            "#307ae2", // Slightly darker blue
            "#2361b4", // Base blue
            "#1a4c91", // Dark blue
            "#12366e", // Very dark blue
            "#0a203b", // Deep blue
        ],
    },
    primaryColor: "pr",
});

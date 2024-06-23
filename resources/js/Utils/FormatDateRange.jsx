import React from 'react';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return date.toLocaleDateString("id-ID", options);
};

const FormatDateRange = ({ startDateString, endDateString }) => {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    if (startDate.getTime() === endDate.getTime()) {
        return formatDate(startDateString);
    } else if (
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getFullYear() === endDate.getFullYear()
    ) {
        const startOptions = { day: "2-digit" };
        const endOptions = { day: "2-digit", month: "long" };
        const startFormatted = startDate.toLocaleDateString("id-ID", startOptions);
        const endFormatted = endDate.toLocaleDateString("id-ID", endOptions);
        return `${startFormatted} - ${endFormatted} ${endDate.getFullYear()}`;
    } else if (startDate.getFullYear() === endDate.getFullYear()) {
        const startOptions = { day: "2-digit", month: "long" };
        const endOptions = { day: "2-digit", month: "long" };
        const startFormatted = startDate.toLocaleDateString("id-ID", startOptions);
        const endFormatted = endDate.toLocaleDateString("id-ID", endOptions);
        return `${startFormatted} - ${endFormatted} ${endDate.getFullYear()}`;
    } else {
        const startOptions = { day: "2-digit", month: "long", year: "numeric" };
        const endOptions = { day: "2-digit", month: "long", year: "numeric" };
        const startFormatted = startDate.toLocaleDateString("id-ID", startOptions);
        const endFormatted = endDate.toLocaleDateString("id-ID", endOptions);
        return `${startFormatted} - ${endFormatted}`;
    }
};

export default FormatDateRange;

export const ago = (date: Date | string): string => {
    const obj = date instanceof Date ? date : new Date(date);

    const now = new Date();

    const timeDifference = Math.floor((now.getTime() - obj.getTime()) / 1000);
    const secondsDifference = Math.floor(timeDifference);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);
    const monthsDifference = Math.floor(daysDifference / 30);
    const yearsDifference = Math.floor(monthsDifference / 12);

    if (secondsDifference < 60) {
        return `il y a ${secondsDifference} seconde${secondsDifference > 1 ? 's' : ''}`;
    } else if (minutesDifference < 60) {
        return `il y a ${minutesDifference} minute${minutesDifference > 1 ? 's' : ''}`;
    } else if (hoursDifference < 24) {
        return `il y a ${hoursDifference} heure${hoursDifference > 1 ? 's' : ''}`;
    } else if (daysDifference < 7) {
        return `il y a ${daysDifference} jour${daysDifference > 1 ? 's' : ''}`;
    } else if (monthsDifference < 12) {
        return `il y a ${monthsDifference} mois`;
    }

    return `il y a ${yearsDifference} an${yearsDifference > 1 ? 's' : ''}`;
};

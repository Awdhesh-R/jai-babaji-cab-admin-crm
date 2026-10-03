export const formatTime = (timeString) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};

export const formatTimeFromMinutes = (timeinMin) => {
  console.log(timeinMin)
  if (isNaN(timeinMin)) return timeinMin;
  if (!Number.isFinite(timeinMin) || timeinMin < 0) return "00:00:00";
  const totalSeconds = Math.floor(timeinMin * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;

}

const parseDuration = (duration) => {
    const [h, m, s] = duration.split(":").map(Number);
    return h * 3600 + m * 60 + s;
};

export const calculateArrivalTime = (bookingTime, estimated) => {
    if (!bookingTime || !estimated) return "";
    const bookingDate = new Date(bookingTime);
    const totalSeconds = parseDuration(estimated);
    const arrivalDate = new Date(bookingDate.getTime() + totalSeconds * 1000);

    return arrivalDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};

export function getCabType(value) {
    switch (Number(value)) {
        case 0: return "mini";
        case 1: return "mini";
        case 2: return "sedan";
        case 3: return "suv";
    }
    if (typeof value === "string") return value;
    return "unknown";
}

export const customFormatAmount = (val) => {
    if(!val) return 0;
  const absVal = Math.abs(val);
  if (absVal >= 10000000) {
    return `${(val / 10000000).toFixed(2)} Cr`;
  } else if (absVal >= 100000) {
    return `${(val / 100000).toFixed(2)} L`; // Or 'Lac', 'Lakh'
  } else if (absVal >= 1000) {
    return `${(val / 1000).toFixed(2)} K`;
  } else {
    return val.toFixed(2); // For numbers less than 1000, specify decimals as needed
  }
};
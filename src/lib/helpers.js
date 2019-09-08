export const titleCase = str => {
  const arr = str.toLowerCase().split(" ");
  const final = arr.map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return final.join(" ");
};

export const formatDate = (date, dateObj, type) => {
  if (!dateObj) {
    dateObj = {
      timeZone: "UTC",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
  }
  if (!type) {
    type = "en-US";
  }
  return new Date(date).toLocaleDateString(type, dateObj);
};

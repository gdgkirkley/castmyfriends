import React from "react";

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

export const musicLyricCheck = (music, lyrics) => {
  if (!music && !lyrics) {
    return null;
  }
  if (music === lyrics) {
    return (
      <span>
        Music and Lyrics By {music}
        <br />
      </span>
    );
  }
  return (
    <>
      <span>
        Music By {music}
        <br />
      </span>

      <span>
        Lyrics By {lyrics}
        <br />
      </span>
    </>
  );
};

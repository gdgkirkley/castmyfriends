export const titleCase = str => {
  const arr = str.toLowerCase().split(" ");
  const final = arr.map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return final.join(" ");
};

export const validateDate = (date) => {
  const dateObj = new Date(date);

  return (
    date.length === 10 &&
    !+date &&
    dateObj.toString() !== "Invalid Date" &&
    dateObj < new Date()
  );
};

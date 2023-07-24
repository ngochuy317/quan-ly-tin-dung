export const formatDataFileField = (orignalData, listFileField) => {
  const newData = { ...orignalData };
  listFileField.forEach((fileField) => {
    if (newData[fileField]) {
      if (typeof newData[fileField] === "string") {
        newData[fileField] = null;
      } else {
        newData[fileField] = newData[fileField][0];
      }
    }
  });
  return { ...newData };
};

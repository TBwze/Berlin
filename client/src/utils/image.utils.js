export const checkIfImage = (url, callback) => {
  const image = new Image();
  image.src = url;

  if (image.complete) {
    callback(true);
  }

  image.onload = () => callback(true);
  image.onerror = () => callback(false);
};

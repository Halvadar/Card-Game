export const cardImageInitializer = async (
  setCardImageUrls,
  setCardStates,
  storageImagesRef,
  allImagesRef,
  setDataInitialized
) => {
  const imageUrls = [];

  const images = await storageImagesRef
    .listAll()
    .then((imagesArr) => {
      return imagesArr;
    })
    .catch((err) => {});
  for (const image of images.items) {
    await image
      .getDownloadURL()
      .then((url) => {
        imageUrls.push(url);
      })
      .catch((err) => {});
  }
  allImagesRef.current = imageUrls;
  setCardImageUrls(randomImagesArrayMaker(imageUrls));

  setCardStates(cardStatesSetter());
  setDataInitialized(true);
};

const randomImagesArrayMaker = (arr) => {
  const newArr = [...arr];

  const selectedImagesArr = [];

  for (let i = 0; i < 6; i++) {
    selectedImagesArr.push(
      newArr.splice(Math.round(Math.random() * newArr.length - 1), 1)[0]
    );
  }

  return selectedImagesArr;
};

const cardStatesSetter = () => {
  const indexArray = [
    ...Array.from(Array(6).keys()),
    ...Array.from(Array(6).keys()),
  ];
  const cardsArray = [];
  for (let i = 0; i < 12; i++) {
    cardsArray.push({
      urlIndex: indexArray.splice(
        Math.round(Math.random() * indexArray.length - 1),
        1
      )[0],
      flipped: false,
    });
  }
  return cardsArray;
};

export const scoreCalculator = (guesses, tries, time, didntGuessStreak) => {
  const score = Math.round(
    10 +
      80 * ((guesses + 1) / (tries + 1)) +
      ((time - 60) / 120) * 80 +
      10 -
      didntGuessStreak * 5
  );

  return score < 10 ? 10 : score;
};
export const format = (time) => {
  var mins = ~~((time % 3600) / 60);
  var secs = ~~time % 60;
  var ret = "";
  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;
  return ret;
};

export const timeDifference = (previous) => {
  const current = Date.now();
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + " months ago";
  } else {
    return Math.round(elapsed / msPerYear) + " years ago";
  }
};

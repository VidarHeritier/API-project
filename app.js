const req = new XMLHttpRequest();
let url = "https://api.nasa.gov/planetary/apod?api_key=";
const api_key = "rRqeqR1QzYIucfDqchocMM7KurKMjvgYLqwimwj9";
const calendar = document.querySelector("input");
const loadingAnim = document.querySelector("loading");

let apiUrl = url + api_key;

let initialLoad = true;

async function fetchNasaData() {
  try {
    let response = await fetch(apiUrl);
    const data = await response.json();

    return [data];
  } catch (error) {
    console.error("Error loading data", error);
    const errorMess = document.createElement("h5");
    errorMess.className = "error";
    errorMess.textContent = "Something went wrong";
    document.body.append(errorMess);
    return [];
  }
}

fetchNasaData().then((nasaArray) => {
  const loadingAnim = document.querySelector(".loading");

  let today = new Date().toISOString().slice(0, 10);

  const POD = nasaArray[0];

  const head = document.createElement("h1");
  head.textContent = "NASA Astronomy Picture Of The Day";

  const title = document.createElement("h2");
  title.textContent = POD.title;

  const date = document.createElement("h3");
  date.textContent = POD.date;

  const headerContainer = document.createElement("div");
  headerContainer.className = "header-container";
  headerContainer.append(head, title, date);

  const image = document.createElement("img");
  image.className = "nasa-img";
  image.src = POD.url;

  image.addEventListener("click", function () {
    image.requestFullscreen();
  });

  image.addEventListener("dblclick", function () {
    document.exitFullscreen();
  });

  const dateSelectorHeading = document.createElement("h4");
  dateSelectorHeading.textContent = "Select a date in time";

  const dateSelectorContainer = document.createElement("div");

  const leftArrow = document.createElement("button");
  leftArrow.textContent = "backward";

  let calendar = document.createElement("input");
  calendar.type = "date";
  calendar.min = "1996-01-01";
  calendar.max = today;
  calendar.value = today;

  const rightArrow = document.createElement("button");
  rightArrow.textContent = "forward";

  const description = document.createElement("p");
  description.textContent = POD.explanation;

  dateSelectorContainer.append(leftArrow, calendar, rightArrow);

  document
    .querySelector("body")
    .append(
      headerContainer,
      image,
      dateSelectorHeading,
      dateSelectorContainer,
      description
    );

  function setNewDate(offset) {
    const currentDate = new Date(calendar.value);
    currentDate.setDate(currentDate.getDate() + offset);
    if (currentDate > new Date(calendar.max)) {
      console.error("Legg inn error på et vis");

      const errorMessDate = document.createElement("h6");
      errorMessDate.className = "error-date";
      errorMessDate.textContent = "Choose a valid date";
      dateSelectorContainer.prepend(errorMessDate);
    }
    const newDate = currentDate.toISOString().slice(0, 10);
    calendar.value = newDate;

    if (!initialLoad) {
      const imgRect = image.getBoundingClientRect();
      const loadingAnimRect = loadingAnim.getBoundingClientRect();
      const offsetX = (imgRect.width - loadingAnimRect.width) / 2;
      const offsetY = (imgRect.height - loadingAnimRect.height) / 2;

      loadingAnim.style.left = `${imgRect.left + offsetX}px`;
      loadingAnim.style.top = `${imgRect.top + offsetY}px`;

      loadingAnim.style.display = "flex";
    }

    upDate(newDate);
  }

  function upDate(selectedDate) {
    apiUrl = `https://api.nasa.gov/planetary/apod?date=${selectedDate}&api_key=${api_key}`;

    fetchNasaData().then((nasaArray) => {
      const POD = nasaArray[0];

      title.textContent = POD.title;
      date.textContent = POD.date;
      image.src = POD.url;
      image.alt = POD.title;
      description.textContent = POD.explanation;

      loadingAnim.style.display = "none";
      if (initialLoad) {
        initialLoad = false;
      }
    });
  }

  leftArrow.addEventListener("click", function () {
    setNewDate(-1);
  });

  rightArrow.addEventListener("click", function () {
    setNewDate(1);
  });

  calendar.addEventListener("change", function () {
    setNewDate(0);
  });
});

//-----------------------------------------------------------------------

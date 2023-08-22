const req = new XMLHttpRequest();
const url = "https://api.nasa.gov/planetary/apod?api_key=";
const api_key = "rRqeqR1QzYIucfDqchocMM7KurKMjvgYLqwimwj9";

const apiUrl = url + api_key;

async function fetchNasaData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return [data];
  } catch (error) {
    console.error("Error loading data", error);
    return [];
  }
}

fetchNasaData().then((nasaArray) => {
  console.log(nasaArray);

  let today = new Date().toISOString().slice(0, 10);

  const POD = nasaArray[0];

  const head = document.createElement("h1");
  head.textContent = "NASA Astronomy Picture Of The Day";

  const title = document.createElement("h2");
  title.textContent = POD.title;

  const date = document.createElement("h3");
  date.textContent = POD.date;

  const image = document.createElement("img");
  image.src = POD.url;

  const dateSelectorHeading = document.createElement("h4");
  dateSelectorHeading.textContent = "Select a date in time";

  const dateSelectorContainer = document.createElement("div");

  const leftArrow = document.createElement("button");
  leftArrow.textContent = "backwards";

  const calendar = document.createElement("input");
  calendar.type = "date";
  calendar.min = "1996-01-01";
  calendar.max = today;
  calendar.value = today;

  const rightArrow = document.createElement("button");
  rightArrow.textContent = "forwards";

  const description = document.createElement("p");
  description.textContent = POD.explanation;

  dateSelectorContainer.append(leftArrow, calendar, rightArrow);

  document
    .querySelector("body")
    .append(
      head,
      title,
      image,
      dateSelectorHeading,
      dateSelectorContainer,
      date,
      description
    );
});

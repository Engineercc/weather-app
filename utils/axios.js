import axios from "axios";

const customFetch = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
});

export default customFetch;
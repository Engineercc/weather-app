import React, { useState, useEffect } from "react";
import "./App.css";
import cities from "./countrycities";
import axios from "axios";
import moment from "moment/moment";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const KelvinValue = 273;
function App() {
  const notify = () => toast("Wow so easy!");
  const [data, setData] = useState([]);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [cityValue, setCityValue] = useState("");

  const getData = async (latValue, longValue) => {
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latValue}&lon=${longValue}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;
      const response = await axios.get(url);
      const data = response.data;
      setData(data.main);
    } catch (error) {
      console.error(error);
    }
  };

  const getDate = () => {
    const date = moment(new Date()).format("MMMM Do YYYY, h:mm:ss");
    return date;
  };

  const handleSearch = (e) => {
    const latValue = cities.filter(
      (item) => item.city.toLowerCase() === city.toLowerCase()
    )[0].lat;
    const longValue = cities.filter(
      (item) => item.city.toLowerCase() === city.toLowerCase()
    )[0].lng;

    e.preventDefault();
    getCountry(city);
    getCity(city);
    getData(latValue, longValue);
  };

  const getCountry = (city) => {
    const countryName = cities.filter(
      (item) => item.city.toLowerCase() === city.toLowerCase()
    )[0].country;
    setCountry(countryName);
  };

  const getCity = (myCity) => {
    const cityName = cities.filter(
      (item) => item.city.toLowerCase() === myCity.toLowerCase()
    )[0].city;
    setCityValue(cityName);
  };

  useEffect(() => {
    getDate();
  }, [data]);

  const handleChange = (e) => {
    setCity(e.target.value);
  };

  if (Math.round(data.temp - KelvinValue) < 0) {
    toast.error("Carefull. Weather is too low");
  }

  const clear = () => {
    setCity("");
    setData([]);
  };

  return (
    <div className="App">
      <form>
        <input type="text" value={city} onChange={handleChange} />
        <button onClick={handleSearch}> Ara</button>
        <button type="button" onClick={clear}>
          Temizle
        </button>
        <ToastContainer />
      </form>
      {data.temp && (
        <ul>
          <li> {getDate()}</li>
          <li> {country}</li>
          <li> {cityValue}</li>
          <li>{Math.round(data.temp - KelvinValue)}</li>
        </ul>
      )}
    </div>
  );
}

export default App;

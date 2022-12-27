// @ts-nocheck
import React, { useState, useEffect } from "react";
import cities from "../countrycities";
import axios from "axios";
import moment from "moment/moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cloudy from "../assets/images/cloudy.jpg";
import thunderstorm from "../assets/images/thunderstorm.jpg";
import snow from "../assets/images/snowy-2.jpg";
import rain from "../assets/images/rainy.jpg";
import defaultWeather from "../assets/images/default-weather.jpg";
import { Link } from "react-router-dom";
const KelvinValue = 273;
var allDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function Home() {
  const [data, setData] = useState([]);
  const [fiveDayForecast, setFiveDayForecast] = useState([]);
  const [weatherStat, setWeatherStat] = useState([{}]);
  const [sys, setSys] = useState({});
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [tabCount, setTabCount] = useState(0);

  const temp = data.temp && Math.round(data.temp - KelvinValue);
  const feelsLike = data.temp && Math.round(data.feels_like - KelvinValue);
  const tempMin = data.temp && Math.round(data.temp_min - KelvinValue);
  const tempMax = data.temp && Math.round(data.temp_max - KelvinValue);

  const cloudyValue = weatherStat[0].main === "Clouds" && cloudy;
  const rainyValue = weatherStat[0].main === "Rain" && rain;
  const snowValue = weatherStat[0].main === "Snow" && snow;
  const thunderstormValue =
    weatherStat[0].main === "Thunderstorm" && thunderstorm;
  const sunsetValue = moment(new Date(sys.sunset)).format("h:mm");
  const getDate = () => {
    const date = moment(new Date()).format("MMMM Do YYYY, h:mm:ss");
    return date;
  };

  const getData = async (latValue, longValue) => {
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latValue}&lon=${longValue}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;
      const response = await axios.get(url);
      const data = response.data;
      setData(data.main);
      setWeatherStat(data.weather);
      setSys(data.sys);
      getDate();
    } catch (error) {
      console.error(error);
    }
  };
  const sliceForecast = (weatherValues) => {
    let itemsPerPage = 8;
    const page = Math.ceil(weatherValues.length / itemsPerPage);
    const newForecastDays = Array.from({ length: page }, (_, index) => {
      const start = index * itemsPerPage;
      return weatherValues.slice(start, start + itemsPerPage);
    });
    return newForecastDays;
  };

  const getFiveDayForecast = async (latValue, longValue) => {
    try {
      let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latValue}&lon=${longValue}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;
      const response = await axios.get(url);
      const data = response.data;
      const arr = sliceForecast(data.list);
      setFiveDayForecast(arr);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const latValue = cities.filter(
      (item) => item.city.toLowerCase() === city.toLowerCase()
    )[0].lat;
    const longValue = cities.filter(
      (item) => item.city.toLowerCase() === city.toLowerCase()
    )[0].lng;
    getFiveDayForecast(latValue, longValue);
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

  useEffect(() => {}, [tabCount]);

  const handleChange = (e) => {
    setCity(e.target.value);
  };

  if (Math.round(data.temp - KelvinValue) < 0) {
    toast.error("Carefull. Weather is too cold");
  }

  const clear = () => {
    setCity("");
    setData([]);
  };

  return (
    <div className="App">
      <div className="container-fluid ">
        <div className="row gt-0">
          <div className="col-7">
            <div className="p-3 ">
              <nav className="navbar navbar-light bg-transparent pt-3 pb-4 search-city">
                <form className="d-flex">
                  <div className="input-group mb-0">
                    <span className="input-group-text">
                      <i className="icon small white">
                        <svg
                          width="18"
                          height="18"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M11 2c4.968 0 9 4.032 9 9s-4.032 9-9 9-9-4.032-9-9 4.032-9 9-9Zm0 16c3.867 0 7-3.133 7-7 0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7Zm8.485.071 2.829 2.828-1.415 1.415-2.828-2.829 1.414-1.414Z"></path>
                        </svg>
                      </i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search for city"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      value={city}
                      onChange={handleChange}
                    />
                  </div>
                  <button className="btn btn-success mx-4" type="submit">
                    Search
                  </button>
                  <button
                    className="btn btn-info"
                    type="button"
                    onClick={clear}
                  >
                    Clear
                  </button>
                </form>
              </nav>
          
              <div className="mt-3 pt-4">
                <h2> Weather Forecast</h2>
              </div>

              <div className="weather-tabs mt-4">
                <div className="tabs-header">
                  <nav className="nav nav-pills flex-column flex-sm-row">
                    {fiveDayForecast.map((day, index) => {
                      var d = new Date(day[index].dt * 1000); // to get the DateTime.
                      var dayName = allDays[d.getDay()];
                      return (
                        <button
                          type="button"
                          className={`flex-sm-fill text-sm-center nav-link ${
                            index === tabCount ? "active" : null
                          }`}
                          aria-current="page"
                          onClick={() => setTabCount(index)}
                        >
                          {dayName}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="tab-content mt-4">
                  <table className="table table-hover table-borderless table-striped">
                    <tbody>
                      {fiveDayForecast.map((day, index) => {
                        const temp = Math.round(
                          day[tabCount].main.temp - KelvinValue
                        );
                        const feelsLike =
                          day[tabCount].main.temp &&
                          Math.round(
                            day[tabCount].main.feels_like - KelvinValue
                          );
                        const tempMin =
                          day[tabCount].main.temp &&
                          Math.round(day[tabCount].main.temp_min - KelvinValue);
                        const tempMax =
                          day[tabCount].main.temp &&
                          Math.round(day[tabCount].main.temp_max - KelvinValue);

                        return (
                          <tr>
                            <td>{day[index].dt_txt.slice(11, 16)}</td>
                            <td>{temp} °C</td>
                            <td>
                              <i className="icon small humidity me-2">
                                <svg
                                  width="12"
                                  height="12"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M5.636 6.637 12 .273l6.364 6.364a9 9 0 1 1-12.728 0Z"></path>
                                </svg>
                              </i>
                              {day[tabCount].main.humidity}%
                            </td>
                            <td>
                              <img
                                src={`http://openweathermap.org/img/wn/${day[tabCount].weather[0].icon}@2x.png`}
                                alt=""
                              />
                            </td>
                            <td className="min-max">
                              Feels Like <b>{feelsLike} °C</b>
                            </td>
                            <td className="min-max">
                              Min. <b>{tempMin} °C</b>
                            </td>
                            <td className="min-max">
                              Max. <b>{tempMax} °C</b>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-5 bg-blue position-relative">
            <div className="bg-img position-absolute">
              <img
                src={`${
                  cloudyValue || rainyValue || snowValue || thunderstormValue ||defaultWeather
                }`}
                alt=""
                className="img-fluid"
              />
              <div className="img-cover"></div>
            </div>

            <div className="details-container">
              <div className="p-0">
                <div className="today-weather bg-black ">
                  <div className="d-flex h-100 flex-column aling-items-center justify-content-start">
                    <div className="p-3">
                      <nav className="navbar navbar-light bg-transparent">
                        <Link to="/favorite-cities" className="btn btn-link">
                          <i className="icon small">
                            <svg
                              width="18"
                              height="18"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M12.001 4.529a5.998 5.998 0 0 1 8.242.228 6 6 0 0 1 .236 8.236l-8.48 8.492-8.478-8.492a6 6 0 0 1 8.48-8.464Z"></path>
                            </svg>
                          </i>{" "}
                          Favorite Cities{" "}
                          <span className="badge bg-light text-dark"></span>
                        </Link>
                       
                      </nav>
                    </div>
                    {data.temp && (
                      <div className="flex-grow-1">
                        <div className=" h-100 d-flex align-items-center justify-content-center flex-column">
                          <div>
                            <div className="d-flex align-items-center">
                              <div className="me-4">
                                <i className="icon big white">
                                  {
                                    <img
                                      src={`http://openweathermap.org/img/wn/${
                                        data.temp && weatherStat[0].icon
                                      }@2x.png`}
                                      alt={weatherStat[0].icon}
                                    />
                                  }
                                </i>
                              </div>
                              <div>
                                <p className="fs-5 mb-0">Today</p>
                                <p className=" fs-6 m-0 grayed-out">
                                  {data.temp && getDate()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 mb-1">
                            <h1 className="fs-1 m-0 weather-c position-relative">
                              <b>{data.temp && temp}</b>
                              <i>°C</i>
                            </h1>
                          </div>
                          <div className="mb-4">
                            {data.temp && (
                              <p className="fs-5 grayed-out">
                                {cityValue},{country}
                              </p>
                            )}
                          </div>

                          <div className="d-flex align-items-center gap-5">
                            <div>
                              <p className="fs-7 m-0 grayed-out">
                                <i className="icon small">
                                  <svg
                                    width="18"
                                    height="18"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Zm-1-11v6h2v-6h-2Zm0-4v2h2V7h-2Z"></path>
                                  </svg>
                                </i>{" "}
                                Feels like {feelsLike} °C
                              </p>
                            </div>
                            <div>
                              <p className="fs-7 m-0 grayed-out">
                                <i className="icon small">
                                  <svg
                                    width="18"
                                    height="18"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12ZM11 1h2v3h-2V1Zm0 19h2v3h-2v-3ZM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93v-.001ZM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121Zm2.121-14.85 1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121v-.001ZM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121ZM23 11v2h-3v-2h3ZM4 11v2H1v-2h3Z"></path>
                                  </svg>
                                </i>{" "}
                                Sunset {sunsetValue} (Locale TR)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

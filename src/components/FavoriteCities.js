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
import cityBg from "../assets/images/city-bg.jpg";
import { Link } from "react-router-dom";
import { nanoid } from "nanoid";
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

const getLocalStorage = () => {
  let list = localStorage.getItem("favoriteCities");
  if (list) {
    return JSON.parse(localStorage.getItem("favoriteCities"));
  } else {
    return [];
  }
};

function FavoriteCities() {
  const [data, setData] = useState([]);
  const [fiveDayForecast, setFiveDayForecast] = useState([]);
  const [weatherStat, setWeatherStat] = useState([{}]);
  const [sys, setSys] = useState({});
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [tabCount, setTabCount] = useState(0);
  const [favoriteCities, setFavoriteCities] = useState(getLocalStorage());

  const temp = data.temp && Math.round(data.temp - KelvinValue);
  const feelsLike = data.temp && Math.round(data.feels_like - KelvinValue);

  const favoriteCityValue = favoriteCities.find(
    (item) => item.cityName === cityValue
  );
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
  console.log(country);
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
    // 5 günlük hava tahmininde gelen objelerin, 5 elemanlık bir arraye çevrilmesi
    let weatherPerPage = 8; // 8 saatlik veri geldiği için, o yüzden baş
    const weatherCount = Math.ceil(weatherValues.length / weatherPerPage);
    const newForecastDays = Array.from({ length: weatherCount }, (_, index) => {
      const start = index * weatherPerPage;
      return weatherValues.slice(start, start + weatherPerPage);
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
    if (!city) {
      toast.error("pls enter value");
    } else {
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
    }
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

  useEffect(() => {}, [tabCount, fiveDayForecast]);

  const handleChange = (e) => {
    setCity(e.target.value);
  };

  const clear = () => {
    setCity("");
    setData([]);
  };

  const addFavorites = (favoriteCityName, countryName) => {
    toast.success("city added");
    const newCity = {
      id: nanoid(),
      cityName: favoriteCityName,
      country: countryName,
    };
    setFavoriteCities([...favoriteCities, newCity]);
  };

  const removeFavoritesCity = (id) => {
    toast.error("city removed");
    const newCity = favoriteCities.filter((city) => city.id !== id);
    setFavoriteCities(newCity);
  };
  if (temp < 0) {
    toast.error("Carefull. Weather is too low");
  }
  useEffect(() => {
    localStorage.setItem("favoriteCities", JSON.stringify(favoriteCities));
  }, [favoriteCities]);

  return (
    <div className="App">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        closeOnClick
        draggable
        theme="dark"
      />
      <div className="container-fluid">
        <div className="row gt-0">
          <div className="col-7">
            <div className="p-3 ">
              <nav className="navbar navbar-light bg-transparent pt-3 pb-4 search-city">
                <form className="d-flex" onSubmit={handleSearch}>
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
                    Ara
                  </button>
                  <button
                    className="btn btn-info"
                    type="button"
                    onClick={clear}
                  >
                    Temizle
                  </button>
                </form>
              </nav>
              <div className="cities-list pt-3 scrollable">
                <ul className="list-group list-group-horizontal">
                  {favoriteCities.map((item) => {
                    const { id, cityName, country } = item;
                    return (
                      <li
                        key={id}
                        className="list-group-item border-0 p-0 bg-transparent me-4"
                        onClick={handleSearch}
                      >
                        <div className="card city-card rounded border-0">
                          <div className="card-body position-relative rounded">
                            <div className="city-img position-absolute rounded">
                              <img
                                src={cityBg}
                                alt={cityName}
                                className="img-fluid rounded"
                              />
                              <div className="img-cover rounded"></div>
                            </div>

                            <div className="city-buttons">
                              <button
                                type="button"
                                className="btn btn-xs btn-danger favorite-added"
                                onClick={() => removeFavoritesCity(id)}
                              >
                                <i className="icon small">
                                  <svg
                                    width="46"
                                    height="46"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M12.001 4.529a5.998 5.998 0 0 1 8.242.228 6 6 0 0 1 .236 8.236l-8.48 8.492-8.478-8.492a6 6 0 0 1 8.48-8.464Zm6.826 1.641a3.998 3.998 0 0 0-5.49-.153l-1.335 1.198-1.336-1.197a3.999 3.999 0 0 0-5.494.154 4 4 0 0 0-.192 5.451L12 18.654l7.02-7.03a4 4 0 0 0-.193-5.454Z"></path>
                                  </svg>
                                </i>
                              </button>
                            </div>
                            <div className="city-title position-relative d-flex align-items-start flex-column h-100 justify-content-end">
                              <p className="fs-5 mb-1">{cityName}</p>
                              <p className="fs-7 m-0">{country}</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="d-flex justify-content-between mt-3 pt-4">
                <h2> Weather Forecast</h2>
                <h2 className="text-capitalize">{cityValue}</h2>
                <button
                  className="btn btn-info mx-4"
                  onClick={() => addFavorites(cityValue, country)}
                >
                  Add to favorites
                </button>
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
                  cloudyValue ||
                  rainyValue ||
                  snowValue ||
                  thunderstormValue ||
                  defaultWeather
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
                          <span className="badge bg-light text-dark">
                            {favoriteCities.length}
                          </span>
                        </Link>
                        <Link to="/favorite-cities" className="btn btn-link">
                          <i className="icon small">
                          <svg width="18" height="18" viewBox="0 -0.5 24 24" id="meteor-icon-kit__solid-home" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">

<g id="SVGRepo_bgCarrier" stroke-width="0"/>

<g id="SVGRepo_iconCarrier">

<path fill-rule="evenodd" clip-rule="evenodd" d="M1.49613 11.9696L11.4961 6.13622C11.8075 5.95459 12.1925 5.95459 12.5039 6.13622L22.5039 11.9696C22.8111 12.1488 23 12.4777 23 12.8333V21.8423C23 22.3946 22.5523 22.8423 22 22.8423H2C1.44772 22.8423 1 22.3946 1 21.8423V12.8333C1 12.4777 1.18891 12.1488 1.49613 11.9696zM0 9.1013V7.41667C0 7.061 0.188911 6.7321 0.496129 6.55289L11.4961 0.13622C11.8075 -0.045407 12.1925 -0.045407 12.5039 0.13622L23.5039 6.55289C23.8111 6.7321 24 7.061 24 7.41667V9.1013C24 9.6535 23.5523 10.1013 23 10.1013C22.8229 10.1013 22.6491 10.0543 22.4961 9.965L12.5039 4.13622C12.1925 3.95459 11.8075 3.95459 11.4961 4.13622L1.50387 9.965C1.02682 10.2433 0.414501 10.0822 0.136221 9.6051C0.0470084 9.4522 0 9.2783 0 9.1013zM6 13.8423C5.44772 13.8423 5 14.29 5 14.8423V17.8423C5 18.3946 5.44772 18.8423 6 18.8423H9C9.55229 18.8423 10 18.3946 10 17.8423V14.8423C10 14.29 9.55229 13.8423 9 13.8423H6zM14 13.8423C13.4477 13.8423 13 14.29 13 14.8423V22.8423H18V14.8423C18 14.29 17.5523 13.8423 17 13.8423H14z" fill="#ffffff"/>

</g>

</svg>
                          </i>{" "}
                          Anasayfa
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

export default FavoriteCities;

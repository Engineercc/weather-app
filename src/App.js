import React, { useState, useEffect } from "react";
import "./App.css";
import cities from "./countrycities";
import axios from "axios";
import moment from "moment/moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import cloudy from "./assets/images/cloudy.jpg";
import thunderstorm from "./assets/images/thunderstorm.jpg";
import snow from "./assets/images/snowy-2.jpg";
import rain from "./assets/images/rainy.jpg";

const KelvinValue = 273;
function App() {
  const [data, setData] = useState([]);
  const [weatherStat, setWeatherStat] = useState([{}]);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [cityValue, setCityValue] = useState("");

  const temp = data.temp && Math.round(data.temp - KelvinValue);
  const feelsLike = data.temp && Math.round(data.feels_like - KelvinValue);
  const tempMin = data.temp && Math.round(data.temp_min - KelvinValue);
  const tempMax = data.temp && Math.round(data.temp_max - KelvinValue);

  const cloudyValue = weatherStat[0].main === "Clouds" && cloudy;
  const rainyValue = weatherStat[0].main === "Rain" && rain;
  const snowValue = weatherStat[0].main === "Snow" && snow;
  const thunderstormValue = weatherStat[0].main === "Thunderstorm" && thunderstorm;
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
      getDate();
    } catch (error) {
      console.error(error);
    }
  };

  console.log(weatherStat);
  const handleSearch = (e) => {
    e.preventDefault();
    const latValue = cities.filter(
      (item) => item.city.toLowerCase() === city.toLowerCase()
    )[0].lat;
    const longValue = cities.filter(
      (item) => item.city.toLowerCase() === city.toLowerCase()
    )[0].lng;

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
                  <button
                    className="btn btn-success mx-4"
                    onClick={handleSearch}
                  >
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
                  <li className="list-group-item border-0 p-0 bg-transparent me-4">
                    <div className="card city-card rounded border-0">
                      <div className="card-body position-relative rounded">
                        <div className="city-img position-absolute rounded">
                          <img
                            src="https://images.unsplash.com/photo-1564594736624-def7a10ab047?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80"
                            alt=""
                            className="img-fluid rounded"
                          />
                          <div className="img-cover rounded"></div>
                        </div>

                        <div className="city-buttons">
                          <button
                            type="button"
                            className="btn btn-xs btn-danger favorite-added"
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
                          <p className="fs-5 mb-1">Paris</p>
                          <p className="fs-7 m-0">France</p>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item border-0 p-0 bg-transparent me-4">
                    <div className="card city-card rounded border-0">
                      <div className="card-body position-relative rounded">
                        <div className="city-img position-absolute rounded">
                          <img
                            src="https://i.natgeofe.com/n/874df281-d3e0-489a-98c0-6b840023b828/newyork_NationalGeographic_2328428_2x3.jpg"
                            alt=""
                            className="img-fluid rounded"
                          />
                          <div className="img-cover rounded"></div>
                        </div>

                        <div className="city-buttons">
                          <button
                            type="button"
                            className="btn btn-xs btn-danger"
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
                          <p className="fs-5 mb-1">New York</p>
                          <p className="fs-7 m-0">United States</p>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item border-0 p-0 bg-transparent me-4">
                    <div className="card city-card rounded border-0">
                      <div className="card-body position-relative rounded">
                        <div className="city-img position-absolute rounded">
                          <img
                            src="https://fastly.4sqi.net/img/general/600x600/42803125_ZIW8_F2rErYjxwUFdvCtO5eDiFTkAZytvPDUzbjOUX0.jpg"
                            alt=""
                            className="img-fluid rounded"
                          />
                          <div className="img-cover rounded"></div>
                        </div>

                        <div className="city-buttons">
                          <button
                            type="button"
                            className="btn btn-xs btn-danger"
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
                          <p className="fs-5 mb-1">Ankara</p>
                          <p className="fs-7 m-0">Turkey</p>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="mt-3 pt-4">
                <h2> Weather Forecast</h2>
              </div>

              <div className="weather-tabs mt-4">
                <div className="tabs-header">
                  <nav className="nav nav-pills flex-column flex-sm-row">
                    <a
                      className="flex-sm-fill text-sm-center nav-link active"
                      aria-current="page"
                      href="#"
                    >
                      Week
                    </a>
                    <a
                      className="flex-sm-fill text-sm-center nav-link"
                      href="#"
                    >
                      Month
                    </a>
                    <a
                      className="flex-sm-fill text-sm-center nav-link"
                      href="#"
                    >
                      3 Months
                    </a>
                    <a
                      className="flex-sm-fill text-sm-center nav-link"
                      href="#"
                    >
                      6 Months
                    </a>
                  </nav>
                </div>

                <div className="tab-content mt-4">
                  <table className="table table-hover table-borderless">
                    <tbody>
                      <tr>
                        <td>Sunday</td>
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
                          </i>{" "}
                          54%
                        </td>
                        <td>
                          <i className="icon small sun">
                            <svg
                              width="18"
                              height="18"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12ZM11 1h2v3h-2V1Zm0 19h2v3h-2v-3ZM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93v-.001ZM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121Zm2.121-14.85 1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121v-.001ZM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121ZM23 11v2h-3v-2h3ZM4 11v2H1v-2h3Z"></path>
                            </svg>
                          </i>
                        </td>
                        <td className="min-max">
                          Min. <b>{tempMin} °C</b>
                        </td>
                        <td className="min-max">
                          Max. <b>{tempMax} °C</b>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-5 bg-blue position-relative">
            <div className="bg-img position-absolute">
              <img
                src={`${cloudyValue || rainyValue || snowValue || thunderstormValue}`}
                alt=""
                className="img-fluid "
              />
              <div className="img-cover "></div>
            </div>

            <div className="details-container">
              <div className="p-0">
                <div className="today-weather bg-black ">
                  <div className="d-flex h-100 flex-column aling-items-center justify-content-start">
                    <div className="p-3">
                      <nav className="navbar navbar-light bg-transparent">
                        <button type="button" className="btn btn-link">
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
                          <span className="badge bg-light text-dark">25</span>
                        </button>
                      </nav>
                    </div>
                    <div className="flex-grow-1">
                      <div className=" h-100 d-flex align-items-center justify-content-center flex-column">
                        <div>
                          <div className="d-flex align-items-center">
                            <div className="me-4">
                              <i className="icon big white">
                                <svg
                                  width="48"
                                  height="48"
                                  viewBox="0 0 24 20"
                                  fill="white"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M20.2234 8.47385C21.0045 9.56142 21.3352 10.9242 20.9603 12.4248C22.8182 12.8303 23.8519 14.5035 23.7541 16.1113C23.699 17.0173 23.2872 17.9135 22.4755 18.5521C21.6703 19.1854 20.538 19.5151 19.1157 19.4388C18.4152 19.4386 17.4661 19.4267 16.4535 19.414C14.4211 19.3886 12.133 19.3599 11.0856 19.4158C9.2384 19.5145 7.7569 19.1005 6.68431 18.334C5.60921 17.5657 4.98952 16.4726 4.83736 15.3178C4.5418 13.0746 6.00729 10.7622 8.85101 10.1094C9.40123 8.31666 10.524 7.11734 11.8982 6.46006C13.3328 5.7739 14.991 5.70049 16.4796 6.0695C17.9652 6.43775 19.3553 7.26526 20.2234 8.47385Z"
                                    fill="black"
                                  />
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M4.67543 0.919591C5.06038 0.766643 5.49642 0.954712 5.64937 1.33965L6.08224 2.42912C6.23519 2.81406 6.04712 3.25011 5.66218 3.40306C5.27724 3.556 4.84119 3.36794 4.68825 2.98299L4.25537 1.89352C4.10242 1.50858 4.29049 1.07254 4.67543 0.919591ZM10.3588 1.05174C10.7401 1.21365 10.9179 1.65398 10.756 2.03524L10.3231 3.05455C10.1612 3.43581 9.72087 3.61362 9.33961 3.45171C8.95835 3.2898 8.78054 2.84948 8.94245 2.46822L9.37533 1.4489C9.53724 1.06765 9.97756 0.88983 10.3588 1.05174ZM5.92047 4.06378C7.48793 3.43159 9.21042 3.84151 10.3366 4.96023L10.9981 5.61742L10.1596 6.158C9.25206 6.74309 8.60123 7.6517 8.33934 8.69927L8.21907 9.18037L7.6709 9.36309C6.87984 9.62678 6.14955 10.0461 5.52302 10.5963L4.84721 11.1899L4.3528 10.619C4.05616 10.2765 3.81155 9.87936 3.63547 9.43619C2.79504 7.32097 3.8122 4.9141 5.92047 4.06378ZM0.648956 4.96499C0.813178 4.58472 1.25457 4.40958 1.63484 4.5738L2.64627 5.01059C3.02654 5.17481 3.20168 5.61621 3.03746 5.99648C2.87323 6.37675 2.43184 6.55189 2.05157 6.38767L1.04014 5.95087C0.659874 5.78665 0.484734 5.34525 0.648956 4.96499ZM2.94993 9.71681C3.10487 10.101 2.91905 10.538 2.53491 10.6929L1.49584 11.112C1.11169 11.2669 0.674684 11.0811 0.519749 10.697C0.364814 10.3128 0.550627 9.8758 0.934773 9.72087L1.97384 9.30179C2.35799 9.14685 2.795 9.33266 2.94993 9.71681Z"
                                    fill="black"
                                  />
                                </svg>
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
                              Sunset 06:00 PM
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
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

export default App;

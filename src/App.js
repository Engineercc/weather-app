import React from "react";
import Home from "./components/Home";
import { Route, Routes } from "react-router";
import FavoriteCities from './components/FavoriteCities';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/favorite-cities" element={<FavoriteCities/>} />
    </Routes>
  );
};

export default App;

import React from "react";
import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components";
import { Campaign, Home, Login, Register, AddFunds } from "./pages";
import { Footer } from "./components";
const App = () => {
  return (
    <div className="relative sm:-8 p-4 bg-[white] min-h-screen flex flex-row">
      <div className="flex-1 max-sm:w-full max-w-[1440px] mx-auto">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campaign" element={<Campaign />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />}/>
          <Route path="/AddFunds" element={<AddFunds />}/>
        </Routes>
        <Footer />
      </div>
    </div>
  );
};

export default App;

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import AlertComponent from "../components/Alert.component";
import PopupComponent from "../components/PopUp.component";

const ContactUs = () => {
  const [result, setResult] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "", visible: false });
  const [popupVisible, setPopupVisible] = useState(false);

  const sendEmail = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "2f0eafbc-ba78-425b-9dfc-9fbddc027523");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Success");
      event.target.reset();
      setPopupVisible(true);
    } else {
      console.log("Error", data);
      setResult(data.message);
      setAlert({
        type: "error",
        message: data.message,
        visible: true
      });
    }
  };
  const closePopup = () => {
    setPopupVisible(false);
  };

  return (
    <div className="flex justify-center bg-white py-8 px-4">
      <div className="flex flex-col items-center max-w-6xl w-full">
        <AlertComponent
          type={alert.type}
          message={alert.message}
          visible={alert.visible}
          onClose={() => setAlert({ ...alert, visible: false })}
        />

        <PopupComponent
          message="Pesan Terkirim!"
          visible={popupVisible}
          onClose={closePopup}
        />
        <div className="flex flex-col items-center py-12 px-24 rounded-xl bg-gray-100 shadow-md">
          <h1 className="font-bold text-4xl mb-10 text-black">Hubungi Kami</h1>
          <div className="flex flex-row gap-8">
            <motion.div
              whileHover={{
                scale: 1,
                border: "2px solid #334155"
              }}
              transition={{
                duration: 0.9
              }}
              style={{
                border: "2px solid transparent",
                borderRadius: "12px"
              }}>
              <div className="card bg-white w-[20vw] h-[30vh] shadow-lg border border-gray-200 rounded-xl">
                <div className="card-body flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4 justify-center">
                    <FaPhoneSquareAlt className="w-20 h-20 text-blue-700" />
                    <h2 className="card-title font-bold text-2xl text-gray-900">Nomor Telepon</h2>
                    <p className="text-gray-700">+6281212605579</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              whileHover={{
                scale: 1,
                border: "2px solid #334155"
              }}
              transition={{
                duration: 0.9
              }}
              style={{
                border: "2px solid transparent",
                borderRadius: "12px"
              }}>
              <div className="card bg-white w-[20vw] h-[30vh] shadow-lg border border-gray-200 rounded-xl">
                <div className="card-body flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4 justify-center">
                    <MdEmail className="w-20 h-20 text-green-700" />
                    <h2 className="card-title font-bold text-2xl text-gray-900">Email</h2>
                    <p className="text-gray-700">email.skripsi.crowdfund@gmail.com </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="flex flex-row justify-around w-full py-12 rounded-xl bg-gray-100 shadow-md mt-10">
          <div className="flex flex-col">
            <h1 className="font-bold text-4xl text-black">Contact Us</h1>
            <p className="text-balance w-[30vw] mb-4 mt-4 text-black flex text-start">
              Ada pertanyaan, masukan, atau butuh bantuan? Kami siap membantu! Apakah Anda seorang
              pembuat kampanye atau pendukung, jangan ragu untuk menghubungi kami.
            </p>
            <p className="text-balance w-[30vw] text-black flex text-start">
              Tim kami berdedikasi untuk memastikan pengalaman crowdfunding Anda lancar dan sukses.
            </p>
          </div>
          <form className="flex flex-col gap-4" onSubmit={sendEmail}>
            <label className="input input-bordered flex items-center gap-2 bg-white border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70 mr-2">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
              <input
                type="text"
                className="grow w-[20vw] bg-transparent focus:outline-none text-gray-900"
                placeholder="Nama lengkap"
                name="name"
                required
              />
            </label>

            <label className="input input-bordered flex items-center gap-2 bg-white border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70 mr-2">
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input
                type="text"
                className="grow w-[20vw] bg-transparent focus:outline-none text-gray-900"
                placeholder="Email"
                name="email"
                required
              />
            </label>

            <label className="input input-bordered flex items-center gap-2 bg-white border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
              <FaPhone className="h-4 w-4 opacity-70 mr-2" />
              <input
                type="text"
                className="grow w-[20vw] bg-transparent focus:outline-none text-gray-900"
                placeholder="Nomor telepon"
                required
              />
            </label>
            <textarea
              className="textarea textarea-bordered min-h-28 max-h-60 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900"
              placeholder="Masukan pesan"
              name="message"
              required
            />
            <button className="btn btn-outline bg-white btn-success w-[30vw] my-10 font-bold text-sm hover:bg-green-600 hover:text-white transition-colors duration-300">
              {result == "Sending...." ? <span className="loading loading-spinner"></span> : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

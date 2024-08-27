import React from "react";
import { useState, useEffect } from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [ethBalance, setEthBalance] = useState("");
  const [account, setAccount] = useState("");
  const navigate = useNavigate();
  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      console.log("Non-ethereum browser detected. You should install Metamask");
    }
    return provider;
  };

  const onConnect = async () => {
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        await currentProvider.request({
          method: "eth_requestAccounts",
        });
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        const account = userAccount[0];
        let ethBalance = await web3.eth.getBalance(account);
        setEthBalance(web3.utils.fromWei(ethBalance, "ether"));
        setAccount(account);
        setIsConnected(true);
        navigate(`/?balance=${web3.utils.fromWei(ethBalance, "ether")}`);
        // if (userId) {
        //   // Check if userId is available
        //   await fetch(`http://localhost:3000/users/${userId}/wallet`, {
        //     method: "PUT",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({ walletAddress: account }),
        //   });
        // }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onDisconnect = () => {
    setIsConnected(false);
    setEthBalance("");
    setAccount("");
  };
  return (
    <div className="max-w-[1280px] mx-auto p-4 bg-white">
      <div
        className="container"
        style={{
          flexDirection: "column",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          className="Header"
          style={{ fontFamily: "Poppins", fontWeight: "900" }}
        >
          <b>
            <h3>Buat akun baru</h3>
          </b>
        </div>
        {/* Nama depan */}
        <div className="input-container" style={{ margin: "0.5vh 0vw" }}>
          <div
            className="label"
            style={{
              fontSize: "1.1vh",
              fontFamily: "Poppins",
              margin: "0.3vh 0.3vw",
            }}
          >
            Nama depan
          </div>
          <div className="input">
            <input
              type="text"
              placeholder="Masukan nama depan"
              className="flex-1 p-2  rounded outline-none"
              style={{
                backgroundColor: "#EAEAEA",
                fontSize: "1.3vh",
                fontFamily: "Poppins",
                width: "20rem",
              }}
            ></input>
          </div>
        </div>
        {/* Nama belakang */}
        <div className="input-container" style={{ margin: "0.5vh 0vw" }}>
          <div
            className="label"
            style={{
              fontSize: "1.1vh",
              fontFamily: "Poppins",
              margin: "0.3vh 0.3vw",
            }}
          >
            Nama belakang
          </div>
          <div className="input">
            <input
              type="text"
              placeholder="Masukan nama belakang"
              className="flex-1 p-2  rounded outline-none"
              style={{
                backgroundColor: "#EAEAEA",
                fontSize: "1.3vh",
                fontFamily: "Poppins",
                width: "20rem",
              }}
            ></input>
          </div>
        </div>
        {/* Username */}
        <div className="input-container" style={{ margin: "0.5vh 0vw" }}>
          <div
            className="label"
            style={{
              fontSize: "1.1vh",
              fontFamily: "Poppins",
              margin: "0.3vh 0.3vw",
            }}
          >
            Username
          </div>
          <div className="input">
            <input
              type="text"
              placeholder="Username"
              className="flex-1 p-2  rounded outline-none"
              style={{
                backgroundColor: "#EAEAEA",
                fontSize: "1.3vh",
                fontFamily: "Poppins",
                width: "20rem",
              }}
            ></input>
          </div>
        </div>
        {/* Email */}
        <div className="input-container" style={{ margin: "0.5vh 0vw" }}>
          <div
            className="label"
            style={{
              fontSize: "1.1vh",
              fontFamily: "Poppins",
              margin: "0.3vh 0.3vw",
            }}
          >
            Email
          </div>
          <div className="input">
            <input
              type="Email"
              placeholder="Email"
              className="flex-1 p-2  rounded outline-none"
              style={{
                backgroundColor: "#EAEAEA",
                fontSize: "1.3vh",
                fontFamily: "Poppins",
                width: "20rem",
              }}
            ></input>
          </div>
        </div>
        {/* Password */}
        <div className="input-container" style={{ margin: "0.5vh 0vw" }}>
          <div
            className="label"
            style={{
              fontSize: "1.1vh",
              fontFamily: "Poppins",
              margin: "0.3vh 0.3vw",
            }}
          >
            Password
          </div>
          <div className="input">
            <input
              type="password"
              placeholder="Password"
              className="flex-1 p-2  rounded outline-none"
              style={{
                backgroundColor: "#EAEAEA",
                fontSize: "1.3vh",
                fontFamily: "Poppins",
                width: "20rem",
              }}
            ></input>
          </div>
        </div>
        {/* Jenis Kelamin */}
        <div className="input-container" style={{ margin: "0.5vh 0vw" }}>
          <div
            className="label"
            style={{
              fontSize: "1.1vh",
              fontFamily: "Poppins",
              margin: "0.3vh 0.3vw",
            }}
          >
            Jenis Kelamin
          </div>
          <div
            className="input"
            style={{
              width: "20rem",
              fontSize: "1.2vh",
              display: "flex",
              alignItems: "center",
            }}
          >
            <label
              style={{
                marginRight: "1rem",
                marginLeft: "0.5rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="radio"
                name="jenisKelamin"
                value="Laki-laki"
                style={{ transform: "scale(0.8)" }}
              />{" "}
              Laki-laki
            </label>
            <label style={{ display: "flex", alignItems: "center" }}>
              <input
                type="radio"
                name="jenisKelamin"
                value="Perempuan"
                style={{ transform: "scale(0.8)" }}
              />{" "}
              Perempuan
            </label>
          </div>
        </div>
        {/* Tanggal Lahir */}
        <div className="input-container" style={{ margin: "0.5vh 0vw" }}>
          <div
            className="label"
            style={{
              fontSize: "1.1vh",
              fontFamily: "Poppins",
              margin: "0.3vh 0.3vw",
            }}
          >
            Tanggal Lahir
          </div>
          <div
            className="input"
            style={{
              width: "20rem",
              fontSize: "1.2vh",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              className="input"
              style={{ width: "20rem", fontSize: "1.3vh" }}
            >
              <input
                type="date"
                className="flex-1 p-2  rounded outline-none"
                style={{
                  backgroundColor: "#EAEAEA",
                  fontSize: "1.3vh",
                  fontFamily: "Poppins",
                  width: "20rem",
                }}
              />
            </div>
          </div>
        </div>

        <div
          className="Header"
          style={{
            fontFamily: "Poppins",
            fontWeight: "900",
            marginBottom: "1rem",
          }}
        >
          <h3>
            <b>Connect with MetaMask</b>
          </h3>
        </div>

        {!isConnected && (
          <div>
            <button
              className="app-button__login"
              onClick={onConnect}
              style={{
                backgroundColor: "#007AFF",
                color: "white",
                fontSize: "1.3vh",
                fontFamily: "Poppins",
                padding: "1vh 2rem",
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
                marginBottom: "1rem",
              }}
            >
              Connect MetaMask
            </button>
          </div>
        )}
        {isConnected && (
          <div className="app-wrapper">
            <div className="app-details" style={{ marginBottom: "1rem" }}>
              <h2 style={{ fontFamily: "Poppins", fontWeight: "700" }}>
                You are connected to MetaMask.
              </h2>
              <div
                className="app-balance"
                style={{
                  fontSize: "1.2vh",
                  fontFamily: "Poppins",
                  marginTop: "0.5rem",
                }}
              >
                <span>Account: {account}</span>
                <br />
                <span>Balance: {ethBalance} ETH</span>
              </div>
            </div>
            <button
              className="app-buttons__logout"
              onClick={onDisconnect}
              style={{
                backgroundColor: "#FF3B30",
                color: "white",
                fontSize: "1.3vh",
                fontFamily: "Poppins",
                padding: "1vh 2rem",
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              Disconnect
            </button>
          </div>
        )}

        {/* <div className="button" style={{ margin: "1vh 0vw" }}>
          <button
            type="button"
            className="flex-1 p-2 rounded"
            style={{
              backgroundColor: "#007AFF",
              color: "white",
              fontSize: "1.3vh",
              fontFamily: "Poppins",
              width: "20rem",
              padding: "1vh 0",
              fontWeight: "bold",
            }}
          >
            Berikutnya
          </button>
        </div> */}
        <div
          className="Login"
          style={{ fontSize: "1.2vh", fontFamily: "Poppins", margin: "1vh 0" }}
        >
          Sudah punya akun?{" "}
          <a href="/Login" style={{ color: "#007AFF" }}>
            Login sekarang
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;

import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/User/register.api";
import TextFieldComponent from "../components/textfield.component";
import CustomButton from "../components/CustomButton.component";
import PageLoad from "../components/Loading.component";

export const Register = () => {
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      role: "user",
      account: "",
    },
  });

  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      console.log("Non-ethereum browser detected. You should install MetaMask");
    }
    return provider;
  };

  const onConnect = async () => {
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        await currentProvider.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        const account = userAccount[0];
        setIsConnected(true);

        form.setValue("account", account);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = async () => {
    if (isConnected) {
      setIsLoading(true);
      const newUser = {
        firstname: form.getValues("firstname"),
        lastname: form.getValues("lastname"),
        username: form.getValues("username"),
        email: form.getValues("email"),
        password: form.getValues("password"),
        role: "user",
        wallet: form.watch("account"),
      };
      console.log(newUser);
      await registerUser(newUser)
        .then(() => {
          alert("Register success!");
          navigate("/");
        })
        .catch((error) => {
          alert(error.message);
        });
      setIsLoading(false);
    } else {
      alert("Please connect to a Ethereum wallet to register");
    }
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
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
        <PageLoad loading={isLoading} />
        <div
          className="Header"
          style={{ fontFamily: "Poppins", fontWeight: "900" }}
        >
          <h3>
            <b>Buat akun baru</b>
          </h3>
        </div>

        {/* Form Fields */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <TextFieldComponent
              name="firstname"
              label="Nama depan"
              placeholder="Masukan nama depan"
              control={form.control}
              required
            />

            <TextFieldComponent
              name="lastname"
              label="Nama belakang"
              placeholder="Masukan nama belakang"
              control={form.control}
              required
            />

            <TextFieldComponent
              name="username"
              label="Username"
              placeholder="Masukan username"
              control={form.control}
              required
            />
            <TextFieldComponent
              type="email"
              name="email"
              label="Email"
              placeholder="Masukan email"
              control={form.control}
              required
            />
            <TextFieldComponent
              name="password"
              label="Password"
              placeholder="Masukan password"
              type="password"
              control={form.control}
              required
            />
            <input
              type="file"
              id="upload-button"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100 mt-4"
            />
            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Profile Preview"
                className="rounded-full object-cover mb-3 w-32 h-32"
              />
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {!isConnected ? (
              <CustomButton
                title="Connect MetaMask"
                bgColor="bg-orange-700"
                handleClick={onConnect}
                styles="mt-5"
              />
            ) : (
              <div className="app-details">
                <h2
                  style={{
                    fontFamily: "Poppins",
                    fontWeight: "700",
                    color: "green",
                  }}
                >
                  Connected with MetaMask
                </h2>
                <TextFieldComponent
                  name="account"
                  label="Account"
                  type="text"
                  control={form.control}
                  required
                  disabled
                />
              </div>
            )}

            <CustomButton
              btnType="submit"
              title="Register"
              bgColor="bg-blue-500"
              styles="mb-3 mt-1"
            />
          </div>
        </form>

        <div
          className="Login"
          style={{ fontSize: "2vh", fontFamily: "Poppins", margin: "1vh 0" }}
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

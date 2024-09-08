import React, { useState } from "react";
import Web3 from "web3";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/User/register.api";
import TextFieldComponent from "../components/textfield.component";
import CustomButton from "../components/CustomButton.component";
import PageLoad from "../components/Loading.component";

export const Register = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState("");
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
        setAccount(account);
        setIsConnected(true);

        form.setValue("account", account);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Handle form submission
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
          navigate("/home");
        })
        .catch((error) => {
          alert(error.message);
        });
      setIsLoading(false);
    } else {
      alert("Please connect to a Ethereum wallet to register");
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
                bgColor="brown"
                handleClick={onConnect}
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
              bgColor="#007AFF"
              styles="mb-3 mt-2"
            />
          </div>
        </form>

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

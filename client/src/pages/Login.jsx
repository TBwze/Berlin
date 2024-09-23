import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/CustomButton.component";
import TextFieldComponent from "../components/Textfield.component";
import PageLoad from "../components/Loading.component";
import { loginUser } from "../api/User/login.api";
import Web3 from "web3";
import AlertComponent from "../components/Alert.component";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "", visible: false });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
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
      setAlert({
        type: "error",
        message: "Non-ethereum browser detected. You should install MetaMask.",
        visible: true,
      });
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
        setAlert({
          type: "success",
          message: "MetaMask connected successfully!",
          visible: true,
        });
      }
    } catch (err) {
      setAlert({ type: "error", message: err.message, visible: true });
    }
  };

  const onSubmit = async () => {
    setIsLoading(true);
    const email = form.getValues("email");
    const password = form.getValues("password");
    const wallet = form.getValues("account");

    await loginUser(email, password, wallet)
      .then((response) => {
        setAlert({
          type: "success",
          message: "Login successful! Redirecting...",
          visible: true,
        });
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((error) => {
        if (wallet === "") {
          setAlert({
            type: "error",
            message: "Please connect to MetaMask to login.",
            visible: true,
          });
        } else {
          setAlert({
            type: "error",
            message: error,
            visible: true,
          });
        }
      });
    setIsLoading(false);
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

        <AlertComponent
          type={alert.type}
          message={alert.message}
          visible={alert.visible}
          onClose={() => setAlert({ ...alert, visible: false })}
        />

        <div
          className="Header"
          style={{ fontFamily: "Poppins", fontSize: "24px" }}
        >
          <b>
            <h3>Selamat Datang</h3>
          </b>
        </div>

        <form className="w-1/4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="input-container mt-5">
            <TextFieldComponent
              name="email"
              label="Email"
              placeholder="Email"
              type="email"
              control={form.control}
              required
            />
            <TextFieldComponent
              name="password"
              label="Password"
              placeholder="Password"
              type="password"
              control={form.control}
              required
            />
            {!isConnected ? (
              <div className="flex justify-center items-center mt-3">
                <CustomButton
                  title="Connect MetaMask"
                  bgColor="#101E38"
                  handleClick={onConnect}
                  textColor="#ffffff"
                  className="mt-3 rounded p-2"
                />
              </div>
            ) : (
              <div className="app-details mt-6">
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
          </div>
          <div
            className="button flex justify-center items-center mt-3"
          >
            <CustomButton
              btnType="submit"
              className="w-full mt-4"
              title="Login"
              bgColor="#2C7A5A"
              textColor="#ffffff"
            />
          </div>
        </form>
        <div
          className="signup"
          style={{ fontSize: "2vh", fontFamily: "Poppins", margin: "1vh 0" }}
        >
          Don't have an account?{" "}
          <a href="/register" style={{ color: "#007AFF" }}>
            Sign up now
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/User/register.api";
import TextFieldComponent from "../components/Textfield.component";
import CustomButton from "../components/CustomButton.component";
import PageLoad from "../components/Loading.component";
import AlertComponent from "../components/Alert.component";
import Cookies from "js-cookie";

export const Register = () => {
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "", visible: false });

  const form = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      role: "user",
      account: "",
      profilePicture: "",
    },
  });

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/");
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
      scrollToTop();
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
        scrollToTop();
      }
    } catch (err) {
      setAlert({ type: "error", message: err.message, visible: true });
      scrollToTop();
    }
  };

  const onSubmit = async () => {
    if (isConnected) {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("firstname", form.getValues("firstname"));
      formData.append("lastname", form.getValues("lastname"));
      formData.append("username", form.getValues("username"));
      formData.append("email", form.getValues("email"));
      formData.append("password", form.getValues("password"));
      formData.append("role", "user");
      formData.append("wallet", form.watch("account"));

      if (selectedFile) {
        formData.append("profilePicture", selectedFile);
      }

      try {
        await registerUser(formData);
        setAlert({
          type: "success",
          message: "Register success! Redirecting to login...",
          visible: true,
        });
        scrollToTop();
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        setAlert({ type: "error", message: error.message, visible: true });
        scrollToTop();
      } finally {
        setIsLoading(false);
      }
    } else {
      setAlert({
        type: "error",
        message: "Please connect to an Ethereum wallet to register",
        visible: true,
      });
      scrollToTop();
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
      <div className="flex flex-col items-center">
        <PageLoad loading={isLoading} />

        <AlertComponent
          type={alert.type}
          message={alert.message}
          visible={alert.visible}
          onClose={() => setAlert({ ...alert, visible: false })}
        />

        <div className="w-full bg-white border border-lime-200 p-6 rounded-lg shadow-md w-full max-w-md mt-5">
          <div className="text-center font-poppins font-bold text-2xl mb-6 mt-5">
            <h3>Buat akun baru</h3>
          </div>
          <form className="px-4" onSubmit={form.handleSubmit(onSubmit)}>
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

              <div className="flex flex-col items-start mt-4 w-full">
                <label
                  htmlFor="profilePicture"
                  className="font-poppins text-black mb-1 text-xs"
                >
                  Profile Picture
                </label>
                <input
                  type="file"
                  id="profilePicture"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full p-1 border border-gray-500 rounded-md text-xs text-gray-500 file:mr-4 file:py-2 file:px-4
               file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {selectedFile && (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Profile Preview"
                    className="rounded-full object-cover mb-3 w-32 h-32 mt-5"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              {!isConnected ? (
                <CustomButton
                  title="Connect MetaMask"
                  bgColor="#101E38"
                  textColor="#ffffff"
                  handleClick={onConnect}
                  className="mt-5 px-4"
                />
              ) : (
                <div className="text-center">
                  <h2 className="font-poppins font-semibold text-green-500">
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
                bgColor="#2C7A5A"
                textColor="#ffffff"
                className="mb-3 mt-1 px-6"
              />
            </div>
            <div className="flex justify-center text-xs font-poppins my-2">
              Sudah punya akun?{" "}
              <a href="/Login" className="text-blue-600 ml-1">
                Login sekarang
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/User/register.api";
import TextFieldComponent from "../components/Textfield.component";
import CustomButton from "../components/CustomButton.component";
import PageLoad from "../components/Loading.component";
import AlertComponent from "../components/Alert.component";
import PopupComponent from "../components/PopUp.component";
import { getUserDetails } from "../api/User/getUserDetails.api";
import PhoneNumberInput from "../components/PhoneNumber.component";

export const Register = () => {
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "", visible: false });
  const [popupVisible, setPopupVisible] = useState(false);
  const [phonenumber, setPhonenumber] = useState("");
  const form = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      role: "user",
      account: "",
      profilePicture: ""
    }
  });

  const checkIfLoggedIn = async () => {
    try {
      await getUserDetails();
      navigate("/");
    } catch (error) {}
  };
  useEffect(() => {
    checkIfLoggedIn();
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
        message: "Anda harus menginstall MetaMask.",
        visible: true
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
          message: "MetaMask Terhubung!",
          visible: true
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
      formData.append("phonenumber", phonenumber);
      formData.append("password", form.getValues("password"));
      formData.append("role", "user");
      formData.append("wallet", form.watch("account"));

      if (selectedFile) {
        formData.append("profilePicture", selectedFile);
      }

      try {
        await registerUser(formData);
        setPopupVisible(true);
      } catch (error) {
        setAlert({ type: "error", message: error.message, visible: true });
        scrollToTop();
      } finally {
        setIsLoading(false);
      }
    } else {
      setAlert({
        type: "error",
        message: "Hubungkan dengan MetaMasak untuk register",
        visible: true
      });
      scrollToTop();
    }
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    navigate("/login");
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

        <PopupComponent
          message="Register Berhasil! Silahkan login."
          visible={popupVisible}
          onClose={handleClosePopup}
        />
        <div className="w-full bg-white border border-black p-6 rounded-lg shadow-md max-w-md mt-5">
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

              <PhoneNumberInput value={phonenumber} onChange={setPhonenumber} defaultCountry="ID" />

              <div className="flex flex-col mt-4 w-full">
                <label htmlFor="profilePicture" className="font-poppins text-black mb-1 text-xs">
                  Foto Profil
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
              </div>
              <div className="flex flex-col items-center gap-4 w-full">
                {selectedFile && (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Profile Preview"
                    className="rounded-full object-cover w-32 h-32 mt-5"
                  />
                )}
                
                {!isConnected ? (
                <CustomButton
                  title="Hubungkan MetaMask"
                  bgColor="#101E38"
                  textColor="#ffffff"
                  handleClick={onConnect}
                  className="mb-3 mt-1 px-6"
                />
                ) : (
                  <div>
                    <h2 className="font-poppins font-semibold text-green-700 mt-5">
                      MetaMask Terhubung
                    </h2>
                    <TextFieldComponent
                      name="account"
                      label="Akun"
                      control={form.control}
                      required
                      disabled
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 w-full">
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

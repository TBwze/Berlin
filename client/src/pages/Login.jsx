import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/CustomButton.component";
import TextFieldComponent from "../components/textfield.component";
import PageLoad from "../components/Loading.component";
import useSignIn from "react-auth-kit/hooks/useSignIn";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const signIn = useSignIn();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async () => {
    setIsLoading(true);
    const email = form.getValues("email");
    const password = form.getValues("password");

    await loginUser(email, password)
      .then((response) => {
        signIn({
          token: response.data.token,
          expiresIn: 3600,
          tokenType: "Bearer",
          authState: { email: form.getValues("email") },
        });
        navigate("/");
        alert("Login success!");
        console.log(response);
      })
      .catch((error) => {
        alert(error.message);
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
        <div className="Header" style={{ fontFamily: "Poppins" }}>
          <b>
            <h3>Selamat Datang</h3>
          </b>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="input-container" style={{ margin: "1vh 0vw" }}>
            <TextFieldComponent
              name="email"
              label="Email"
              placeholder="Email"
              type="email"
              control={form.control}
              required
            />
          </div>

          <div className="input-container" style={{ margin: "1vh 0vw" }}>
            <TextFieldComponent
              name="password"
              label="Password"
              placeholder="Password"
              type="password"
              control={form.control}
              required
            />
          </div>
          <div className="button" style={{ margin: "1vh 0vw" }}>
            <CustomButton
              btnType="submit"
              title="Login"
              bgColor="bg-blue-500"
              textColor="text-white"
              styles="w-full mt-4"
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

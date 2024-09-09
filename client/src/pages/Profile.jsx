import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/CustomButton.component";
import TextFieldComponent from "../components/textfield.component";
import PageLoad from "../components/Loading.component";

const Profile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const form = useForm({
    defaultValues: {
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      image:
        "https://cdn.pixabay.com/photo/2022/01/11/21/48/link-6931554_1280.png",
    },
  });

  useEffect(() => {
    form.setValue("username", "asdf1");
    form.setValue("firstname", "asdf2");
    form.setValue("lastname", "asd12f");
    form.setValue("email", "12@gmail.com");
    form.setValue("password", "asdf");
    // Image URL is already set in defaultValues
  }, [form]);

  const onSubmit = (formData) => {
    setIsLoading(true);

    const dataToSubmit = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "image" && selectedFile) {
        dataToSubmit.append("image", selectedFile);
      } else {
        dataToSubmit.append(key, formData[key]);
      }
    });

    console.log("Updated Data:", dataToSubmit);

    setIsLoading(false);
    navigate("/");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      form.setValue("image", URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const imageValue = form.getValues("image");
    return () => {
      if (imageValue && imageValue.startsWith("blob:")) {
        URL.revokeObjectURL(imageValue);
      }
    };
  }, [form.watch("image")]);

  return (
    <div
      className="flex max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg my-2"
      style={{ fontFamily: "Poppins" }}
    >
      <PageLoad loading={isLoading} />
      <div className="flex w-full">
        <div className="w-1/3 flex flex-col items-center justify-start p-4">
          <img
            src={form.watch("image")}
            alt="Profile"
            className="rounded-full object-cover mb-4 w-48 h-48"
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
                       hover:file:bg-blue-100"
          />
        </div>
        <div className="w-2/3 p-4">
          <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-4">
              <TextFieldComponent
                name="username"
                label="Username"
                control={form.control}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <TextFieldComponent
                name="firstname"
                label="First Name"
                control={form.control}
                required
              />
              <TextFieldComponent
                name="lastname"
                label="Last Name"
                control={form.control}
                required
              />
            </div>
            <div className="mb-4">
              <TextFieldComponent
                name="email"
                label="Email"
                type="email"
                control={form.control}
                required
              />
            </div>
            <div className="flex gap-4">
              <CustomButton
                btnType="submit"
                title="Save Changes"
                className="bg-blue-500 text-white"
              />
              <CustomButton
                btnType="button"
                title="Cancel"
                className="bg-gray-500 text-white"
                handleClick={() => {
                  navigate("/");
                }}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

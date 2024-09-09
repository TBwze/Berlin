import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import profilePicture from "../assets/profilePicture.png";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/CustomButton.component";
import TextFieldComponent from "../components/textfield.component";
import PageLoad from "../components/Loading.component";

const Profile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const form = useForm({
    defaultValues: {
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
  });

  // Fetch the data from the API and set it in the form
  useEffect(() => {
    form.setValue("username", "asdf1");
    form.setValue("firstname", "asdf2");
    form.setValue("lastname", "asd12f");
    form.setValue("email", "12@gmail.com");
    form.setValue("password", "asdf"); // Mask password for security
  }, [form]);

  // Function to handle form submission
  const onSubmit = (formData) => {
    setIsLoading(true);
    const dataToSubmit = new FormData();

    // Append all form fields to the FormData
    Object.keys(formData).forEach((key) => {
      dataToSubmit.append(key, formData[key]);
    });

    // Append the profile image if one was selected
    if (selectedFile) {
      dataToSubmit.append("profileImage", selectedFile);
    }

    console.log("Updated Data:", dataToSubmit);
    alert("Updated Profile");
    setIsLoading(false);
    navigate("/");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      form.setValue("profileImage", file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div
      className="flex max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg my-2"
      style={{ fontFamily: "Poppins" }}
    >
      <PageLoad loading={isLoading} />
      <div className="w-1/3 flex flex-col items-center justify-center p-4 border-r border-gray-300">
        <img
          src={
            selectedFile ? URL.createObjectURL(selectedFile) : profilePicture
          }
          alt="Profile"
          className="rounded-full object-cover mb-3"
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
      <div className="w-2/3 p-4 mt-12">
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <TextFieldComponent
              name="username"
              label="Username"
              control={form.control}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <TextFieldComponent
                name="firstname"
                label="First Name"
                control={form.control}
                required
              />
            </div>
            <div className="flex flex-col">
              <TextFieldComponent
                name="lastname"
                label="Last Name"
                control={form.control}
                required
              />
            </div>
          </div>
          <div className="flex flex-col">
            <TextFieldComponent
              name="email"
              label="Email"
              type="email"
              control={form.control}
              required
            />
          </div>
          <div className="flex gap-4 mt-4">
            <CustomButton
              btnType="submit"
              title="Save Changes"
              className="bg-blue-500 text-white "
            />
            <CustomButton
              btnType="button"
              title="Cancel"
              className="bg-gray-500 text-white "
              handleClick={() => {
                navigate("/");
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

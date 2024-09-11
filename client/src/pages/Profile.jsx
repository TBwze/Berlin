import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/CustomButton.component";
import TextFieldComponent from "../components/textfield.component";
import PageLoad from "../components/Loading.component";
import { getUserDetails } from "../api/User/getUserDetails.api";
import { API_BASE_URL } from "../utils/api.utils";
import { updateUserProfile } from "../api/User/updateUser.api";

const Profile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const form = useForm({
    defaultValues: {
      id: "",
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      image: "",
    },
  });

  useEffect(() => {
    getUserDetails()
      .then((response) => {
        console.log(response.password);
        form.setValue("id", response._id);
        form.setValue("username", response.username);
        form.setValue("firstname", response.firstname);
        form.setValue("lastname", response.lastname);
        form.setValue("email", response.email);
        if (response.profilePicture !== null) {
          const originalPath = response.profilePicture;
          const startDirectory = "assets";
          const imageUrl = getFullUrl(originalPath, startDirectory);
          form.setValue("image", imageUrl);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, [form]);

  const getFullUrl = (fullPath, startDirectory) => {
    const startIndex = fullPath.indexOf(startDirectory);

    if (startIndex === -1) {
      console.error("Start directory not found in path");
      return "";
    }

    const relativePath = fullPath.substring(startIndex);
    const finalPath = relativePath.replace(/\\/g, "/");
    const fullUrl = `${API_BASE_URL}/${finalPath}`;

    return fullUrl;
  };

  const onSubmit = async () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("username", form.getValues("username"));
    formData.append("firstname", form.getValues("firstname"));
    formData.append("lastname", form.getValues("lastname"));
    formData.append("email", form.getValues("email"));

    const password = form.getValues("password");
    if (password != "") {
      formData.append("password", password);
    }

    if (selectedFile) {
      formData.append("profilePicture", selectedFile);
    }
    console.log(formData);
    try {
      await updateUserProfile(formData);
      alert("Profile updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile: " + error.message);
    }

    setIsLoading(false);
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
        <div className="w-1/6 flex"></div>
        <div className="w-1/3 flex flex-col justify-center p-4 items-center">
          <img
            src={
              form.watch("image") !== ""
                ? form.watch("image")
                : "src/assets/ProfilePicture.png"
            }
            alt="Profile"
            className="rounded-full object-cover mb-4 w-48 h-56"
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
        <div className="w-1/6 flex"></div>
        <div className="w-1/3 p-4">
          <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-4">
              <TextFieldComponent
                name="username"
                label="Username"
                control={form.control}
                required
              />
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
            <div className="mb-4">
              <TextFieldComponent
                name="password"
                label="password"
                type="password"
                placeholder="Change password"
                control={form.control}
              />
            </div>
            <div className="flex gap-4">
              <CustomButton
                btnType="submit"
                title="Save Changes"
                className="bg-green-500 text-white"
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
        <div className="w-1/6 flex"></div>
      </div>
    </div>
  );
};

export default Profile;

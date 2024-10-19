import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/CustomButton.component';
import TextFieldComponent from '../components/Textfield.component';
import PageLoad from '../components/Loading.component';
import { getUserDetails } from '../api/User/getUserDetails.api';
import { API_BASE_URL } from '../utils/api.utils';
import { updateUserProfile } from '../api/User/updateUser.api';
import AlertComponent from '../components/Alert.component';
import PopupComponent from '../components/PopUp.component';

const Profile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [alert, setAlert] = useState({
    visible: false,
    message: '',
    type: ''
  });
  const [popupVisible, setPopupVisible] = useState(false);
  const form = useForm({
    defaultValues: {
      id: '',
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      image: ''
    }
  });

  useEffect(() => {
    getUserDetails()
      .then((response) => {
        form.setValue('id', response._id);
        form.setValue('username', response.username);
        form.setValue('firstname', response.firstname);
        form.setValue('lastname', response.lastname);
        form.setValue('email', response.email);
        if (response.profilePicture !== null) {
          form.setValue('image', response.profilePicture);
        }
      })
      .catch((error) => {
        setAlert({
          visible: true,
          message: error.message,
          type: 'error'
        });
      });
  }, []);

  const onSubmit = async () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('username', form.getValues('username'));
    formData.append('firstname', form.getValues('firstname'));
    formData.append('lastname', form.getValues('lastname'));
    formData.append('email', form.getValues('email'));

    const password = form.getValues('password');
    if (password !== '') {
      formData.append('password', password);
    }

    if (selectedFile) {
      formData.append('profilePicture', selectedFile);
    }

    try {
      await updateUserProfile(formData);
      setPopUpVisible(true);
    } catch (error) {
      setAlert({
        visible: true,
        message: 'Error updating profile: ' + error.message,
        type: 'error'
      });
    }

    setIsLoading(false);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    navigate('/');
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      form.setValue('image', URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const imageValue = form.getValues('image');
    return () => {
      if (imageValue && imageValue.startsWith('blob:')) {
        URL.revokeObjectURL(imageValue);
      }
    };
  }, [form.watch('image')]);

  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <AlertComponent
          type={alert.type}
          message={alert.message}
          visible={alert.visible}
          onClose={() => setAlert({ ...alert, visible: false })}
        />
      </div>
      <div className="flex max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg m-8">
        <PageLoad loading={isLoading} />
        <PopupComponent
          message="Profile Updated!"
          visible={popupVisible}
          onClose={handleClosePopup}
        />
        <div className="flex w-full">
          <div className="w-1/6 flex"></div>
          <div className="w-1/3 flex flex-col justify-center p-4 items-center">
            <img
              src={
                form.watch('image') !== '' ? form.watch('image') : 'src/assets/ProfilePicture.png'
              }
              alt="Profile"
              className="rounded-full object-cover mb-4 w-auto h-56"
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
              <TextFieldComponent
                name="email"
                label="Email"
                type="email"
                control={form.control}
                required
              />
              <TextFieldComponent
                name="password"
                label="Password"
                type="password"
                placeholder="Change password"
                control={form.control}
              />
              <div className="flex gap-4 mt-5">
                <CustomButton
                  btnType="submit"
                  title="Save Changes"
                  bgColor="#4CAF50"
                  textColor="#ffffff"
                  className="px-4 font-medium"
                />
                <CustomButton
                  title="Cancel"
                  bgColor="#C70000"
                  handleClick={() => navigate('/')}
                  textColor="#ffffff"
                  className="px-4 font-medium"
                />
              </div>
            </form>
          </div>
          <div className="w-1/6 flex"></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

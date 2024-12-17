import React, { useState } from "react";
import { useForm } from "react-hook-form";
import TextFieldComponent from "../components/Textfield.component";
import TextFieldDecimalComponent from "../components/TextFieldDecimal.component";
import CustomButton from "../components/CustomButton.component";
import DropdownComponent from "../components/Dropdown.component";
import AlertComponent from "../components/Alert.component";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context";
import PageLoad from "../components/Loading.component";
import { uploadProfilePicture } from "../api/User/uploadImage.api";
import PopupComponent from "../components/PopUp.component";

const validationSchema = yup.object().shape({
  target: yup
    .number()
    .nullable()
    .required("Total target perlu diisi")
    .min(0.0001, "Targel minimal adalah 0.0001"),
  minimal_eth_bronze: yup
    .number()
    .nullable()
    .required("Minimal ETH peringkat Bronze perlu diisi")
    .test("min-eth-check-bronze", "Minimal ETH harus kurang dari total target", function (value) {
      const { target } = this.parent;
      return value < target || !value;
    }),

  minimal_eth_silver: yup
    .number()
    .nullable()
    .required("Minimal ETH peringkat Silver perlu diisi")
    .moreThan(
      yup.ref("minimal_eth_bronze"),
      "Minimal ETH Value harus lebih besar dari Minimal ETH di peringkat bronze"
    )
    .test("min-eth-check-silver", "Minimal ETH harus kurang dari total target", function (value) {
      const { target } = this.parent;
      return value < target || !value;
    }),

  minimal_eth_gold: yup
    .number()
    .nullable()
    .required("Minimal ETH peringkat Gold perlu diisi")
    .moreThan(
      yup.ref("minimal_eth_silver"),
      "Minimal ETH Value harus lebih besar dari Minimal ETH di peringkat silver"
    )
    .test("min-eth-check-gold", "Minimal ETH harus kurang dari total target", function (value) {
      const { target } = this.parent;
      return value < target || !value;
    })
});

const CreateCampaign = () => {
  const form = useForm({
    defaultValues: {
      judul_proyek: "",
      deskripsi_proyek: "",
      target: "",
      deadline: "",
      profilePicture: "",
      hadiah_bronze: "",
      hadiah_silver: "",
      hadiah_gold: "",
      minimal_eth_bronze: "",
      minimal_eth_silver: "",
      minimal_eth_gold: ""
    },
    resolver: yupResolver(validationSchema)
  });

  const { createCampaign } = useStateContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [popupVisible, setPopupVisible] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file || null);
  };

  const handleSaveButton = async () => {
    setIsLoading(true);

    const tiers = [
      {
        minAmount: form.getValues("minimal_eth_bronze").toString(),
        description: form.getValues("hadiah_bronze")
      },
      {
        minAmount: form.getValues("minimal_eth_silver").toString(),
        description: form.getValues("hadiah_silver")
      },
      {
        minAmount: form.getValues("minimal_eth_gold").toString(),
        description: form.getValues("hadiah_gold")
      }
    ];

    const picture = new FormData();
    picture.append("profilePicture", selectedFile);

    try {
      const response = await uploadProfilePicture(picture);
      form.setValue("profilePicture", response.data);

      const formDataRequest = {
        title: form.getValues("judul_proyek"),
        description: form.getValues("deskripsi_proyek"),
        targetAmount: form.getValues("target").toString(),
        deadline: form.getValues("deadline"),
        image: form.getValues("profilePicture"),
        rewards: tiers
      };

      await createCampaign(formDataRequest);
      setPopupVisible(true);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopupClose = () => {
    setPopupVisible(false);
    navigate("/");
  };
  return (
    <div className="max-w-[1280px] mx-auto p-4 bg-white flex flex-col">
      <PageLoad isLoading={isLoading} />
      <form
        className="flex flex-row items-center justify-around"
        onSubmit={form.handleSubmit(handleSaveButton)}>
        <div className="flex flex-col w-1/3">
          <PopupComponent
            message="Kampanye telah Sukses dibuat!"
            visible={popupVisible}
            onClose={handlePopupClose}
          />
          <div className="Header font-bold text-2xl font-poppins mb-7">
            <h3>Mulai Kampanye untuk Projek Baru</h3>
          </div>
          {/* Judul Projek */}
          <div className="mt-2">
            <TextFieldComponent
              name="judul_proyek"
              label="Judul Proyek"
              placeholder="Masukan Judul Proyek"
              control={form.control}
              required
            />
          </div>
          {/* Deskripsi Projek */}
          <div className="mt-2">
            <TextFieldComponent
              name="deskripsi_proyek"
              label="Deskripsi Proyek"
              placeholder="Informasi untuk memperjelas intensi projek dan kampanye"
              control={form.control}
              required
              type="textarea"
              rows={4}
            />
          </div>
          <div className="mt-2">
            <TextFieldDecimalComponent
              name="target"
              label="Total Target"
              control={form.control}
              required
              addOrmentText="ETH"
              errorMessage={form.formState.errors.target?.message}
            />
          </div>
          {/* Target */}
          <div className="mt-2">
            <DropdownComponent
              control={form.control}
              name="deadline"
              label="Durasi Proyek"
              optionData={[
                { deadline: 30, days: "30 hari" },
                { deadline: 60, days: "60 hari" },
                { deadline: 90, days: "90 hari" }
              ]}
              optionId="deadline"
              optionLabel="days"
              required
              placeholder="Pilih Durasi Proyek"
            />
          </div>
          {/* Upload Image */}
          <div className="flex flex-col items-start mt-6">
            <div className="text-xs text-black font-poppins">Masukkan gambar</div>
            <input
              type="file"
              id="profilePicture"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full text-sm text-gray-500
             file:mr-4 file:py-2 file:px-4
             file:rounded-lg file:border-0
             file:text-sm file:font-semibold
             file:bg-blue-50 file:text-blue-700
             hover:file:bg-blue-100 border mt-1 border-black/50 rounded-lg"
            />
            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Uploaded preview"
                className="object-cover mb-3 w-full h-60 rounded-lg mt-5"
              />
            )}
          </div>

          <CustomButton
            btnType="submit"
            title="Create"
            bgColor="#4CAF50"
            textColor="#ffffff"
            className="font-medium mb-3 mt-7"
          />
        </div>
        <div className="flex flex-col w-1/3">
          {/* Header */}
          <div className="Header font-bold text-lg font-poppins mb-4">
            <h3>Pengaturan Hadiah</h3>
          </div>

          {/* Gold Tier */}
          <div className="border border-gray-300 rounded-lg p-4 mb-7 shadow-lg">
            <div className="flex items-center mb-2">
              <img src="src/assets/gold.png" alt="Gold tier" className="w-8 h-8 mr-2" />
              <h4 className="text-xl font-semibold font-poppins">Peringkat Gold</h4>
            </div>
            <TextFieldComponent
              name="hadiah_gold"
              label="Hadiah"
              placeholder="Hadiah untuk tier gold"
              control={form.control}
              required
              type="textarea"
              rows={3}
            />
            <TextFieldDecimalComponent
              name="minimal_eth_gold"
              label="Minimal Eth"
              control={form.control}
              required
              addOrmentText="ETH"
              errorMessage={form.formState.errors.minimal_eth_gold?.message}
            />
          </div>

          {/* Silver Tier */}
          <div className="border border-gray-300 rounded-lg p-4 mb-4 shadow-lg">
            <div className="flex items-center mb-2">
              <img src="src/assets/silver.png" alt="Silver tier" className="w-8 h-8 mr-2" />
              <h4 className="text-xl font-semibold font-poppins">Peringkat Silver</h4>
            </div>
            <TextFieldComponent
              name="hadiah_silver"
              label="Hadiah"
              placeholder="Hadiah untuk tier silver"
              control={form.control}
              required
              type="textarea"
              rows={3}
            />
            <TextFieldDecimalComponent
              name="minimal_eth_silver"
              label="Minimal Eth"
              control={form.control}
              required
              addOrmentText="ETH"
              errorMessage={form.formState.errors.minimal_eth_silver?.message}
            />
          </div>

          {/* Bronze Tier */}
          <div className="border border-gray-300 rounded-lg p-4 shadow-lg">
            <div className="flex items-center mb-2">
              <img src="src/assets/bronze.png" alt="Bronze tier" className="w-8 h-8 mr-2" />
              <h4 className="text-xl font-semibold font-poppins">Peringkat Bronze</h4>
            </div>
            <TextFieldComponent
              name="hadiah_bronze"
              label="Hadiah"
              placeholder="Hadiah untuk tier bronze"
              control={form.control}
              required
              type="textarea"
              rows={3}
            />
            <TextFieldDecimalComponent
              name="minimal_eth_bronze"
              label="Minimal Eth"
              control={form.control}
              required
              addOrmentText="ETH"
              errorMessage={form.formState.errors.minimal_eth_bronze?.message}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;

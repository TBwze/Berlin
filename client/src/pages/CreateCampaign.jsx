import React, { useState } from "react";
import { useForm } from "react-hook-form";
import TextFieldComponent from "../components/Textfield.component";
import DatePickerComponent from "../components/DatePicker.component";
import TextFieldDecimalComponent from "../components/TextFieldDecimal.component";
import dayjs from "dayjs";
import CustomButton from "../components/CustomButton.component";
import DropdownComponent from "../components/Dropdown.component";

const CreateCampaign = () => {
  const form = useForm({
    defaultValues: {
      judul_proyek: "",
      deskripsi_proyek: "",
      informasi_proyek: "",
      target: null,
      deadline: "",
      image: "",
      hadiah_bronze: "",
      hadiah_silver: "",
      hadiah_gold: "",
      minimal_eth_bronze: null,
      minimal_eth_silver: null,
      minimal_eth_gold: null,
    },
  });

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
    <div className="max-w-[1280px] mx-auto p-4 bg-white flex flex-col">
      <form
        className="flex flex-row items-center justify-around"
        onSubmit={form.handleSubmit()}
      >
        <div className="flex flex-col w-1/3">
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
              placeholder="Deskripsi singkat projek yang ditampilkan"
              control={form.control}
              required
            />
          </div>
          {/* Informasi Projek */}
          <div className="mt-2">
            <TextFieldComponent
              name="informasi_proyek"
              label="Informasi Proyek"
              placeholder="Informasi untuk memperjelas intensi projek dan kampanye"
              control={form.control}
              required
              type="textarea"
              rows={4}
            />
          </div>
          <div className="mt-2">
            <TextFieldDecimalComponent
              name="decimalField"
              label="Decimal Field"
              control={form.control}
              required
              addOrmentText="ETH"
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
                { deadline: 90, days: "90 hari" },
              ]}
              optionId="deadline"
              optionLabel="days"
              required
              placeholder="Pilih Durasi Proyek"
            />
          </div>
          {/* Upload Image */}
          <div className="flex flex-col items-center mt-2">
            <input
              type="file"
              id="upload-button"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100 mt-4"
            />
            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt=""
                className="object-cover mb-3 w-full h-60 center mt-5"
              />
            )}
          </div>
          <CustomButton
            btnType="submit"
            title="Register"
            bgColor="bg-blue-500"
            styles="mb-3 mt-7"
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
              <img
                src="src/assets/gold.png"
                alt="Gold tier"
                className="w-8 h-8 mr-2"
              />
              <h4 className="text-xl font-semibold font-poppins">Gold Tier</h4>
            </div>
            <TextFieldComponent
              name="hadiah_gold"
              label="Hadiah"
              placeholder="Hadiah tier gold"
              control={form.control}
              required
            />
            <TextFieldDecimalComponent
              name="minimal_eth_gold"
              label="Minimal Eth"
              control={form.control}
              required
              addOrmentText="ETH"
            />
          </div>

          {/* Silver Tier */}
          <div className="border border-gray-300 rounded-lg p-4 mb-4 shadow-lg">
            <div className="flex items-center mb-2">
              <img
                src="src/assets/silver.png"
                alt="Silver tier"
                className="w-8 h-8 mr-2"
              />
              <h4 className="text-xl font-semibold font-poppins">
                Silver Tier
              </h4>
            </div>
            <TextFieldComponent
              name="hadiah_silver"
              label="Hadiah"
              placeholder="Hadiah tier silver"
              control={form.control}
              required
            />
            <TextFieldDecimalComponent
              name="minimal_eth_silver"
              label="Minimal Eth"
              control={form.control}
              required
              addOrmentText="ETH"
            />
          </div>

          {/* Bronze Tier */}
          <div className="border border-gray-300 rounded-lg p-4 shadow-lg">
            <div className="flex items-center mb-2">
              <img
                src="src/assets/bronze.png"
                alt="Bronze tier"
                className="w-8 h-8 mr-2"
              />
              <h4 className="text-xl font-semibold font-poppins">
                Bronze Tier
              </h4>
            </div>
            <TextFieldComponent
              name="hadiah_bronze"
              label="Hadiah"
              placeholder="Hadiah tier bronze"
              control={form.control}
              required
            />
            <TextFieldDecimalComponent
              name="minimal_eth_bronze"
              label="Minimal Eth"
              control={form.control}
              required
              addOrmentText="ETH"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;

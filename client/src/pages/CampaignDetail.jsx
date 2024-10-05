import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomButton from '../components/CustomButton.component';
import TextFieldDecimalComponent from '../components/TextFieldDecimal.component';
import TextFieldComponent from '../components/Textfield.component';

const CampaignDetail = () => {
  const [data,setData] = useState([]);
  const { contract } = useContract('0x4AdeDAe205840c757e5824682c8F82537C6ECB8f');
  
  const form = useForm({
    defaultValues: {
      minimal_eth: '',
      Komentar: ''
    }
  });

  return (
    <div className="flex flex-col items-center justify-center mx-auto max-w-[1280px] p-4">
      <div className = "flex flex-col text-center pb-4">
        {/* title Section */}
        <div className="Header font-bold text-xl pb-4">
            <h3>Lorem ipsum dolor sit amet</h3>
        </div>
        <div className="items-center text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ultrices pellentesque pellentesque. Proin venenatis euismod interdum. Integer faucibus lobortis nulla, nec eleifend ante rutrum non. Integer vehicula mi et justo convallis ultricies.</div>
      </div>
      <div className = "flex flex-row justify-around">
        {/* left section */}
        <div className = "flex flex-col gap-8 w-1/2">
           {/* Galery section */}
            <div className= "grid grid-rows-2 grid-cols-4 gap-4 items-center w-auto border border-gray-300 rounded-lg shadow-lg p-4">
              <div className= "row-span-2 col-span-2 w-auto"><img src="src/assets/dummy.jpg" alt="test"/></div>
              <img className="size-full" src="src/assets/dummy.jpg" alt="test"/>
              <img className="size-full" src="src/assets/dummy.jpg" alt="test"/>
              <img className="size-full" src="src/assets/dummy.jpg" alt="test"/>
              <img className="size-full" src="src/assets/dummy.jpg" alt="test"/>
            </div>
            {/* Badge Section*/}
            <div className="flex flex-col gap-4">
                {/*Gold Badge */}
                <div className="flex flex-row gap-10 p-4 border border-gray-300 rounded-lg shadow-lg">
                  <div className='flex flex-col items-center'>
                    <img className="w-10" src="src/assets/gold.png" alt="Gold Badge" />
                    <h3 className='text-center text-sm font-bold'>Gold</h3>
                  </div>
                  <ol className="list-decimal text-xs">
                    <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ultrices pellentesque pellentesque.</li>
                    <li>Sed pretium ut nunc sed dapibus.</li>
                    <li>Morbi tortor neque, fringilla sed convallis sit amet, mollis id arcu.</li>
                  </ol>
                </div>
                {/*Silver Badge */}
                <div className="flex flex-row gap-10 p-4 border border-gray-300 rounded-lg shadow-lg">
                  <div className='flex flex-col items-center'>
                    <img className="w-10 items-center" src="src/assets/silver.png" alt="Silver Badge" />
                    <h3 className='text-center text-sm font-bold'>Silver</h3>
                  </div>
                  <ol className="list-decimal text-xs">
                    <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ultrices pellentesque pellentesque.</li>
                    <li>Sed pretium ut nunc sed dapibus.</li>
                    <li>Morbi tortor neque, fringilla sed convallis sit amet, mollis id arcu.</li>
                  </ol>
                </div>
                {/*Bronze Badge */}
                <div className="flex flex-row gap-10 p-4 border border-gray-300 rounded-lg  shadow-lg">
                  <div className='flex flex-col items-center'>
                    <img className="w-10 items-center" src="src/assets/bronze.png" alt="Bronze Badge" />
                    <h3 className='text-center text-sm font-bold'>Bronze</h3>
                  </div>
                  <ol className="list-decimal text-xs">
                    <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ultrices pellentesque pellentesque.</li>
                    <li>Sed pretium ut nunc sed dapibus.</li>
                    <li>Morbi tortor neque, fringilla sed convallis sit amet, mollis id arcu.</li>
                  </ol>
                </div>
              </div>
            {/* Comment Section */}  
            <div className='flex flex-col gap-2'>
              {/* Header */}
              <h2 className='font-bold text-xl mb-4'>Komentar</h2>
              {/* textbox Comment */}
              <div className='flex flex-row border border-gray-300 rounded-lg shadow-lg p-2 items-center gap-4'>
                <img className='w-20' src='src/assets/ProfilePicture.png' alt='ProfilePicture' />
                <textarea className='w-full border border-gray-300 rounded-lg shadow-lg p-2 text-sm' placeholder='Masukkan Komentar Anda'></textarea>
                <CustomButton
                btnType="button"
                title="POST"
                bgColor="#4CAF50"
                styles="font-semibold rounded px-4 border-2"
                textColor="#ffffff"
                />
              </div>
              {/*Comments */}
              <div className='flex flex-row items-center border border-gray-300 rounded-lg shadow-lg p-2'>
                <img className='w-20' src='src/assets/ProfilePicture.png' alt='ProfilePicture' />
                <div className='flex flex-col'>
                  <h3 className='font-semibold text-sm'>Username</h3>
                  <p className='text-xs font-thin'>15 - 06- 2024</p>
                  <p className='text-sm text-wrap text-pretty text-balance'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ultrices pellentesque pellentesque.</p>
                </div>
              </div>

              <div className='flex flex-row items-center border border-gray-300 rounded-lg shadow-lg p-2'>
                <img className='w-20' src='src/assets/ProfilePicture.png' alt='ProfilePicture' />
                <div className='flex flex-col'>
                  <h3 className='font-semibold text-sm'>Username</h3>
                  <p className='text-xs font-thin'>15 - 06- 2024</p>
                  <p className='text-sm text-wrap text-pretty text-balance'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ultrices pellentesque pellentesque.</p>
                </div>
              </div>

              <div className='flex flex-row items-center border border-gray-300 rounded-lg shadow-lg p-2'>
                <img className='w-20' src='src/assets/ProfilePicture.png' alt='ProfilePicture' />
                <div className='flex flex-col'>
                  <h3 className='font-semibold text-sm'>Username</h3>
                  <p className='text-xs font-thin'>15 - 06- 2024</p>
                  <p className='text-sm text-wrap text-pretty text-balance'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ultrices pellentesque pellentesque.</p>
                </div>
              </div>
          </div>
        </div>
        {/* right section */}
        <div className = "flex flex-col w-1/2 pl-10 gap-4 ">
            <div className="flex flex-row items-center">
                <img src="src/assets/ProfilePicture.png" alt="ProfilePicture"  className="w-20 h-20 mr-2"/>
                <h4 className="text-xl font-semibold">Creator</h4>
            </div>
            <p className='font-bold text-right'>60 / 100 Tercapai</p>
            {/* Progress Bar */}
            <div class='w-full  bg-gray-300 rounded-3xl h-3.5 '>
              <div class='bg-green-500 h-3.5 rounded-3xl text-xs text-white text-center shadow-lg w-3/5' role='progressbar' aria-valuenow='60' aria-valuemin='0' aria-valuemax='100'>60%</div>
            </div>
            <div className='flex flex-row justify-between'>
              <h3 className='font-bold'>100 Donatur</h3>
              <div className='flex flex-col'>
                <h3 className='font-bold'>Deadline :</h3>
                <p className='text-sm'>20 Desember 2024</p>
              </div>
            </div>
          {/* Informasi Proyek */}
            <h3 className="font-bold">Informasi Proyek</h3> 
            <p className="text-balance text-left text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ultrices pellentesque pellentesque. Proin venenatis euismod interdum. Integer faucibus lobortis nulla, nec eleifend ante rutrum non. Integer vehicula mi et justo convallis ultricies. Duis sed sodales neque. Aenean at quam et metus rhoncus feugiat. Sed pretium ut nunc sed dapibus. Curabitur tincidunt posuere sapien ut eleifend. Morbi ac libero ac risus tincidunt tempor. Morbi tortor neque, fringilla sed convallis sit amet, mollis id arcu. Pellentesque consectetur arcu quis nisl gravida, a placerat nibh lacinia. Quisque ligula metus, lacinia sit amet felis a, gravida maximus felis. Sed sollicitudin, ligula nec efficitur scelerisque, quam nisi aliquet mauris, et ornare risus mauris ut lorem. Fusce vel suscipit orci. Nulla nec augue quis elit tempus venenatis vel ut quam. Vestibulum eget odio elit.</p>
          {/* Share Button */}  
            <CustomButton className="w-40"
            btnType="button"
            title="Share"
            bgColor="#4169E1"
            styles="font-semibold rounded px-4 border-2"
            textColor="white"
            borderColor="#2E6950"
            />
            {/* Nominal Donasi */}  
            <div className="border border-gray-300 rounded-lg p-4 shadow-lg">
              <div className="flex flex-col mb-2">
                  <TextFieldDecimalComponent
                    name="minimal_eth"
                    label="Masukkan Nominal Donasi"
                    control={form.control}
                    required
                    addOrmentText="ETH"
                  />
              </div>
            </div>
            <CustomButton
            btnType="button"
            title="Donasi Sekarang"
            bgColor="#4CAF50"
            styles="font-semibold rounded px-4 border-2"
            textColor="#ffffff"
            />
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
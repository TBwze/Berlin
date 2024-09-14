import React, { useState } from "react";
import { ethers } from "ethers";

import TextFieldComponent from "../components/textfield.component";
import { useForm } from "react-hook-form";
import { useStateContext } from "../context";
import PageLoad from "../components/Loading.component";
import { checkIfImage } from "../utils/image.utils";

const CreateCampaign = () => {
    const [file, setFile] = useState();
    const [image, setImage] = useState(null);
    const [count, setCount] = useState(0);
    const [Target1, setTarget1] = useState(0);
    const [Target2, setTarget2] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { createCampaign } = useStateContext();

    const form = useForm({
        defaultValues: {
            judul_proyek: "",
            deskripsi_proyek: "",
            informasi_proyek: "",
            target: "",
            deadline: "",
            image: "",
            // jumlah_badge: "",
            // nama_badge: "",
            // deskripsi_badge: "",
        },
    });

    function Increment() {
        setCount(function (prevCount) {
        return (prevCount += 1);
        });
    }

    function decrement() {
        setCount(function (prevCount) {
            if (prevCount > 0) {
                return (prevCount -= 1); 
            } else {
                return (prevCount = 0);
            }
        });
    }

    function IncrementTarget1() {
        setTarget1(function (prevCount) {
        return (prevCount += 1);
        });
    }

    function decrementTarget1() {
        setTarget1(function (prevCount) {
            if (prevCount > 0) {
                return (prevCount -= 1); 
            } else {
            return (prevCount = 0);
            }
        });
    }

    function IncrementTarget2() {
        setTarget2(function (prevCount) {
            return (prevCount += 1);
        });
    }

    function decrementTarget2() {
        setTarget2(function (prevCount) {
            if (prevCount > 0) {
                return (prevCount -= 1); 
            } else {
                return (prevCount = 0);
            }
        });
    }

    const handleFormFieldChange = (fieldName, e) => {
        setForm({ ...form, [fieldName]: e.target.value })
      }

    const handleSubmit = async(e) => {
        e.preventDefault(e);
        
        checkIfImage = async (exists) => {
            if (exists) {
                setIsLoading(true);
                await createCampaign({
                    ...form, target: ethers.utils.parseUnits(form.target, 18)
                });
                setIsLoading(false);
            } else {
                alert("Image URL invalid!")
                form.setValue("image", "");
            }
        }
        console.log(form)
    }
    
    return (
        <div className="max-w-[1280px] mx-auto p-4 bg-white" style={{ flexDirection: 'column'}}>
            <PageLoad loading = {isLoading} />
            <div className = "container" style={{flexDirection:"row", display:'flex', alignItems: 'center', justifyContent: "space-around"}}>
                <div className= "Campaign" style={{display: "flex", flexDirection: "column"}}>
                    <div className= "Header" style={{fontFamily: "Poppins", fontWeight: "900"}}>
                        <h3><b>Mulai Kampanye untuk Projek Baru</b></h3>
                    </div>
                        {/* Judul Projek */}
                    <div className="input-container" style={{margin:'0.5vh 0vw'}}>
                        <TextFieldComponent
                        name="judul_proyek"
                        label="Judul Proyek"
                        placeholder="Masukan Judul Proyek"
                        control={form.control}
                        required
                        />
                    </div>
                        {/* Deskripsi Projek */}
                    <div className="input-container" style={{margin:'0.5vh 0vw'}}>
                        <TextFieldComponent
                        name="deskripsi_proyek"
                        label="Deskripsi Proyek"
                        placeholder="Deskripsi singkat projek yang ditampilkan"
                        control={form.control}
                        required
                        />
                    </div>
                        {/* Informasi Projek */}
                    <div className="input-container" style={{margin:'0.5vh 0vw'}}>
                        <TextFieldComponent
                        name="informasi_proyek"
                        label="Informasi Proyek"
                        placeholder="Informasi untuk memperjelas intensi projek dan kampanye"
                        control={form.control}
                        required
                        type= "textarea"
                        row = {4}
                        />
                    </div>
                        {/* Target */}
                    <div className="input-container" style={{margin:'0.5vh 0vw'}}>
                        <TextFieldComponent
                        name="target"
                        label="Target"
                        placeholder="Jumlah target dalam ETH"
                        control={form.control}
                        required
                        />
                    </div>
                        {/* Upload Image */}
                    <div className="input-container" style={{margin:'0.5vh 0vw'}}>
                        <div className="label" style ={{fontSize: '1.1vh', fontFamily:'Poppins', margin:'0.3vh 0.3vw'}}>
                            Masukkan Gambar
                        </div>
                        {image && <img src={image} alt="Uploaded Image" style={{ width: '15vw', height: '15vw', objectFit: 'cover' }}/>}
                        <div className="input">
                            <input type="file" onChange={handleChange} className="flex-1 p-2  rounded outline-none" style={{fontSize: '1.3vh', fontFamily:'Poppins', width:'28rem' }}/>
                        </div>
                    </div>
                </div>
                <div className= "Reward" style={{display: "flex", flexDirection: "column"}}>
                        {/* Pengaturan Reward */}
                    <div className="input-container" style={{margin:'0.5vh 0vw'}}>
                        <div className="label" style ={{fontSize: '1.1vh', fontFamily:'Poppins', margin:'0.3vh 0.3vw'}}>
                            <b>Pengaturan Reward</b>
                        </div>
                        <div className="input">
                            <div className="jumlah-reward" style={{display: "flex", flexDirection: "row"}}>
                                <div className="left">
                                    <p className="flex-1 p-2  rounded outline-none" style={{fontSize: '1.3vh', fontFamily:'Poppins', width:'28rem' }}>Jumlah Badge</p>
                                </div>
                                <div className="Right" style={{display: "flex", flexDirection:"row", justifyContent: "space-around", alignItems:"center", backgroundColor: '#EAEAEA'}}>
                                    <button onClick={decrement} style={{ margin: '0vh 0.8vw'}}>-</button>
                                    <h1>{count}</h1>
                                    <button onClick={Increment} style={{ margin: '0vh 0.8vw'}}>+</button>
                                </div>
                            </div>
                        </div>
                        <div className="Badge-Container" style={{backgroundColor: "#D9D9D9", padding: "1vh 1vw", marginTop: "2vh"}}>
                            <p style={{fontSize: '1.3vh', fontFamily:'Poppins', width:'28rem' }}>Badge - 1</p>
                                {/* Nama Badge */}
                            <div className="input-container" style={{margin:'2vh 0vw'}}>
                                <TextFieldComponent
                                name="nama_badge"
                                label="Nama Badge"
                                placeholder="Nama Badge"
                                control={form.control}
                                required
                                />
                            </div>
                               {/* Deskripsi Badge */}
                            <div className="input-container" style={{margin:'2vh 0vw'}}>
                                <TextFieldComponent
                                name="deskripsi_badge"
                                label="Deskripsi Badge"
                                placeholder="Reward badge untuk donatur"
                                control={form.control}
                                required
                                />
                            </div>
                               {/* Jangka Target Badge */}
                            <div className="input-container" style={{margin:'2vh 0vw'}}>
                                <div className="label" style ={{fontSize: '1.1vh', fontFamily:'Poppins', margin:'0.8vh 0.3vw', fontWeight:"bold"}}>
                                    Jangka Target Badge
                                </div>
                                <div className="Counter-Target" style={{display:"flex", flexDirection:"row", justifyContent:"space-evenly", backgroundColor:"#B2B2B2", padding:'1vh 1vw'}}>
                                    <div className="Targets" style={{display: "flex", flexDirection:"row", justifyContent: "space-around", alignItems:"center", backgroundColor: '#EAEAEA'}}>
                                        <button onClick={decrementTarget1} style={{ margin: '0vh 0.8vw'}}>-</button>
                                        <h1>{Target1}</h1>
                                        <button onClick={IncrementTarget1} style={{ margin: '0vh 0.8vw'}}>+</button>
                                    </div>
                                    <div className="Targets" style={{display: "flex", flexDirection:"row", justifyContent: "space-around", alignItems:"center"}}>
                                        <b>-</b>
                                    </div>
                                    <div className="Targets" style={{display: "flex", flexDirection:"row", justifyContent: "space-around", alignItems:"center", backgroundColor: '#EAEAEA', padding:"0.5vh 0vw"}}>
                                        <button onClick={decrementTarget2} style={{ margin: '0vh 0.8vw'}}>-</button>
                                        <h1>{Target2}</h1>
                                        <button onClick={IncrementTarget2} style={{ margin: '0vh 0.8vw'}}>+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button type="submit" className="bg-gray-300 font-bold rounded-full px-4 py-2 border-2 border-black" style={{fontSize:"1.2vh", margin:"1vh 0vw"}}>Buat Projek</button>
        </div>
    )
}



export default CreateCampaign;
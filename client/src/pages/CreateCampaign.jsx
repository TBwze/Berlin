import React, { useState } from "react";

const CreateCampaign = () => {
    const [file, setFile] = useState();
    const [image, setImage] = useState(null);
    const [count, setCount] = useState(0);
    const [Target1, setTarget1] = useState(0);
    const [Target2, setTarget2] = useState(0);

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

    function handleChange(e) {
        console.log(e.target.files);
        setFile(URL.createObjectURL(e.target.files[0]));
        setImage(URL.createObjectURL(e.target.files[0]));
    }
    

    return (
        <div className="max-w-[1280px] mx-auto p-4 bg-white" style={{ flexDirection: 'column'}}>
            <div className = "container" style={{flexDirection:"row", display:'flex', alignItems: 'center', justifyContent: "space-around"}}>
                <div className= "Campaign" style={{display: "flex", flexDirection: "column"}}>
                    <div className= "Header" style={{fontFamily: "Poppins", fontWeight: "900"}}>
                        <h3><b>Mulai Kampanye untuk Projek Baru</b></h3>
                    </div>
                        {/* Judul Projek */}
                    <div className="input-container" style={{margin:'0.5vh 0vw'}}>
                        <div className="label" style ={{fontSize: '1.1vh', fontFamily:'Poppins', margin:'0.3vh 0.3vw'}}>
                            Judul Projek
                        </div>
                        <div className="input">
                            <input type="text" placeholder="Judul Projek" className="flex-1 p-2  rounded outline-none" style={{backgroundColor: "#EAEAEA",fontSize: '1.3vh', fontFamily:'Poppins', width:'28rem' }}></input>
                        </div>
                    </div>
                        {/* Deskripsi Projek */}
                    <div className="input-container" style={{margin:'0.5vh 0vw'}}>
                        <div className="label" style ={{fontSize: '1.1vh', fontFamily:'Poppins', margin:'0.3vh 0.3vw'}}>
                            Deskripsi Projek
                        </div>
                        <div className="input">
                            <input type="text" placeholder="Deskripsi singkat projek akan dipakai di tampilan utama kampanye" className="flex-1 p-2  rounded outline-none" style={{backgroundColor: "#EAEAEA",fontSize: '1.3vh', fontFamily:'Poppins', width:'28rem' }}></input>
                        </div>
                    </div>
                        {/* Informasi Projek */}
                    <div className="input-container" style={{margin:'0.5vh 0vw'}}>
                        <div className="label" style ={{fontSize: '1.1vh', fontFamily:'Poppins', margin:'0.3vh 0.3vw'}}>
                            Informasi Projek
                        </div>
                        <div className="input">
                            <textarea type="text" placeholder="Informasi untuk memperjelas intensi projek dan kampanye" className="flex-1 p-2  rounded outline-none" style={{backgroundColor: "#EAEAEA",fontSize: '1.3vh', fontFamily:'Poppins', width:'28rem' }}></textarea>
                        </div>
                    </div>
                        {/* Target */}
                    <div className="input-container" style={{margin:'0.5vh 0vw'}}>
                        <div className="label" style ={{fontSize: '1.1vh', fontFamily:'Poppins', margin:'0.3vh 0.3vw'}}>
                            Target
                        </div>
                        <div className="input">
                            <input type="text" placeholder="Jumlah target dalam ETH" className="flex-1 p-2  rounded outline-none" style={{backgroundColor: "#EAEAEA",fontSize: '1.3vh', fontFamily:'Poppins', width:'28rem' }}></input>
                        </div>
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
                                <div className="label" style ={{fontSize: '1.1vh', fontFamily:'Poppins', margin:'0.8vh 0.3vw', fontWeight:"bold"}}>
                                    Nama Badge
                                </div>
                                <div className="input">
                                    <input type="text" placeholder="Nama Badge" className="flex-1 p-2  rounded outline-none" style={{backgroundColor: "#EAEAEA",fontSize: '1.3vh', fontFamily:'Poppins', width:'28rem' }}></input>
                                </div>
                            </div>
                               {/* Deskripsi Badge */}
                            <div className="input-container" style={{margin:'2vh 0vw'}}>
                                <div className="label" style ={{fontSize: '1.1vh', fontFamily:'Poppins', margin:'0.8vh 0.3vw', fontWeight:"bold"}}>
                                    Deskripsi Badge
                                </div>
                                <div className="input">
                                    <input type="text" placeholder="Reward donatur untuk badge" className="flex-1 p-2  rounded outline-none" style={{backgroundColor: "#EAEAEA",fontSize: '1.3vh', fontFamily:'Poppins', width:'28rem' }}></input>
                                </div>
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
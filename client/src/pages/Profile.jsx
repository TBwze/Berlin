import React from "react";
import profilePicture from '../assets/profilePicture.png';

const Profile = () => {
    return (
        <div className="max-w-[1280px] mx-auto p-4 bg-white" style={{fontFamily:"poppins"}}>
            <h1 style={{fontSize:"2vh", margin:"1vh 0vw"}}>Pengaturan Profil</h1>
            <div className = "container" style={{flexDirection:"row", display:'flex', alignItems: 'center', justifyContent: "space-evenly"}}>
                <div className="profile-picture" style={{display:"flex",flexDirection:"column" ,alignItems:"center"}}>
                    <div className="picture">
                        <img src={profilePicture} alt=""/>
                    </div>
                    <a href="" style={{color:"#007AFF"}}>Ubah Foto Profil</a>
                </div>
                <div className ="Information" style={{flexDirection : "column", display:"flex",  fontSize:"1.6vh"}}>
                    <div className = "username" style={{margin:"1vh 0vw"}}>
                        <div className="label" style ={{margin:'1vh 0vw'}}>
                            <b>Username</b>
                        </div>
                        <p>JohnDoe</p>
                        <a href="" style={{color:"#007AFF"}}>Ubah Username</a>
                    </div>
                    <div className ="Nama" style={{display:"flex", flexDirection:"row", justifyContent:"space-around"}}>
                        <div className = "Nama Depan" style={{margin:"1vh 0vw", marginRight:"1.5vw"}}>
                            <div className="label" style ={{margin:'1vh 0vw'}}>
                                <b>Nama Depan</b>
                            </div>
                            <p>JohnDoe</p>
                            <a href="" style={{color:"#007AFF"}}>Ubah Nama Depan</a>
                        </div>
                        <div className = "Nama Belakang" style={{margin:"1vh 0vw", marginLeft:"1.5vw"}}>
                            <div className="label" style ={{margin:'1vh 0vw'}}>
                                <b>Nama Belakang</b>
                            </div>
                            <p>JohnDoe</p>
                            <a href="" style={{color:"#007AFF"}}>Ubah Nama Depan</a>
                        </div>
                    </div>
                    <div className = "Email" style={{margin:"1vh 0vw"}}>
                        <div className="label" style ={{margin:'1vh 0vw'}}>
                            <b>Email</b>
                        </div>
                        <p>JohnDoe</p>
                        <a href="" style={{color:"#007AFF"}}>Ubah Email</a>
                    </div>
                    <div className = "Tanggal Lahir" style={{margin:"1vh 0vw"}}>
                        <div className="label" style ={{margin:'1vh 0vw'}}>
                            <b>Tanggal Lahir</b>
                        </div>
                        <p>12/01/2003</p>
                        <a href="" style={{color:"#007AFF"}}>Ubah Tanggal Lahir</a>
                    </div>
                    <div className = "Jenis Kelamin" style={{margin:"1vh 0vw"}}>
                        <div className="label" style ={{margin:'1vh 0vw'}}>
                            <b>Jenis Kelamin</b>
                        </div>
                        <p>Laki-Laki</p>
                        <a href="" style={{color:"#007AFF"}}>Ubah Jenis Kelamin</a>
                    </div>
                    <div className = "Password" style={{margin:"1vh 0vw"}}>
                        <div className="label" style ={{margin:'1vh 0vw'}}>
                            <b>Password</b>
                        </div>
                        <p>JohnDoe</p>
                        <a href="" style={{color:"#007AFF"}}>Ubah Password</a>
                    </div>
                </div>
            </div>
        </div>
    )
}



export default Profile;
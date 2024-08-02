import React from "react";

const Register = () => {
    return (
        <div className="max-w-[1280px] mx-auto p-4 bg-white">
            <div className = "container" style={{flexDirection:"column", display:'flex', alignItems: 'center'}}>
                <div className = "Header" style={{fontFamily: "Poppins", fontWeight: "900"}}> 
                    <b><h3>Buat akun baru</h3></b>
                </div>
                {/* Nama depan */}
                <div className="input-container" style={{margin:'0.5vh 0vw'}}>
                    <div className="label" style ={{fontSize: '1.1vh', fontFamily:'Poppins', margin:'0.3vh 0.3vw'}}>
                        Nama depan
                    </div>
                    <div className="input">
                        <input type="text" placeholder="Masukan nama depan" className="flex-1 p-2  rounded outline-none" style={{backgroundColor: "#EAEAEA",fontSize: '1.3vh', fontFamily:'Poppins', width:'20rem' }}></input>
                    </div>
                </div>
                {/* Nama belakang */}
                <div className="input-container" style={{margin:'0.5vh 0vw'}}>
                    <div className="label" style ={{fontSize: '1.1vh', fontFamily:'Poppins', margin:'0.3vh 0.3vw'}}>
                        Nama belakang
                    </div>
                    <div className="input">
                        <input type="text" placeholder="Masukan nama belakang" className="flex-1 p-2  rounded outline-none" style={{backgroundColor: "#EAEAEA",fontSize: '1.3vh', fontFamily:'Poppins', width:'20rem' }}></input>
                    </div>
                </div>
                {/* Username */}
                <div className="input-container" style={{margin:'0.5vh 0vw'}}>
                    <div className="label" style ={{fontSize: '1.1vh', fontFamily:'Poppins', margin:'0.3vh 0.3vw'}}>
                        Username
                    </div>
                    <div className="input">
                        <input type="text" placeholder="Username" className="flex-1 p-2  rounded outline-none" style={{backgroundColor: "#EAEAEA",fontSize: '1.3vh', fontFamily:'Poppins', width:'20rem' }}></input>
                    </div>
                </div>
                {/* Email */}
                <div className="input-container" style={{margin:'0.5vh 0vw'}}>
                    <div className="label" style ={{fontSize: '1.1vh', fontFamily:'Poppins', margin:'0.3vh 0.3vw'}}>
                        Email
                    </div>
                    <div className="input">
                        <input type="Email" placeholder="Email" className="flex-1 p-2  rounded outline-none" style={{backgroundColor: "#EAEAEA", fontSize: '1.3vh', fontFamily:'Poppins', width:'20rem'}}></input>
                    </div>
                </div>
                {/* Password */}
                <div className="input-container" style={{margin:'0.5vh 0vw'}}>
                    <div className="label" style ={{fontSize: '1.1vh', fontFamily:'Poppins', margin:'0.3vh 0.3vw'}}>
                        Password
                    </div>
                    <div className="input">
                        <input type="password" placeholder="Password" className="flex-1 p-2  rounded outline-none" style={{backgroundColor: "#EAEAEA", fontSize: '1.3vh', fontFamily:'Poppins', width:'20rem'}}></input>
                    </div>
                </div>
                {/* Jenis Kelamin */}
                <div className="input-container" style={{margin:'0.5vh 0vw'}}>
                    <div className="label" style={{fontSize: '1.1vh', fontFamily:'Poppins', margin:'0.3vh 0.3vw'}}>
                        Jenis Kelamin
                    </div>
                    <div className="input" style={{width:"20rem", fontSize:'1.2vh', display: 'flex', alignItems: 'center'}}>
                        <label style={{marginRight: '1rem',marginLeft:'0.5rem' , display:'flex', alignItems:'center'}}>
                            <input type="radio" name="jenisKelamin" value="Laki-laki" style={{transform: 'scale(0.8)'}}/> Laki-laki
                        </label>
                        <label style={{display:'flex', alignItems:'center'}}>
                            <input type="radio" name="jenisKelamin" value="Perempuan" style={{transform: 'scale(0.8)'}}/> Perempuan
                        </label>
                    </div>
                </div>
                {/* Tanggal Lahir */}
                <div className="input-container" style={{margin:'0.5vh 0vw'}}>
                    <div className="label" style={{fontSize: '1.1vh', fontFamily:'Poppins', margin:'0.3vh 0.3vw'}}>
                        Tanggal Lahir
                    </div>
                    <div className="input" style={{width:"20rem", fontSize:'1.2vh', display: 'flex', alignItems: 'center'}}>
                        <div className="input" style={{width:"20rem", fontSize:'1.3vh'}}>
                            <input type="date" className="flex-1 p-2  rounded outline-none" style={{backgroundColor: "#EAEAEA",fontSize: '1.3vh', fontFamily:'Poppins', width:'20rem' }} />
                        </div>
                    </div>
                </div>
                <div className="button" style={{margin:'1vh 0vw'}}>
                    <button type="button" className="flex-1 p-2 rounded" style={{backgroundColor:'#007AFF', color:'white', fontSize: '1.3vh', fontFamily:'Poppins', width:'20rem', padding:'1vh 0', fontWeight:'bold'}}>Berikutnya</button>
                </div>
                <div className="Login" style={{fontSize:'1.2vh', fontFamily:'Poppins', margin:'1vh 0'}}>
                    Sudah punya akun? <a href="/Login" style={{color:"#007AFF"}}>Login sekarang</a>
                </div>
            </div>
        </div>
    )
}

export default Register;
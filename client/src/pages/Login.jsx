import React from "react";

const Login = () => {
    return (
        <div className="max-w-[1280px] mx-auto p-4 bg-white">
            <div className = "container" style={{flexDirection:"column", display:'flex', alignItems: 'center'}}>
                <div className = "Header" style={{fontFamily: "Poppins"}}> 
                    <b><h3>Selamat Datang</h3></b>
                </div>
                <div className="input-container" style={{margin:'1vh 0vw'}}>
                    <div className="label" style ={{fontSize: '1.3vh', fontFamily:'Poppins', margin:'0.3vh 0.3vw'}}>
                        Email
                    </div>
                    <div className="input">
                        <input type="email" placeholder="Email" className="flex-1 p-2  rounded outline-none" style={{backgroundColor: "#EAEAEA",fontSize: '1.5vh', fontFamily:'Poppins', width:'20rem' }}></input>
                    </div>
                </div>
                <div className="input-container" style={{margin:'1vh 0vw'}}>
                    <div className="label" style ={{fontSize: '1.3vh', fontFamily:'Poppins', margin:'0.3vh 0.3vw'}}>
                        Password
                    </div>
                    <div className="input">
                        <input type="password" placeholder="Password" className="flex-1 p-2  rounded outline-none" style={{backgroundColor: "#EAEAEA", fontSize: '1.5vh', fontFamily:'Poppins', width:'20rem'}}></input>
                    </div>
                </div>
                <div className="button" style={{margin:'1vh 0vw'}}>
                    <button type="button" className="flex-1 p-2 rounded" style={{backgroundColor:'#007AFF', color:'white', fontSize: '1.3vh', fontFamily:'Poppins', width:'20rem', padding:'1vh 0'}}>Login</button>
                </div>
                <div className="signup" style={{fontSize:'1.2vh', fontFamily:'Poppins', margin:'1vh 0'}}>
                    Don't have an account? <a href="/Register" style={{color:"#007AFF"}}>Sign up now</a>
                </div>
            </div>
        </div>
    )
}



export default Login;
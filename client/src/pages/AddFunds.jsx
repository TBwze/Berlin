import React from "react";

const AddFunds = () => {
    return (
        <div className="max-w-[1280px] mx-auto p-4 bg-white">
            <div className = "container" style={{flexDirection:"column", display:'flex', alignItems: 'center'}}>
                <div className = "Header" style={{fontFamily: "Poppins"}}> 
                    <b><h3>Hubungkan Dompet Anda</h3></b>
                </div>
                {/* Hubungkan Dompet */}
                <div className="button" style={{margin:'0.5vh 0vw'}}>
                    <button
                        type="button"
                        className="flex-1 p-2 rounded"
                        style={{
                            backgroundColor: '#EAEAEA',
                            color: 'black',
                            fontSize: '1.3vh',
                            fontFamily: 'Poppins',
                            width: '20rem',
                            padding: '1vh 0',
                            fontWeight: 'bold',
                            transition: 'background-color 0.2s ease-in-out', // Transition for smooth effect
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#CDCDCD')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#EAEAEA')}
                        >
                        Hubungkan Dompet
                    </button>
                </div>
                {/* Alamat ETH */}
                <div className="input-container" style={{margin:'0.5vh 0vw'}}>
                    <div className="input">
                        <input type="text" placeholder="Alamat ETH" className="flex-1 p-2  rounded outline-none" style={{backgroundColor: "#EAEAEA",fontSize: '1.5vh', fontFamily:'Poppins', width:'20rem' }}></input>
                    </div>
                </div>
                {/* Jumlah ETH */}
                <div className="input-container" style={{margin:'0.5vh 0vw'}}>
                    <div className="input">
                        <input type="text" placeholder="Jumlah dalam ETH" className="flex-1 p-2  rounded outline-none" style={{backgroundColor: "#EAEAEA", fontSize: '1.5vh', fontFamily:'Poppins', width:'20rem'}}></input>
                    </div>
                </div>
                {/* Kirim Transaksi */}
                <div className="button" style={{margin:'0.5vh 0vw'}}>
                    <button
                        type="button"
                        className="flex-1 p-2 rounded"
                        style={{
                            backgroundColor: '#EAEAEA',
                            color: 'black',
                            fontSize: '1.3vh',
                            fontFamily: 'Poppins',
                            width: '20rem',
                            padding: '1vh 0',
                            fontWeight: 'bold',
                            transition: 'background-color 0.2s ease-in-out', // Transition for smooth effect
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#CDCDCD')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#EAEAEA')}
                        >
                        Kirim Transaksi
                    </button>
                </div>
                {/* Add Fund */}
                <div className="button" style={{marginTop:'2vh'}}>
                    <button type="button" className="flex-1 p-2 rounded" style={{backgroundColor:'#007AFF', color:'white', fontSize: '1.3vh', fontFamily:'Poppins', width:'20rem', padding:'1vh 0'}}>Add Funds</button>
                </div>
                <div className="Login" style={{fontSize:'1.2vh', fontFamily:'Poppins', margin:'1vh 0'}}>
                    Sudah punya akun? <a href="/Login" style={{color:"#007AFF"}}>Login sekarang</a>
                </div>
            </div>
        </div>
    )
}

export default AddFunds;
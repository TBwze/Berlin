import React, {useState, useRef} from 'react'
import { motion } from 'framer-motion'
import { FaPhoneSquareAlt } from "react-icons/fa"
import { MdEmail } from "react-icons/md"
import { FaLocationDot } from "react-icons/fa6"
import { FaPhone } from 'react-icons/fa6'
import AlertComponent from '../components/Alert.component'
import PopupComponent from '../components/PopUp.component'


const ContactUs = () => {
    const [result, setResult] = useState("");
    const [alert, setAlert] = useState({ type: "", message: "", visible: false });
    const [popupVisible, setPopupVisible] = useState(false);

    const sendEmail = async (event) => {
        event.preventDefault();
        setResult("Sending....");
        const formData = new FormData(event.target);

        formData.append("access_key", "2f0eafbc-ba78-425b-9dfc-9fbddc027523");

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            setResult("Success");
            event.target.reset();
            setPopupVisible(true);

        } else {
            console.log("Error", data);
            setResult(data.message);
            setAlert({
                type: "error",
                message: data.message,
                visible: true
            })

        }
    };
    const closePopup = () => {
        setPopupVisible(false);
    };
    
    return (
        <div className='flex justify-center'>
            {/* {result === "Success" && (
                <motion.div
                    initial = {{opacity : 1}}
                    animate = {{opacity : 0}}
                    transition={{ duration : 1, ease: 'easeOut', delay: 1}} 
                    role="alert" 
                    className="alert alert-success fixed top-0 left-0 w-full flex justify-center items-center z-50 rounded-none"

                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span className="text-white font-semibold">Message Berhasil Dikirim</span>
                </motion.div >
            )} */}

            <div className='flex flex-col items-center'>
                <AlertComponent
                    type={alert.type}
                    message={alert.message}
                    visible={alert.visible}
                    onClose={() => setAlert({ ...alert, visible: false })}
                />

                <PopupComponent message="Message Sent Successfully" visible={popupVisible} onClose={closePopup} />
                <div className='flex flex-col items-center py-10 px-20 rounded-lg bg-base-200'>
                    <h1 className='font-bold text-3xl mb-10'>Get In Touch</h1>
                    <div className='flex flex-row gap-4'>
                        <motion.div
                            whileHover={{
                                scale: 1,
                                border: "2px solid #334155"
                            }}
                            transition={{
                                duration:0.9
                            }}
                            style={{
                                border: "2px solid transparent",
                                borderRadius : "8px",
                            }}
                        >
                            <div className="card bg-base-100 w-[20vw] h-[30vh] shadow-xl">
                                <div className="card-body flex items-center justify-center">
                                    <div className='flex flex-col items-center gap-4 justify-center'>
                                        <FaPhoneSquareAlt className='w-20 h-20'/>
                                        <h2 className="card-title font-bold text-2xl">Phone Number</h2>
                                        <p>+6281212605579</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            whileHover={{
                                scale: 1,
                                border: "2px solid #334155"
                            }}
                            transition={{
                                duration:0.9
                            }}
                            style={{
                                border: "2px solid transparent",
                                borderRadius : "8px",
                            }}
                        >
                            <div className="card bg-base-100 w-[20vw] h-[30vh] shadow-xl">
                                <div className="card-body flex items-center justify-center">
                                    <div className='flex flex-col items-center gap-4 justify-center'>
                                        <MdEmail className='w-20 h-20'/>
                                        <h2 className="card-title font-bold text-2xl">Email</h2>
                                        <p>email.skripsi.crowdfund@gmail.com </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{
                                scale: 1,
                                border: "2px solid #334155"
                            }}
                            transition={{
                                duration:0.5
                            }}
                            style={{
                                border: "2px solid transparent",
                                borderRadius : "8px",
                            }}
                        >
                            <div className="card bg-base-100 w-[20vw] h-[30vh] shadow-xl">
                                <div className="card-body flex items-center justify-center">
                                    <div className='flex flex-col items-center gap-4 justify-center'>
                                        <FaLocationDot className='w-20 h-20'/>
                                        <h2 className="card-title font-bold text-2xl">Address</h2>
                                        <p>Jalan Tanjung Duren Utara IX no.664</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
                <div className='flex flex-row justify-around w-full py-10 rounded-lg bg-base-200 mt-10'>
                    <div className='flex flex-col'>
                        <h1 className='font-bold text-4xl'>Contact Us</h1>
                        <p className='text-balance w-[30vw] mb-4 mt-4'>
                            Ada pertanyaan, masukan, atau butuh bantuan? Kami siap membantu! Apakah 
                            Anda seorang pembuat kampanye atau pendukung, jangan ragu untuk menghubungi kami. 
                        </p>
                        <p className='text-balance w-[30vw]'>
                            Tim kami berdedikasi untuk memastikan pengalaman crowdfunding Anda lancar 
                            dan sukses.    
                        </p>
                    </div>
                    <form className='flex flex-col gap-4' onSubmit={sendEmail}>

                            <label className="input input-bordered flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="h-4 w-4 opacity-70 mr-2">
                                    <path
                                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                                </svg>
                                <input type="text" className="grow w-[20vw]" placeholder="Full Name" name = "name" required/>
                            </label>

                            <label className="input input-bordered flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="h-4 w-4 opacity-70 mr-2">
                                    <path
                                    d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                                    <path
                                    d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                                </svg>
                                <input type="text" className="grow w-[20vw]" placeholder="Email Address" name='email' required/>
                            </label>

                            <label className="input input-bordered flex items-center gap-2">
                                <FaPhone className='h-4 w-4 opacity-70 mr-2'/>
                                <input type="text" className="grow w-[20vw]" placeholder="Phone Number" required />
                            </label>
                            <textarea className="textarea textarea-bordered min-h-28 max-h-60" placeholder="Your Message" name='message' required />
                            <button 
                                className="btn btn-outline btn-success w-[30vw] my-10 font-bold text-sm"
                            >
                                {result == 'Sending....' ? <span className="loading loading-spinner"></span>: 'Send'}
                            </button>
                            
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ContactUs
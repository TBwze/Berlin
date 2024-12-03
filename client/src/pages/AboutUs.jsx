import React from "react";
import { useNavigate } from "react-router-dom";
import WhoWeAre from "../assets/Who-we-are.png"
import OurMission from "../assets/Our-Mission.png"
import OurVision from "../assets/Our-Vision.png"
import CustomButton from "../components/CustomButton.component";

const AboutUs = () =>{
    const navigate = useNavigate();

    return(
        <div className="flex flex-col items-center justify-center">
            <h1 className="font-bold text-4xl mb-10 mt-10">About Us</h1>
            <div className="flex flex-col gap-10">
                <div className="flex flex-row items-center justify-around w-[50vw]">
                    <div className="flex flex-col">
                        <h2 className="font-bold text-2xl mb-5">Who We Are?</h2>
                        <p className="text-wrap  w-[30vw] text-left">
                            Selamat datang di SharedFuture, platform di mana mimpi bertemu dengan peluang. 
                            Kami adalah situs web crowdfunding yang didedikasikan untuk menghubungkan para visioner 
                            dengan para pendukung yang percaya pada ide-ide mereka, baik Anda sedang memulai bisnis 
                            mendanai proyek kreatif, atau mendukung tujuan sosial, SharedFuture ada di sini 
                            untuk membuat perjalanan Anda menjadi mungkin.
                        </p>
                    </div>
                    <img 
                        src={WhoWeAre}
                        className="w-48 h-48" 
                    />
                </div>

                <div className="flex flex-row items-center justify-around w-[50vw]">
                    <img 
                            src={OurMission}
                            className="w-48 h-48" 
                        />
                    <div className="flex flex-col">
                        <h2 className="font-bold text-2xl mb-5 text-right">Our Mission</h2>
                        <p className="text-wrap w-[30vw] text-right">
                            Misi kami adalah memberdayakan individu dan organisasi dengan 
                            menyediakan platform tanpa batas untuk berbagi cerita mereka, mencapai 
                            mencapai tujuan mereka, dan membuat dampak yang berkelanjutan. Kami percaya pada kekuatan 
                            komunitas yang bersatu untuk mengubah aspirasi menjadi kenyataan.
                        </p>
                    </div>
                </div>

                <div className="flex flex-row items-center justify-around w-[50vw]">
                    <div className="flex flex-col">
                        <h2 className="font-bold text-2xl mb-5">Our Vision</h2>
                        <p className="text-wrap w-[30vw] text-left">
                            Menjadi platform urun dana yang paling tepercaya dan inklusif di dunia,
                            yang memungkinkan semua orang di mana pun untuk mencapai impian mereka 
                            dan menciptakan masa depan yang lebih cerah.
                        </p>
                    </div>
                    <img 
                        src={OurVision}
                        className="w-48 h-48" 
                    />
                </div>
            </div>
            <CustomButton 
                title="See Projects"
                className="btn btn-outline btn-success w-[30vw] my-10 font-bold text-sm"
                handleClick={() => navigate("/")}
            />
        </div>
    );
};

export default AboutUs;
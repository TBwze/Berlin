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
                            Welcome to SharedFuture, the platform where dreams meet opportunity. 
                            We are a crowdfunding website dedicated to connecting visionaries 
                            with supporters who believe in their ideas.Whether you’re starting a business, 
                            funding a creative project,or supporting a social cause, SharedFuture is here 
                            to make your journey possible.
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
                            Our mission is to empower individuals and organizations by 
                            providing a seamless platform to share their stories, reach 
                            their goals, and make a lasting impact. We believe in the power 
                            of communities coming together to turn aspirations into reality.
                        </p>
                    </div>
                </div>

                <div className="flex flex-row items-center justify-around w-[50vw]">
                    <div className="flex flex-col">
                        <h2 className="font-bold text-2xl mb-5">Our Vision</h2>
                        <p className="text-wrap w-[30vw] text-left">
                            To be the world’s most trusted and inclusive crowdfunding platform,
                            enabling people everywhere to achieve their dreams and create a brighter future.
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
import Unauthorize from "../assets/Unauthorize.png"
import { useNavigate } from "react-router-dom";
import CustomButton from '../components/CustomButton.component';

const NotAuthorizePage = () => {
    const navigate = useNavigate();

    return (
      <div className="flex flex-row items-center justify-center mx-auto max-w-[1280px] p-4">
        <img src={Unauthorize} alt="Unauthorize Logo" className="w-1/3"/>
        <div className="flex flex-col">
          <h1 className="text-3xl">Maaf!</h1>
          <h2 className="text-xl">Anda tidak berwenang untuk mengakses halaman ini!</h2>
          <div className="flex justify-start mt-3">
            <CustomButton
            btnType="button"
            title="Back Home"
            bgColor="#4169E1"
            styles="font-semibold rounded px-4 border-2"
            textColor="#ffffff"
            handleClick={() => navigate("/")}
          />
          </div>
        </div>
      </div>
    );
  };
  
  export default NotAuthorizePage;

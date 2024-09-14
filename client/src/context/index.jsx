import React, { useContext, createContext, Children, useState } from "react";
import {
  useAddress,
  useContract,
  useConnect,
  useContractWrite,
} from "@thirdweb-dev/react";
import ethers from "ethers";
// import { getUserDetails } from "../api/User/getUserDetails.api";
import axios from "axios";

const stateContext = createContext();

export const StateContextProvider = ({ children }) => {
  // const { contract } = useContract(
  //   "0x4eA9C780e9F3e25f62122D56B53DccC5186E01f3"
  // );
  // const { mutateAsync = createCampaign } = useContractWrite(
  //   contract,
  //   "createCampaign"
  // );

  const address = useAddress();
  const connect = useConnect();

  // const[id, setId] = useState(null);

  const publishCampaign = async (form) => {
    // getUserDetails().then((Response) => {
    //   setId(Response._id);
    // })

    if(!address) {
      console.log("Wallet not connected!")
      return;
    }

    try {
      const response = await axios.post("/campaign/create", {
        address,
        title: form.title,
        description: form.description,
        information: form.information,
        target: form.target,
        deadline: new Date(form.deadline).getTime(),
        image: form.image,
      });

      // const data = await createCampaign([
      //   address,
      //   form.title,
      //   form.description,
      //   form.target,
      //   new Date(form.deadline).getTime(),
      //   form.image,
      // ]);
      console.log("Contract call success!", data);
    } catch (error) {
      console.log("Contract call failed!", error);
    }
  };

  return (
    <stateContext.Provider
      value={{
        address,
        contract,
        createCampaign: publishCampaign,
      }}
    >
      {children}
    </stateContext.Provider>
  );
};

export const useStateContext = () => useContext(stateContext);

import {
  createCampaign,
  dashboard,
  logout,
  payment,
  profile,
  withdraw,
} from "../assets";

export const navlinks = [
  {
    name: "dashboard",
    imgUrl: dashboard,
    link: "/",
  },
  {
    name: "campaign",
    imgUrl: createCampaign,
    link: "/campaign",
  },
  // {
  //   name: "createCampaign",
  //   imgUrl: createCampaign,
  //   link: "/create-campaign",
  // },
  {
    name: "login",
   imgUrl: profile,
   link: "/login",
  },
  {
    name: "register",
    imgUrl: profile,
    link: "/register",
  },
  {
    name: "AddFunds",
    imgUrl: profile,
    link: "/AddFunds",
  },
  // {
  //   name: "campaign",
  //   imgUrl: createCampaign,
  //   link: "/create-campaign",
  // },
  // {
  //   name: "payment",
  //   imgUrl: payment,
  //   link: "/",
  //   disabled: true,
  // },
  // {
  //   name: "withdraw",
  //   imgUrl: withdraw,
  //   link: "/",
  //   disabled: true,
  // },
  // {
  //   name: "profile",
  //   imgUrl: profile,
  //   link: "/profile",
  // },
  // {
  //   name: "logout",
  //   imgUrl: logout,
  //   link: "/",
  //   disabled: true,
  // },
];

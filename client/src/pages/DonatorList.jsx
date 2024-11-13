import React from "react";
import DataGridComponent from "../components/DataGrid.component";
import { useStateContext } from "../context";
import { getAccountByWallet } from "../api/User/getUserByWallet.api";

const CampaignDonatorsGrid = ({ campaignId }) => {
  const [gridData, setGridData] = React.useState({
    rows: [],
    page: 0,
    limit: 10,
    totalPages: 0,
    totalRows: 0
  });
  const { getCampaignDonators } = useStateContext();

  const columns = [
    {
      field: "tier",
      headerName: "Tier",
      className: "font-semibold"
    },
    {
      field: "username",
      headerName: "Username",
      className: "font-semibold"
    },
    {
      field: "email",
      headerName: "Email",
      className: "font-semibold"
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      className: "font-semibold"
    },
    {
      field: "amount",
      headerName: "Amount (ETH)",
      className: "text-right"
    }
  ];

  const getUserInfo = async (wallet) => {
    try {
      const response = await getAccountByWallet(wallet);
      return response.data;
    } catch (error) {
      console.error("Error fetching user info:", error);
      return { email: "", username: "", phoneNumber: "" };
    }
  };

  const fetchDonators = async (page, limit) => {
    try {
      const response = await getCampaignDonators(campaignId, page, limit);

      const flatRows = (
        await Promise.all(
          response.data.map(async (tierGroup) =>
            Promise.all(
              tierGroup.addresses.map(async (address, index) => {
                const userInfo = await getUserInfo(address);
                return {
                  tier: tierGroup.tier || "N/A",
                  username: userInfo.username || "Anonymous",
                  email: userInfo.email || "N/A",
                  phoneNumber: userInfo.phoneNumber || null,
                  amount: `${Number(tierGroup.amounts[index] || 0).toFixed(4)} ETH`
                };
              })
            )
          )
        )
      ).flat();

      setGridData({
        rows: flatRows,
        page: response.page || 0,
        limit: response.limit || 10,
        totalPages: response.total_pages || 1,
        totalRows: response.total_rows || 0
      });
    } catch (error) {
      console.error("Error fetching donators:", error);
    }
  };

  const handleChangePage = (newPage) => {
    setGridData((prevData) => ({
      ...prevData,
      page: newPage
    }));
    fetchDonators(newPage, gridData.limit);
  };

  const handleChangeLimit = (newLimit) => {
    setGridData((prevData) => ({
      ...prevData,
      limit: newLimit
    }));
    fetchDonators(0, newLimit);
  };

  React.useEffect(() => {
    fetchDonators(0, 10);
  }, [campaignId]);

  return (
    <DataGridComponent
      columns={columns}
      rows={gridData.rows}
      page={gridData.page}
      limit={gridData.limit}
      totalPages={gridData.totalPages}
      handleChangePage={handleChangePage}
      handleChangeLimit={handleChangeLimit}
    />
  );
};

export default CampaignDonatorsGrid;

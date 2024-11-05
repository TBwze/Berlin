import { getAllUsers } from "../../api/User/getAllUser.api";
import React, { useEffect, useState } from "react";
import PageLoad from "../../components/Loading.component";
import DataGridComponent from "../../components/DataGrid.component";
import { deleteUser } from "../../api/User/deleteUser.api";
import { FaTrashCan } from "react-icons/fa6";
import SearchBarComponent from "../../components/SearchBar.component";
import { useForm } from "react-hook-form";
import { useStateContext } from "../../context";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { deleteUserCampaign } = useStateContext();
  const form = useForm({
    defaultValues: {
      page: 0,
      limit: 10,
      total_pages: 0,
      total_rows: 0
    }
  });

  useEffect(() => {
    refreshGrid(form.watch("page"), form.watch("limit"));
  }, []);

  const refreshGrid = async (page = 0, limit = 10, username = "") => {
    setIsLoading(true);
    try {
      const response = await getAllUsers(page, limit, username);
      setUsers(response.data);
      form.setValue("total_pages", response.total_pages);
      form.setValue("total_rows", response.total_rows);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    setIsLoading(true);
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        deleteCampaign(userId)
        refreshGrid(form.watch("page"), form.watch("limit"));
      } catch (error) {
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const deleteCampaign = async (userId) => {
    setIsLoading(true);
    try {
      await deleteUserCampaign(userId);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    refreshGrid(form.watch("page"), form.watch("limit"), searchTerm);
  };

  const columns = [
    { headerName: "Profile Picture", field: "profilePicture" },
    { headerName: "Username", field: "username" },
    { headerName: "Email", field: "email" },
    { headerName: "Actions", field: "actions" }
  ];

  const rows = users.map((user) => ({
    username: user.username,
    profilePicture: (
      <img src={user.profilePicture} alt="Profile" className="h-10 w-10 rounded-full" />
    ),
    email: user.email,
    actions: (
      <button
        onClick={() => handleDelete(user._id)}
        className="text-red-600 rounded-lg p-1 flex items-center justify-center">
        <FaTrashCan className="w-5 h-5" />
      </button>
    )
  }));

  const handleChangePageGrid = async (page) => {
    await refreshGrid(page, form.watch("limit"));
  };

  const handleChangeLimitGrid = async (limit) => {
    await refreshGrid(form.watch("page"), limit);
  };

  return (
    <div className="flex flex-col justify-center mx-auto max-w-[1280px] p-4">
      <PageLoad loading={isLoading} />
      <div className="mb-4">
        <SearchBarComponent onSearch={handleSearch} placeholder="Search by username..." />
      </div>
      <DataGridComponent
        columns={columns}
        rows={rows}
        page={form.watch("page")}
        limit={form.watch("limit")}
        totalPages={form.watch("total_pages")}
        totalRows={form.watch("total_rows")}
        handleChangePage={handleChangePageGrid}
        handleChangeLimit={handleChangeLimitGrid}
      />
    </div>
  );
};

export default Admin;

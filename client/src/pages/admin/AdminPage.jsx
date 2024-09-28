import { getAllUsers } from "../../api/User/getAllUser.api";
import React, { useEffect, useState } from "react";
import PageLoad from "../../components/Loading.component";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    refreshGrid();
  }, []);

  const refreshGrid = async () => {
    setIsLoading(true);
    getAllUsers()
      .then((response) => {
        setUsers(response);
      })
      .catch((error) => {
        alert(error.message);
      });
    setIsLoading(false);
  };

  const handleDelete = async (userId) => {
    setIsLoading(true);
    deleteUser(userId)
      .then(() => {
        refreshGrid();
      })
      .catch((error) => {
        alert(error.message);
      });

    setIsLoading(false);
  };

  return (
    <div>
      <PageLoad loading={isLoading} />
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="text-left py-2 px-4 border">Username</th>
            <th className="text-left py-2 px-4 border">Profile Picture</th>
            <th className="text-left py-2 px-4 border">Email</th>
            <th className="text-left py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="py-2 px-4 border">{user.username}</td>
              <td className="py-2 px-4 border">
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="h-10 w-10 rounded-full"
                />
              </td>
              <td className="py-2 px-4 border">{user.email}</td>
              <td className="py-2 px-4 border">
                <button
                  onClick={() => handleDelete(user._id)}
                  className="text-red-600 border-2 border-red-500 rounded-lg p-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;

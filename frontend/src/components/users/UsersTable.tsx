import { useState } from "react";
import { AlertTriangle, Loader, X } from "react-feather";
import { useForm } from "react-hook-form";
import UpdateUserRequest from "../../models/UpdateUserRequest";
import User from "../../models/User";
import userService from "../../services/UserService";
import Modal from "../shared/Modal";

interface UsersTableProps {
  data: User[];
  isLoading: boolean;
}

export default function UsersTable({ data, isLoading }: UsersTableProps) {
  const [deleteShow, setDeleteShow] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [error, setError] = useState<string>();
  const [updateShow, setUpdateShow] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<UpdateUserRequest>();

  const handleDeleteUser = async () => {
    try {
      setIsDeleting(true);
      await userService.delete(selectedUser.id);
      setIsDeleting(false);
      setDeleteShow(false);
      setSelectedUser(null);
      setError(null);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleUpdateUser = async (updateUserRequest: UpdateUserRequest) => {
    try {
      await userService.update(selectedUser.id, updateUserRequest);
      setUpdateShow(false);
      setSelectedUser(null);
      setError(null);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Username
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Role
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {isLoading
            ? null
            : data.map((user) => {
                const {
                  id,
                  firstName,
                  lastName,
                  username,
                  isActive,
                  role,
                } = user;
                return (
                  <tr key={id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{`${firstName} ${lastName}`}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {username}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {isActive ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {role}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-medium">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                        onClick={() => {
                          setSelectedUser(user);
                          setUpdateShow(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 ml-3 focus:outline-none"
                        onClick={() => {
                          setSelectedUser(user);
                          setDeleteShow(true);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
        </tbody>
      </table>
      <Modal show={deleteShow}>
        <AlertTriangle size={30} className="text-red-500 mr-5 fixed" />
        <div className="ml-10">
          <h3 className="mb-2 font-semibold">Delete User</h3>
          <hr />
          <p className="mt-2">
            Are you sure you want to delete the user? All of user's data will be
            permanently removed.
            <br />
            This action cannot be undone.
          </p>
        </div>
        <div className="flex flex-row gap-3 justify-end mt-5">
          <button
            className="btn"
            onClick={() => setDeleteShow(false)}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="btn danger"
            onClick={handleDeleteUser}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader className="mx-auto animate-spin" />
            ) : (
              "Delete"
            )}
          </button>
        </div>
        {error ? (
          <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
            {error}
          </div>
        ) : null}
      </Modal>

      {/* Update User Modal */}
      {selectedUser ? (
        <Modal show={updateShow}>
          <div className="flex">
            <h1 className="font-semibold mb-3">Update User</h1>
            <button
              className="ml-auto focus:outline-none"
              onClick={() => {
                reset();
                setUpdateShow(false);
              }}
            >
              <X size={30} />
            </button>
          </div>
          <hr />

          <form
            className="flex flex-col gap-5 mt-5"
            onSubmit={handleSubmit(handleUpdateUser)}
          >
            <div className="flex flex-col gap-5 sm:flex-row">
              <input
                type="text"
                className="input sm:w-1/2"
                placeholder="First Name"
                defaultValue={selectedUser.firstName}
                {...register("firstName")}
              />
              <input
                type="text"
                className="input sm:w-1/2"
                placeholder="Last Name"
                defaultValue={selectedUser.lastName}
                disabled={isSubmitting}
                {...register("lastName")}
              />
            </div>
            <input
              type="text"
              className="input"
              placeholder="Username"
              defaultValue={selectedUser.username}
              disabled={isSubmitting}
              {...register("username")}
            />
            <input
              type="password"
              className="input"
              placeholder="Password"
              disabled={isSubmitting}
              {...register("password")}
            />
            <select
              className="input"
              {...register("role")}
              disabled={isSubmitting}
              defaultValue={selectedUser.role}
            >
              <option value="user">User</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
            <div>
              <label className="font-semibold mr-3">Active</label>
              <input
                type="checkbox"
                className="input w-5 h-5"
                defaultChecked={selectedUser.isActive}
                {...register("isActive")}
              />
            </div>
            <button className="btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader className="animate-spin mx-auto" />
              ) : (
                "Save"
              )}
            </button>
            {error ? (
              <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
                {error}
              </div>
            ) : null}
          </form>
        </Modal>
      ) : null}
    </>
  );
}

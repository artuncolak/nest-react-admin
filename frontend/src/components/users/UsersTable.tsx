import { useState } from "react";
import { AlertTriangle, Loader } from "react-feather";
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
  const [selectedUserId, setSelectedUserId] = useState<string>();
  const [error, setError] = useState<string>();

  const handleDeleteUser = async () => {
    try {
      setIsDeleting(true);
      await userService.delete(selectedUserId);
      setIsDeleting(false);
      setDeleteShow(false);
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
            : data.map(
                ({ firstName, lastName, username, isActive, role, id }) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 focus:outline-none">
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 ml-3 focus:outline-none"
                        onClick={() => {
                          setSelectedUserId(id);
                          setDeleteShow(true);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
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
    </>
  );
}

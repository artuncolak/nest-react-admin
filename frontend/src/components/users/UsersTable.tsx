import { useState } from 'react';
import { AlertTriangle, Loader, X } from 'react-feather';
import { useForm } from 'react-hook-form';

import UpdateUserRequest from '../../models/user/UpdateUserRequest';
import User from '../../models/user/User';
import userService from '../../services/UserService';
import Modal from '../shared/Modal';
import Table from '../shared/Table';
import TableItem from '../shared/TableItem';

interface UsersTableProps {
  data: User[];
  isLoading: boolean;
}

export default function UsersTable({ data, isLoading }: UsersTableProps) {
  const [deleteShow, setDeleteShow] = useState<boolean>(false);
  const [updateShow, setUpdateShow] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string>();
  const [error, setError] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<UpdateUserRequest>();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await userService.delete(selectedUserId);
      setDeleteShow(false);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (updateUserRequest: UpdateUserRequest) => {
    try {
      await userService.update(selectedUserId, updateUserRequest);
      setUpdateShow(false);
      reset();
      setError(null);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <>
      <div className="table-container">
        <Table columns={['Name', 'Username', 'Status', 'Role', 'Created']}>
          {isLoading
            ? null
            : data.map(
                ({ id, firstName, lastName, role, isActive, username }) => (
                  <tr key={id}>
                    <TableItem>{`${firstName} ${lastName}`}</TableItem>
                    <TableItem>{username}</TableItem>
                    <TableItem>
                      {isActive ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </TableItem>
                    <TableItem>{role}</TableItem>
                    <TableItem className="text-right">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                        onClick={() => {
                          setSelectedUserId(id);

                          setValue('firstName', firstName);
                          setValue('lastName', lastName);
                          setValue('username', username);
                          setValue('role', role);
                          setValue('isActive', isActive);

                          setUpdateShow(true);
                        }}
                      >
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
                    </TableItem>
                  </tr>
                ),
              )}
        </Table>

        {!isLoading && data.length < 1 ? (
          <div className="text-center my-5 text-gray-500">
            <h1>Empty</h1>
          </div>
        ) : null}
      </div>
      {/* Delete User Modal */}
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
            onClick={() => {
              setError(null);
              setDeleteShow(false);
            }}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="btn danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader className="mx-auto animate-spin" />
            ) : (
              'Delete'
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
      <Modal show={updateShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Update User</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              setUpdateShow(false);
              setError(null);
              reset();
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(handleUpdate)}
        >
          <div className="flex flex-col gap-5 sm:flex-row">
            <input
              type="text"
              className="input sm:w-1/2"
              placeholder="First Name"
              {...register('firstName')}
            />
            <input
              type="text"
              className="input sm:w-1/2"
              placeholder="Last Name"
              disabled={isSubmitting}
              {...register('lastName')}
            />
          </div>
          <input
            type="text"
            className="input"
            placeholder="Username"
            disabled={isSubmitting}
            {...register('username')}
          />
          <input
            type="password"
            className="input"
            placeholder="Password"
            disabled={isSubmitting}
            {...register('password')}
          />
          <select
            className="input"
            {...register('role')}
            disabled={isSubmitting}
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
              {...register('isActive')}
            />
          </div>
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              'Save'
            )}
          </button>
          {error ? (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          ) : null}
        </form>
      </Modal>
    </>
  );
}

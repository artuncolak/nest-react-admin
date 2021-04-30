import { useQuery } from "react-query";
import userService from "../services/UserService";
import Layout from "../components/layout";
import UsersTable from "../components/users/UsersTable";
import { Loader, Plus, X } from "react-feather";
import Modal from "../components/shared/Modal";
import { useState } from "react";
import { useForm } from "react-hook-form";
import CreateUserRequest from "../models/user/CreateUserRequest";

export default function Users() {
  const { data, isLoading } = useQuery("users", userService.findAll, {
    refetchInterval: 1000,
  });
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateUserRequest>();

  const [addUserShow, setAddUserShow] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const saveUser = async (createUserRequest: CreateUserRequest) => {
    try {
      await userService.save(createUserRequest);
      setAddUserShow(false);
      reset();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5">Manage Users</h1>
      <hr />
      <button
        className="btn mt-5 flex gap-2 w-full sm:w-auto justify-center"
        onClick={() => setAddUserShow(true)}
      >
        <Plus /> Add User
      </button>

      <UsersTable data={data} isLoading={isLoading} />

      {/* Add User Modal */}
      <Modal show={addUserShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Add User</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setAddUserShow(false);
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(saveUser)}
        >
          <div className="flex flex-col gap-5 sm:flex-row">
            <input
              type="text"
              className="input sm:w-1/2"
              placeholder="First Name"
              disabled={isSubmitting}
              {...register("firstName")}
            />
            <input
              type="text"
              className="input sm:w-1/2"
              placeholder="Last Name"
              disabled={isSubmitting}
              {...register("lastName")}
            />
          </div>
          <input
            type="text"
            className="input"
            placeholder="Username"
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
          >
            <option value="user">User</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
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
    </Layout>
  );
}

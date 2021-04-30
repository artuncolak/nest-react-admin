import { useState } from "react";
import { AlertTriangle, Loader, X } from "react-feather";
import { useForm } from "react-hook-form";
import Course from "../../models/Course";
import UpdateCourseRequest from "../../models/UpdateCourseRequest";
import courseService from "../../services/CourseService";
import Modal from "../shared/Modal";

interface UsersTableProps {
  data: Course[];
  isLoading: boolean;
}

export default function CoursesTable({ data, isLoading }: UsersTableProps) {
  const [deleteShow, setDeleteShow] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course>();
  const [error, setError] = useState<string>();
  const [updateShow, setUpdateShow] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<UpdateCourseRequest>();

  const handleDeleteCourse = async () => {
    try {
      setIsDeleting(true);
      await courseService.delete(selectedCourse.id);
      setIsDeleting(false);
      setDeleteShow(false);
      setSelectedCourse(null);
      setError(null);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleUpdateUser = async (updateCourseRequest: UpdateCourseRequest) => {
    try {
      await courseService.update(selectedCourse.id, updateCourseRequest);
      setUpdateShow(false);
      setSelectedCourse(null);
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
              Description
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date Created
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {isLoading
            ? null
            : data.map((course) => {
                const { id, name, description, dateCreated } = course;
                return (
                  <tr key={id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {name}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {description}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {new Date(dateCreated).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-medium">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                        onClick={() => {
                          setSelectedCourse(course);
                          setUpdateShow(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 ml-3 focus:outline-none"
                        onClick={() => {
                          setSelectedCourse(course);
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
      {!isLoading && data.length < 1 ? (
        <div className="text-center my-5 text-gray-500">
          <h1>Empty</h1>
        </div>
      ) : null}

      {/* Delete Course Modal */}
      <Modal show={deleteShow}>
        <AlertTriangle size={30} className="text-red-500 mr-5 fixed" />
        <div className="ml-10">
          <h3 className="mb-2 font-semibold">Delete Course</h3>
          <hr />
          <p className="mt-2">
            Are you sure you want to delete the course? All of course's data
            will be permanently removed.
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
            onClick={handleDeleteCourse}
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

      {/* Update Course Modal */}
      {selectedCourse ? (
        <Modal show={updateShow}>
          <div className="flex">
            <h1 className="font-semibold mb-3">Update Course</h1>
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
            <input
              type="text"
              className="input"
              placeholder="Name"
              defaultValue={selectedCourse.name}
              {...register("name")}
            />
            <input
              type="text"
              className="input"
              placeholder="Description"
              defaultValue={selectedCourse.description}
              disabled={isSubmitting}
              {...register("description")}
            />
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

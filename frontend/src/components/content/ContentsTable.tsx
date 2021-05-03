import { useState } from 'react';
import { AlertTriangle, Loader, X } from 'react-feather';
import { useForm } from 'react-hook-form';

import useAuth from '../../hooks/useAuth';
import Content from '../../models/content/Content';
import UpdateContentRequest from '../../models/content/UpdateContentRequest';
import contentService from '../../services/ContentService';
import Modal from '../shared/Modal';
import Table from '../shared/Table';
import TableItem from '../shared/TableItem';

interface ContentsTableProps {
  data: Content[];
  courseId: string;
  isLoading: boolean;
}

export default function ContentsTable({
  data,
  isLoading,
  courseId,
}: ContentsTableProps) {
  const { authenticatedUser } = useAuth();
  const [deleteShow, setDeleteShow] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedContentId, setSelectedContentId] = useState<string>();
  const [error, setError] = useState<string>();
  const [updateShow, setUpdateShow] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<UpdateContentRequest>();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await contentService.delete(courseId, selectedContentId);
      setDeleteShow(false);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (updateContentRequest: UpdateContentRequest) => {
    try {
      await contentService.update(
        courseId,
        selectedContentId,
        updateContentRequest,
      );
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
        <Table columns={['Name', 'Description', 'Created']}>
          {isLoading
            ? null
            : data.map(({ id, name, description, dateCreated }) => (
                <tr key={id}>
                  <TableItem>{name}</TableItem>
                  <TableItem>{description}</TableItem>
                  <TableItem>
                    {new Date(dateCreated).toLocaleDateString()}
                  </TableItem>
                  <TableItem className="text-right">
                    {['admin', 'editor'].includes(authenticatedUser.role) ? (
                      <button
                        className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                        onClick={() => {
                          setSelectedContentId(id);

                          setValue('name', name);
                          setValue('description', description);

                          setUpdateShow(true);
                        }}
                      >
                        Edit
                      </button>
                    ) : null}
                    {authenticatedUser.role === 'admin' ? (
                      <button
                        className="text-red-600 hover:text-red-900 ml-3 focus:outline-none"
                        onClick={() => {
                          setSelectedContentId(id);
                          setDeleteShow(true);
                        }}
                      >
                        Delete
                      </button>
                    ) : null}
                  </TableItem>
                </tr>
              ))}
        </Table>
        {!isLoading && data.length < 1 ? (
          <div className="text-center my-5 text-gray-500">
            <h1>Empty</h1>
          </div>
        ) : null}
      </div>

      {/* Delete Content Modal */}
      <Modal show={deleteShow}>
        <AlertTriangle size={30} className="text-red-500 mr-5 fixed" />
        <div className="ml-10">
          <h3 className="mb-2 font-semibold">Delete Content</h3>
          <hr />
          <p className="mt-2">
            Are you sure you want to delete the content? All of content's data
            will be permanently removed.
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

      {/* Update Content Modal */}
      {selectedContentId ? (
        <Modal show={updateShow}>
          <div className="flex">
            <h1 className="font-semibold mb-3">Update Content</h1>
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
            <input
              type="text"
              className="input"
              placeholder="Name"
              required
              {...register('name')}
            />
            <input
              type="text"
              className="input"
              placeholder="Description"
              required
              disabled={isSubmitting}
              {...register('description')}
            />
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
      ) : null}
    </>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Table, Modal } from "flowbite-react";
import { LuTrash, LuBadgeCheck, LuBadgeX, LuInfo } from "react-icons/lu";
import Loader from "../components/Loader";

export default function Users() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [confirmModal, setConfirmModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/auth/user/get-users");
      if (response.status === 200) {
        toast.success("All users fetched successfully.");
        setUsers(response.data.users);
        setLoading(false);
        if (response.data.users.length < 10) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const response = await axios.get(`/api/auth/user/get-users?startIndex=${startIndex}`);
      if (response.status === 200) {
        setUsers((prev) => [...prev, ...response.data.users]);
        if (response.data.users.length < 10) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.messsage);
    }
  };

  const handleDelete = async () => {
    setConfirmModal(false);
    try {
      const response = await axios.delete(`/api/auth/user/delete/${userIdToDelete}`);
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.message);
        setUsers((users) => users.filter((user) => user._id !== userIdToDelete));
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    getUsers();
  }, [currentUser._id]);

  return (
    <div className="p-10 w-full">
      <div className="mx-auto w-full">
        <div className="flex justify-between mb-5">
          <h1 className="text-2xl md:text-4xl">Users</h1>
        </div>
        <div className="overflow-x-auto scrollbar scrollbar-track-slate-800 scrollbar-thumb-slate-500">
          {loading ? (
            <div className="bg-white p-5 flex justify-center">
              <Loader color="gray" className="mr-2" size="xl" />
            </div>
          ) : (
            <>
              <Table hoverable className="text-slate-800">
                <Table.Head>
                  <Table.HeadCell>Created Date</Table.HeadCell>
                  <Table.HeadCell>Avatar</Table.HeadCell>
                  <Table.HeadCell>Username</Table.HeadCell>
                  <Table.HeadCell>Email</Table.HeadCell>
                  <Table.HeadCell>Admin</Table.HeadCell>
                  <Table.HeadCell>Delete</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {users?.length > 0 ? (
                    users.map((user) => (
                      <Table.Row key={user._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell>{new Date(user.updatedAt).toLocaleDateString()}</Table.Cell>
                        <Table.Cell>
                          <img src={user.profileImage} alt={user.name} className="w-10" />
                        </Table.Cell>
                        <Table.Cell>{user.username}</Table.Cell>
                        <Table.Cell>{user.email}</Table.Cell>
                        <Table.Cell>
                          {user.isAdmin ? (
                            <LuBadgeCheck size="24" className="text-lime-600" />
                          ) : (
                            <LuBadgeX size="24" className="text-red-600" />
                          )}
                        </Table.Cell>
                        <Table.Cell className="flex gap-2">
                          <Button
                            onClick={() => {
                              setConfirmModal(true), setUserIdToDelete(user._id);
                            }}
                            size="xs"
                            gradientMonochrome="failure"
                            outline
                          >
                            <LuTrash size="16" />
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  ) : (
                    <Table.Row>
                      <Table.Cell>
                        <p>No users available</p>
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
              {showMore && (
                <Button
                  onClick={handleShowMore}
                  gradientMonochrome="failure"
                  outline
                  size="sm"
                  className="mt-5 mx-auto"
                >
                  Show more
                </Button>
              )}
            </>
          )}
        </div>
        <Modal show={confirmModal} onClose={() => setConfirmModal(false)} popup size="md">
          <Modal.Header />
          <Modal.Body className="text-center">
            <LuInfo size="50" color="gray" className="mx-auto" />
            <p className="text-2xl text-slate-500 mb-10 mt-5">Are you sure want to delete this user?</p>
            <div className="flex gap-5">
              <Button fullSized gradientDuoTone="pinkToOrange" onClick={handleDelete}>
                Delete
              </Button>
              <Button onClick={() => setConfirmModal(false)} fullSized outline gradientDuoTone="pinkToOrange">
                Cancel
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

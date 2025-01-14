import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, CreditCard, Calendar, ChevronUp, ChevronDown } from "lucide-react";
import useUserStore from "@/store/useUserStore";
import AddUser from "./AddUser";
import MeetingCard from "../reusable/UpcomingMeetingCard";
import EditUserDialog from "./EditUserDialog";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  role: z.string({
    required_error: "Please select a role.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const Dashboard = () => {
  const { setUsers, fetchUsers, users, deleteUser } = useUserStore((state) => state);
  const [isLoading, setIsLoading] = useState(false);
  const [newUsersThisMonth, setNewUsersThisMonth] = useState(0);
  const [newCustomeresThisMonth, setNewCustomersThisMonth] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [visibleUsers, setVisibleUsers] = useState(5); // Default to show 5 users at a time
  const [showMore, setShowMore] = useState(false); // Control show more/less state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const loadUsers = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (users.length > 0) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      // Calculate new users this month
      const newUsers = users.filter((user) => {
        const userDate = new Date(user.created_at);
        return (
          userDate.getMonth() === currentMonth &&
          userDate.getFullYear() === currentYear
        );
      });
      setNewUsersThisMonth(newUsers.length);

      // Calculate new customers this month
      const newCustomers = users.filter((user) => {
        const userDate = new Date(user.created_at);
        return (
          user.role === "customer" &&
          userDate.getMonth() === currentMonth &&
          userDate.getFullYear() === currentYear
        );
      });
      setNewCustomersThisMonth(newCustomers.length);

      // Total customers
      const customers = users.filter((user) => user.role === "customer");
      setTotalCustomers(customers.length);
    }
  }, [users]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleOpenConfirmDialog = (userId) => {
    setSelectedUser(userId);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteUser(selectedUser);
      setSuccessDialogOpen(true);
    } catch (error) {
      console.error("Failed to delete user:", error);
      setErrorDialogOpen(true);
    } finally {
      setIsDeleting(false);
      setConfirmDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
  };

  const handleCloseSuccessDialog = () => {
    setSuccessDialogOpen(false);
  };

  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  const sortedUsers = users
    .slice() // Create a shallow copy to avoid direct mutation
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort by created_at (desc)

  // Toggle show more/less
  const toggleShowMore = () => {
    if (showMore) {
      setVisibleUsers(5); // Show less, default to 5
    } else {
      setVisibleUsers(users.length); // Show all users
    }
    setShowMore(!showMore);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">User Management</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card onClick={() => navigate('view-user')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-2xl font-bold">Loading...</div>
            ) : (
              <>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {newUsersThisMonth > 0
                    ? `${newUsersThisMonth} new users this month`
                    : "No new users this month"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card onClick={() => navigate('view-user')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-2xl font-bold">Loading...</div>
            ) : (
              <>
                <div className="text-2xl font-bold">{totalCustomers}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {newCustomeresThisMonth > 0
                    ? `${newCustomeresThisMonth} new users this month`
                    : "No new users this month"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <MeetingCard />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mb-4">
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle> Add New User</DialogTitle>
              </DialogHeader>
              <AddUser onClose={handleCloseDialog} />
            </DialogContent>
          </Dialog>

          {/* Success Dialog */}
          <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
            <DialogContent>
              <p className="text-sm">User deleted successfully!</p>
              <Button onClick={handleCloseSuccessDialog} className="mt-4 w-full bg-green-600 text-white hover:bg-green-700">OK</Button>
            </DialogContent>
          </Dialog>

          {/* Error Dialog */}
          <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
            <DialogContent>
              <p className="text-sm">Failed to delete user. Please try again later.</p>
              <Button onClick={handleCloseErrorDialog} className="mt-4 w-full bg-red-600 text-white hover:bg-red-700">OK</Button>
            </DialogContent>
          </Dialog>

          {/* Confirmation Dialog */}
          <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
            <DialogContent>
              <p className="text-sm">Are you sure you want to delete this user?</p>
              <div className="flex justify-end space-x-4 mt-4">
                <Button variant="secondary" onClick={handleCancelDelete} className="w-32">Cancel</Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="w-32 bg-red-600 text-white hover:bg-red-700"
                >
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Username</TableHead>
                <TableHead className="text-left">Role</TableHead>
                <TableHead className="text-left">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(sortedUsers) && sortedUsers.length > 0 ? (
                sortedUsers.slice(0, visibleUsers).map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-100">
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleOpenConfirmDialog(user.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="3" className="text-center text-gray-500">No users found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex justify-center mt-4">
            <Button onClick={toggleShowMore} className="bg-transparent text-blue-600 hover:bg-transparent hover:text-blue-800 flex items-center space-x-2">
              {showMore ? (
                <>
                  <span>Show Less</span>
                  <ChevronUp className="h-4 w-4" /> {/* ChevronUp for "Show Less" */}
                </>
              ) : (
                <>
                  <span>Show More</span>
                  <ChevronDown className="h-4 w-4" /> {/* ChevronDown for "Show More" */}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      {selectedUser && (
        <EditUserDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          user={selectedUser}
          onUserUpdate={() => loadUsers()} // Refresh user list after update
        />
      )}
    </div>
  );
};

export default Dashboard;

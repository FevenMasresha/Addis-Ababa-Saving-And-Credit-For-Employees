"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Edit, Trash2 } from "lucide-react";
import EmployeeForm from "./EmployeeForm";
import useAuthStore from "@/store/authStore";
import { toast } from "react-toastify";
import useEmployeeStore from "@/store/useEmployeeStore";
import useCustomerStore from "@/store/useCustomerStore";

export default function EmployeeManagement() {
    const { customers, fetchCustomers, loading: customerLoading, error: customerError } = useCustomerStore();
    const { employees, fetchEmployees, deleteEmployee, loading: employeeLoading, error: employeeError } = useEmployeeStore();
    const { token } = useAuthStore();

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const successToast = (message) => toast.success(message);
    const errorToast = (message) => toast.error(message);

    // Filter state
    const [filters, setFilters] = useState({
        role: "all",
        search: "",
        department: "all",
        page: 1,
        perPage: 5,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const activeFilters = { ...filters };
                // Remove filters with empty or default values
                Object.keys(activeFilters).forEach((key) => {
                    if (!activeFilters[key] || activeFilters[key] === "all") {
                        delete activeFilters[key];
                    }
                });
                await fetchEmployees(activeFilters, token); // Pass token to fetchEmployees
            } catch (error) {
                errorToast("Failed to fetch employees. Please try again.");
            }
        };

        if (token) {
            fetchData();
        }
    }, [token, filters, fetchEmployees]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
            page: 1, // Reset to the first page when filters change
        }));
    };

    const handleSelectChange = (name, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
            page: 1, // Reset to the first page when filters change
        }));
    };

    const handlePageChange = (direction) => {
        setFilters((prev) => ({
            ...prev,
            page: prev.page + direction,
        }));
    };


    const handleAddEmployee = () => {
        setIsAddOpen(true);
    };

    const handleEditEmployee = (employee) => {
        setSelectedEmployee(employee);
        setIsAddOpen(true);
    };

    const handleDeleteEmployee = async (id) => {
        if (confirm("Are you sure you want to delete this employee?")) {
            await deleteEmployee(id, token);
            successToast("Employee deleted successfully!");
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Employee Management</CardTitle>
                <CardDescription>View and manage employee information</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleAddEmployee} className="mb-4">
                    Add New Employee
                </Button>
                <div className="space-y-4 mb-4">
                    <div className="flex space-x-4">
                        <Select
                            value={filters.role}
                            onValueChange={(value) =>
                                handleSelectChange("role", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Role</SelectItem>
                                <SelectItem value="accountant">Accountant</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={filters.department}
                            onValueChange={(value) =>
                                handleSelectChange("department", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Department</SelectItem>
                                <SelectItem value="Finance">Finance</SelectItem>
                                <SelectItem value="Loans">Loans</SelectItem>
                                <SelectItem value="Customer Service">Customer Service</SelectItem>
                                <SelectItem value="Management">Management</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            type="text"
                            name="search"
                            placeholder="Search keyword"
                            value={filters.search}
                            onChange={handleFilterChange}
                        />
                    </div>
                </div>
                {/* Employee Form Modal */}
                <EmployeeForm
                    isAddOpen={isAddOpen}
                    setIsAddOpen={setIsAddOpen}
                    selectedEmployee={selectedEmployee}
                    setSelectedEmployee={setSelectedEmployee}
                />

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employeeLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                            </TableRow>
                        ) : (
                            (employees && employees.length > 0 ? employees.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                                            {employee.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                                            {employee.email}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                                            {employee.phone}
                                        </div>
                                    </TableCell>
                                    <TableCell>{employee.department}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEditEmployee(employee)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteEmployee(employee.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">No employees found.</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                {/* Pagination Section */}
                <div className="flex justify-between mt-4">
                    <Button
                        onClick={() => handlePageChange(-1)}
                        disabled={filters.page === 1}
                        className="bg-transparent text-blue-600 hover:bg-transparent hover:text-blue-800"
                    >
                        Previous
                    </Button>
                    <Button
                        onClick={() => handlePageChange(1)}
                        disabled={employees.length < filters.perPage}
                        className="bg-transparent text-blue-600 hover:bg-transparent hover:text-blue-800"
                    >
                        Next
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
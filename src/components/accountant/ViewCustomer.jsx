import React, { useEffect, useState } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "../ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import useCustomerStore from "@/store/useCustomerStore";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import {
    Select,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectContent,
} from "@/components/ui/select";
import useAuthStore from "@/store/authStore";
import { toast } from "react-toastify";

const ViewCustomer = () => {
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const { customers, fetchCustomers, deleteCustomer, updateCustomer } =
        useCustomerStore();
    const { token } = useAuthStore();

    const successToast = (message) => toast.success(message);
    const errorToast = (message) => toast.error(message);

    // Filter state
    const [filters, setFilters] = useState({
        sex: "all",
        search: "",
        salary_min: "",
        salary_max: "",
        gov_bureau: "all",
        page: 1,
        perPage: 5,
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const activeFilters = { ...filters };
                // Remove filters with empty or default values
                Object.keys(activeFilters).forEach((key) => {
                    if (!activeFilters[key] || activeFilters[key] === "all") {
                        delete activeFilters[key];
                    }
                });
                await fetchCustomers(activeFilters);
            } catch (error) {
                errorToast("Failed to fetch customers. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchData();
        }
    }, [token, filters, fetchCustomers]);

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

    const handleDelete = async (customerId) => {
        setLoadingDelete(true);
        try {
            await deleteCustomer(customerId);
            successToast("Customer deleted successfully");
        } catch (error) {
            errorToast("Failed to delete customer. Please try again.");
        } finally {
            setLoadingDelete(false);
        }
    };

    const CustomerDetailsDialog = ({ customer }) => {
        const [localCustomer, setLocalCustomer] = useState({ ...customer });

        const handleSaveChanges = async () => {
            setLoadingEdit(true);
            try {
                await updateCustomer(customer.id, localCustomer);
                successToast("Customer details updated successfully");
                // Keep the dialog open by not closing here
            } catch (error) {
                if (error.response?.status === 422) {
                    const validationErrors = error.response.data.errors;
                    if (validationErrors) {
                        Object.keys(validationErrors).forEach((key) => {
                            errorToast(`${key}: ${validationErrors[key].join(", ")}`);
                        });
                    }
                } else if (error.response?.status === 404) {
                    errorToast("Customer not found");
                } else {
                    // Generic errors
                    errorToast(
                        error.response?.data?.message || "An unexpected error occurred."
                    );
                }
            } finally {
                setLoadingEdit(false);
            }
        };

        return (
            <Dialog open={!!editingCustomer} onOpenChange={() => setEditingCustomer(null)}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setEditingCustomer(customer)}>
                        View Details
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Customer Details</DialogTitle>
                        <DialogDescription>
                            View and edit customer information.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-10 py-4">
                        {/* Column 1 */}
                        <div className="space-y-4">
                            {["fname", "lname", "phone", "email", "account_no"].map(
                                (field) => (
                                    <div className="grid grid-cols-4 items-center gap-4" key={field}>
                                        <Label htmlFor={field} className="text-right capitalize">
                                            {field.replace("_", " ")}
                                        </Label>
                                        <Input
                                            id={field}
                                            type="text"
                                            value={localCustomer[field] || ""}
                                            onChange={(e) =>
                                                setLocalCustomer({
                                                    ...localCustomer,
                                                    [field]: e.target.value,
                                                })
                                            }
                                            className="col-span-3"
                                        />
                                    </div>
                                )
                            )}
                        </div>
                        {/* Column 2 */}
                        <div className="space-y-4">
                            {[
                                "age",
                                "sex",
                                "saving_balance",
                                "loan_balance",
                                "salary",
                                "gov_bureau",
                            ].map((field) => (
                                <div
                                    className="grid grid-cols-4 items-center gap-4"
                                    key={field}
                                >
                                    <Label htmlFor={field} className="text-right capitalize">
                                        {field.replace("_", " ")}
                                    </Label>
                                    <Input
                                        id={field}
                                        type={
                                            field === "age" ||
                                                field.includes("balance") ||
                                                field === "salary"
                                                ? "number"
                                                : "text"
                                        }
                                        value={localCustomer[field] || ""}
                                        onChange={(e) =>
                                            setLocalCustomer({
                                                ...localCustomer,
                                                [field]: e.target.value,
                                            })
                                        }
                                        className="col-span-3"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveChanges}>
                            {loadingEdit ? "Saving Changes..." : "Save Changes"}
                        </Button>
                        <Button variant="outline" onClick={() => setEditingCustomer(null)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>View and manage customer details</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Filters */}
                <div className="space-y-4 mb-4">
                    <div className="flex space-x-4">
                        <Select
                            value={filters.sex}
                            onValueChange={(value) => handleSelectChange("sex", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sex" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={filters.gov_bureau}
                            onValueChange={(value) =>
                                handleSelectChange("gov_bureau", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Government Bureau" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="trade_bureau">Addis Ababa Trade Bureau</SelectItem>
                                <SelectItem value="finance_bureau">Addis Ababa Finance bureau</SelectItem>
                                <SelectItem value="environmental_protection_authority">Addis Ababa City Environmental protection Authority</SelectItem>
                                <SelectItem value="gov_property_administration_authority">Government Property Administration Authority</SelectItem>
                                <SelectItem value="public_procurement_property_disposal_service">Addis Ababa City Public Procurement and Property Disposal service</SelectItem>

                            </SelectContent>
                        </Select>
                        <Input
                            type="number"
                            name="salary_min"
                            placeholder="Min Salary"
                            value={filters.salary_min}
                            onChange={handleFilterChange}
                        />
                        <Input
                            type="number"
                            name="salary_max"
                            placeholder="Max Salary"
                            value={filters.salary_max}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <Input
                        type="text"
                        name="search"
                        placeholder="Search keyword"
                        value={filters.search}
                        onChange={handleFilterChange}
                    />
                </div>
                {/* Table */}
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer ID</TableHead>
                                <TableHead>First Name</TableHead>
                                <TableHead>Last Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Savings</TableHead>
                                <TableHead>Loan</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell>{customer.id}</TableCell>
                                    <TableCell>{customer.fname}</TableCell>
                                    <TableCell>{customer.lname}</TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>${customer.saving_balance}</TableCell>
                                    <TableCell>${customer.loan_balance}</TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <CustomerDetailsDialog customer={customer} />
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="destructive" size="sm">
                                                        Delete
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Confirm Deletion</DialogTitle>
                                                        <DialogDescription>
                                                            Are you sure you want to delete this customer?
                                                            This action cannot be undone.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <Button variant="outline">Cancel</Button>
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() => handleDelete(customer.id)}
                                                            disabled={loadingDelete}
                                                        >
                                                            {loadingDelete ? "Deleting..." : "Delete"}
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                {/* Pagination */}
                <div className="flex justify-between mt-4">
                    <Button
                        onClick={() => handlePageChange(-1)}
                        disabled={filters.page === 1 || loading}
                    >
                        Previous
                    </Button>
                    <Button onClick={() => handlePageChange(1)} disabled={loading}>
                        Next
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ViewCustomer;

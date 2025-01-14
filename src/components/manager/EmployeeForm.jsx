import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useEmployeeStore from '@/store/useEmployeeStore';
import useAuthStore from '@/store/authStore'; // Importing the auth store
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const EmployeeForm = ({ isAddOpen, setIsAddOpen, selectedEmployee, setSelectedEmployee }) => {
    const { addEmployee, updateEmployee, loading, error } = useEmployeeStore();
    const { token } = useAuthStore(); // Get token from auth store

    const [newEmployee, setNewEmployee] = useState({
        name: '',
        email: '',
        phone: '',
        department: '',
        role: '',
    });

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (selectedEmployee) {
            setNewEmployee(selectedEmployee);
            setIsEditOpen(true);
        } else {
            resetForm();
            setIsEditOpen(false);
        }
    }, [selectedEmployee]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' })); // Clear error on change
    };

    const handleSelectChange = (value, name) => {
        setNewEmployee((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' })); // Clear error on change
    };

    const handleAddEmployee = async () => {
        try {
            await addEmployee(newEmployee, token); // Use token from auth store
            toast.success('Employee created successfully!');
            resetForm();
            setIsAddOpen(false);
        } catch (err) {
            if (err.response && err.response.status === 422) {
                // Set validation errors from the backend response
                setErrors(err.response.data.errors);
            } else {
                toast.error('Failed to create employee. Please try again.');
            }
        }
    };

    const handleUpdateEmployee = async () => {
        try {
            await updateEmployee(newEmployee.id, newEmployee, token); // Use token from auth store
            toast.success('Employee updated successfully!');
            resetForm();
            setIsEditOpen(false);
        } catch (err) {
            if (err.response && err.response.status === 422) {
                // Set validation errors from the backend response
                setErrors(err.response.data.errors);
            } else {
                toast.error('Failed to create employee. Please try again.');
            }
        }
    };

    const resetForm = () => {
        setNewEmployee({
            name: '',
            email: '',
            phone: '',
            department: '',
            role: '',
        });
        setSelectedEmployee(null);
        setErrors({});
    };

    const handleCancel = () => {
        resetForm();
        setIsAddOpen(false);
        setIsEditOpen(false);
    };

    return (
        <>
            {/* Add Employee Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Employee</DialogTitle>
                        <DialogDescription>Enter the new employee's details below.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <EmployeeFormFields
                            newEmployee={newEmployee}
                            handleInputChange={handleInputChange}
                            handleSelectChange={handleSelectChange}
                            errors={errors}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddEmployee} disabled={loading}>
                            {loading ? 'Adding Employee...' : 'Add Employee'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Employee Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Employee</DialogTitle>
                        <DialogDescription>Edit the employee's information below.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <EmployeeFormFields
                            newEmployee={newEmployee}
                            handleInputChange={handleInputChange}
                            handleSelectChange={handleSelectChange}
                            errors={errors}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateEmployee} disabled={loading}>
                            {loading ? 'Updating Employee...' : 'Update Employee'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

function EmployeeFormFields({ newEmployee, handleInputChange, handleSelectChange, errors }) {
    return (
        <>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <div className="col-span-3">
                    <Input
                        id="name"
                        name="name"
                        value={newEmployee.name || ""}
                        onChange={handleInputChange}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.join(', ')}</p>}
                </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <div className="col-span-3">
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={newEmployee.email || ""}
                        onChange={handleInputChange}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.join(', ')}</p>}
                </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <div className="col-span-3">
                    <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={newEmployee.phone || ""}
                        onChange={handleInputChange}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.join(', ')}</p>}
                </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">Department</Label>
                <div className="col-span-3">
                    <Select
                        value={newEmployee.department || ""}
                        onValueChange={(value) => handleSelectChange(value, "department")}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Loans">Loans</SelectItem>
                            <SelectItem value="Customer Service">Customer Service</SelectItem>
                            <SelectItem value="Management">Management</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department.join(', ')}</p>}
                </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Role</Label>
                <div className="col-span-3">
                    <Select
                        value={newEmployee.role || ""}
                        onValueChange={(value) => handleSelectChange(value, "role")}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="accountant">Accountant</SelectItem>
                            <SelectItem value="loan-committee">Loan Committee</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.join(', ')}</p>}
                </div>
            </div>
        </>
    );
}

export default EmployeeForm;
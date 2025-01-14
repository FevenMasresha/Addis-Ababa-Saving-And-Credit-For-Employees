import React, { useState } from 'react';
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';

const formSchema = z.object({
    username: z.string().min(3, {
        message: "Username must be at least 3 characters.",
    }).nonempty("Username is required."),
    role: z.string().nonempty("Role is required."),

});

const AddUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false); // State for success
    const [isError, setIsError] = useState(null); // State for error

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            role: "",
            password: "",
        },
    });

    // Handle form submission
    const onSubmit = async (values) => {
        setIsLoading(true);
        setIsSuccess(false);
        setIsError(null); // Reset error state on new submission

        try {
            // Replace this URL with your backend endpoint
            const response = await axios.post('http://localhost:8000/api/signup', values);
            form.reset();
            setIsSuccess(true); // Set success on successful submission

            // Reset to "Add User" after 3 seconds
            setTimeout(() => {
                setIsSuccess(false);
            }, 3000); // Change this duration as needed
        } catch (error) {
            console.error('Error adding user:', error);
            if (error.response) {
                // Set exact error message from the backend
                setIsError(error.response.data.message);
            } else {
                setIsError('An unexpected error occurred. Please try again later.');
            }

            // Reset to "Add User" after 3 seconds
            setTimeout(() => {
                setIsError(null);
            }, 3000); // Change this duration as needed
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Add New User</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="manager">Manager</SelectItem>
                                            <SelectItem value="accountant">Accountant</SelectItem>
                                            <SelectItem value="loan-committee">Loan Committee</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <span>Loading...</span>
                            ) : isSuccess ? (
                                <span className="text-green-600">User Added Successfully!</span>
                            ) : isError ? (
                                <span className="text-red-600">{isError}</span>
                            ) : (
                                'Add User'
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default AddUser;

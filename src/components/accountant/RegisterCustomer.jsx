import { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useAuthStore from '@/store/authStore';

const RegisterCustomer = () => {
  const [formData, setFormData] = useState({
    phone: '',
    account_no: '',
    fname: '',
    lname: '',
    age: '',
    sex: '',
    email: '',
    salary: '',
    gov_bureau: '', // Default value should be empty to indicate no selection
  });

  const [errors, setErrors] = useState({}); // Track field-specific errors
  const [successMessage, setSuccessMessage] = useState(''); // Track success message
  const [loading, setLoading] = useState(false); // Loading state for form submission
  const { token } = useAuthStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear field-specific error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset errors
    setSuccessMessage('');
    setLoading(true); // Set loading state

    // Validation for government bureau select field
    if (!formData.gov_bureau) {
      setErrors((prev) => ({
        ...prev,
        gov_bureau: 'Please select a government bureau.',
      }));
      setLoading(false);
      return; // Prevent form submission if validation fails
    }

    try {
      console.log("Request Data:", formData);
      const response = await axios.post('http://localhost:8000/api/register-customer', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Show success message
      setSuccessMessage('Customer registered successfully!');

      // Reset form data and focus on the first field
      setFormData({
        phone: '',
        account_no: '',
        fname: '',
        lname: '',
        age: '',
        sex: '',
        email: '',
        salary: '',
        gov_bureau: '', // Reset gov_bureau
      });
      document.getElementById('phone').focus(); // Focus on the first input field
    } catch (error) {
      console.error("Error during registration:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors); // Display server-side validation errors
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex-1">
      <div className="max-w-4xl mx-auto">
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle>Register New Customer</CardTitle>
            <CardDescription>Enter the customer's details to create a new account.</CardDescription>
          </CardHeader>
          {errors.general && (
            <div className="text-red-600 text-sm mb-4">{errors.general}</div>
          )}
          {successMessage && (
            <div className="text-green-600 ml-8 text-sm mb-4">{successMessage}</div>
          )}
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="py-2 px-3"
                  />
                  {errors.phone && (
                    <div className="text-red-600 text-sm">{errors.phone}</div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="account_no">Account Number</Label>
                    <Input
                      id="account_no"
                      name="account_no"
                      value={formData.account_no}
                      onChange={handleInputChange}
                      required
                      className="py-2 px-3"
                    />
                    {errors.account_no && (
                      <div className="text-red-600 text-sm">{errors.account_no}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="py-2 px-3"
                    />
                    {errors.email && (
                      <div className="text-red-600 text-sm">{errors.email}</div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fname">First Name</Label>
                    <Input
                      id="fname"
                      name="fname"
                      value={formData.fname}
                      onChange={handleInputChange}
                      required
                      className="py-2 px-3"
                    />
                    {errors.fname && (
                      <div className="text-red-600 text-sm">{errors.fname}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lname">Last Name</Label>
                    <Input
                      id="lname"
                      name="lname"
                      value={formData.lname}
                      onChange={handleInputChange}
                      required
                      className="py-2 px-3"
                    />
                    {errors.lname && (
                      <div className="text-red-600 text-sm">{errors.lname}</div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                      className="py-2 px-3"
                    />
                    {errors.age && (
                      <div className="text-red-600 text-sm">{errors.age}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sex">Sex</Label>
                    <Select
                      value={formData.sex}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, sex: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sex" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.sex && (
                      <div className="text-red-600 text-sm">{errors.sex}</div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary</Label>
                    <Input
                      id="salary"
                      name="salary"
                      type="number"
                      value={formData.salary}
                      onChange={handleInputChange}
                      required
                      className="py-2 px-3"
                    />
                    {errors.salary && (
                      <div className="text-red-600 text-sm">{errors.salary}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gov_bureau">Government Bureau</Label>
                    <Select
                      value={formData.gov_bureau}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, gov_bureau: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Bureau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trade_bureau">Addis Ababa Trade Bureau</SelectItem>
                        <SelectItem value="finance_bureau">Addis Ababa Finance bureau</SelectItem>
                        <SelectItem value="environmental_protection_authority">Addis Ababa City Environmental protection Authority</SelectItem>
                        <SelectItem value="gov_property_administration_authority">Government Property Administration Authority</SelectItem>
                        <SelectItem value="public_procurement_property_disposal_service">Addis Ababa City Public Procurement and Property Disposal service</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gov_bureau && (
                      <div className="text-red-600 text-sm">{errors.gov_bureau}</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full py-2" disabled={loading}>
                {loading ? 'Submitting...' : 'Register Customer'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterCustomer;

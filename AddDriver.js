import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function AddDriver() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        mobile: '',
        address: '',
        adhaar: '',
        driving_license: '',
        status: 'active',
        rating: 0
    });
    const [transporterId, setTransporterId] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchTransporterData = async () => {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            
            if (!token || !user.email) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8081/api/transporters/dashboard', {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    params: { email: user.email }
                });
                
                if (response.data.data && response.data.data.length > 0) {
                    setTransporterId(response.data.data[0].transporter_id);
                }
            } catch (error) {
                console.error('Error fetching transporter data:', error);
                setError('Failed to load transporter information');
            }
        };

        fetchTransporterData();
    }, [navigate]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
        if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.mobile) {
            newErrors.mobile = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(formData.mobile)) {
            newErrors.mobile = 'Mobile number must be 10 digits';
        }
        if (!formData.driving_license) newErrors.driving_license = 'Driving license is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const driverData = {
                ...formData,
                transporter_id: transporterId,
                rating: parseFloat(formData.rating)
            };

            await axios.post(
                'http://localhost:8081/api/transporters/add-driver',
                driverData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setSuccess('Driver added successfully!');
            setFormData({
                first_name: '',
                last_name: '',
                email: '',
                mobile: '',
                address: '',
                adhaar: '',
                driving_license: '',
                status: 'active',
                rating: 0,
            });
            
            setTimeout(() => setSuccess(''), 5000);
        } catch (error) {
            console.error('Error adding driver:', error);
            setError(error.response?.data?.message || 'Failed to add driver. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">Add New Driver</h4>
                        </div>
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            
                            {success && (
                                <div className="alert alert-success" role="alert">
                                    {success}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="first_name" className="form-label text-white">First Name <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                                            id="first_name"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                        />
                                        {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="last_name" className="form-label text-white">Last Name <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                                            id="last_name"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                        />
                                        {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="email" className="form-label text-white">Email <span className="text-danger">*</span></label>
                                        <input
                                            type="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="mobile" className="form-label text-white">Mobile <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                                            id="mobile"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            maxLength="10"
                                        />
                                        {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label text-white">Address</label>
                                    <textarea
                                        className="form-control"
                                        id="address"
                                        name="address"
                                        rows="3"
                                        value={formData.address}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="adhaar" className="form-label text-white">Aadhaar Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="adhaar"
                                            name="adhaar"
                                            value={formData.adhaar}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="driving_license" className="form-label text-white">Driving License <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.driving_license ? 'is-invalid' : ''}`}
                                            id="driving_license"
                                            name="driving_license"
                                            value={formData.driving_license}
                                            onChange={handleChange}
                                        />
                                        {errors.driving_license && <div className="invalid-feedback">{errors.driving_license}</div>}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="status" className="form-label text-white">Status</label>
                                        <select
                                            className="form-select"
                                            id="status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="on_leave">On Leave</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="rating" className="form-label text-white">Rating (0-5)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="rating"
                                            name="rating"
                                            min="0"
                                            max="5"
                                            step="0.1"
                                            value={formData.rating}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="d-flex justify-content-end mt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Adding...
                                            </>
                                        ) : 'Add Driver'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddDriver;
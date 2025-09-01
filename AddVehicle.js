import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function AddVehicle() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        model: '',
        dimension: '',
        registration_number: '',
        chassis_number: '',
        engine_number: '',
        fuel_type: 'Diesel', // Default value
        tonnage: ''

    });
    const [transporterId, setTransporterId] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch transporter ID when component mounts and avoid error message on page refresh
        // if (Object.keys(formData).some(key => formData[key] !== '')) {
        //     return;
        // }
        const fetchTransporterData = async () => {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            console.log(user);
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
                    console.log(transporterId);
                }
            } catch (error) {
                console.error('Error adding vehicle:', error);
                setError('Failed to add vehicle');
            }
        };

        fetchTransporterData();
        console.log(transporterId);
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const payload = {
                ...formData,
                transporter_id: transporterId
            };

            const response = await axios.post(
                'http://localhost:8081/api/transporters/add-vehicle',
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setSuccess('Vehicle added successfully!');
                // Reset form
                setFormData({
                    model: '',
                    dimension: '',
                    registration_number: '',
                    chassis_number: '',
                    engine_number: '',
                    fuel_type: 'Diesel'
                });
            } else {
                throw new Error(response.data.message || 'Failed to add vehicle');
            }
        } catch (error) {
            console.error('Error adding vehicle:', error);
            setError(error.response?.data?.message || error.message || 'Failed to add vehicle');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0 text-info">Add New Vehicle</h4>
                        </div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="model" className="form-label text-white">Vehicle Model</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="model"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="dimension" className="form-label text-white">Dimensions (LxWxH in meters)</label>
                                    <select 
                                        className="form-select" 
                                        id="dimension"
                                        name="dimension" 
                                        value={formData.dimension} 
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Dimension</option>
                                        <option value="6x2.5x2.5">6x2.5x2.5</option>
                                        <option value="7x3x3">7x3x3</option>
                                        <option value="8x4x4">8x4x4</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="registration_number" className="form-label text-white">Registration Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="registration_number"
                                        name="registration_number"
                                        value={formData.registration_number || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="chassis_number" className="form-label text-white">Chassis Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="chassis_number"
                                        name="chassis_number"
                                        value={formData.chassis_number || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="engine_number" className="form-label text-white">Engine Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="engine_number"
                                        name="engine_number"
                                        value={formData.engine_number || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="tonnage" className="form-label text-white">Tonnage (In Kg)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="tonnage"
                                        name="tonnage"
                                        value={formData.tonnage  || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="fuel_type" className="form-label text-white">Fuel Type</label>
                                    <select
                                        className="form-select"
                                        id="fuel_type"
                                        name="fuel_type"
                                        value={formData.fuel_type || ''}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="Diesel">Diesel</option>
                                        <option value="Petrol">Petrol</option>
                                        <option value="CNG">CNG</option>
                                        <option value="Electric">Electric</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>

                                <div className="d-grid gap-2">
                                    <button 
                                        type="submit" 
                                        style={{color: 'white'}}
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Adding Vehicle...' : 'Add Vehicle'}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        onClick={() => navigate('/transporter/dashboard')}
                                    >
                                        Back to Dashboard
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

export default AddVehicle;

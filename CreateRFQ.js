import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateRFQ() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        source: '',
        destination: '',
        description: '',
        pickup_date: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            
            if (!token) {
                navigate('/login');
                return;
            }

            const formattedDate = new Date(formData.pickup_date).toISOString();
            const contractorResponse = await axios.get('http://localhost:8081/api/contractors/dashboard', {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params: { email: user.email }
            });
            const contrator_id  = contractorResponse.data.data[0].contractor_id;
            
            const response = await axios.post('http://localhost:8081/api/contractors/create-rfq', {
                source: formData.source,
                destination: formData.destination,
                description: formData.description,
                pickup_date: formattedDate,
                contractor_id: contrator_id
            }, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                alert('RFQ created successfully!');
                navigate('/contractor-dashboard');
            }
        } catch (error) {
            console.error('Error creating RFQ:', error);
            setError(`Failed to create RFQ: ${error.message || error}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="d-flex align-items-center justify-content-center min-vh-100"
            style={{ 
                background: "linear-gradient(135deg, #d4eff5ff, #e0f4f9ff)", 
                animation: "gradientBG 10s ease infinite",
                backgroundSize: "400% 400%"
            }}
        >
            <style>
                {`
                    @keyframes gradientBG {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    .glass-card {
                        background: rgba(255, 255, 255, 0.15);
                        backdrop-filter: blur(12px);
                        -webkit-backdrop-filter: blur(12px);
                        border-radius: 20px;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                    }
                    .form-control:focus {
                        border-color: #2193b0;
                        box-shadow: 0 0 8px rgba(33, 147, 176, 0.5);
                        transition: all 0.3s ease-in-out;
                    }
                    .btn-primary {
                        background: linear-gradient(135deg, #2193b0, #6dd5ed);
                        border: none;
                        transition: 0.3s;
                    }
                    .btn-primary:hover {
                        background: linear-gradient(135deg, #6dd5ed, #2193b0);
                        transform: scale(1.05);
                    }
                    .btn-outline-secondary:hover {
                        background: #f0f0f0;
                        transform: scale(1.05);
                    }
                `}
            </style>

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card glass-card shadow-lg p-4">
                            <div className="card-header bg-transparent border-0 text-center py-3">
                                <h2 className="fw-bold text-white">🚛 Create New RFQ</h2>
                                <p className="text-light small">Fill in the details below to request a quotation</p>
                            </div>
                            <div className="card-body text-white">
                                {error && <div className="alert alert-danger">{error}</div>}
                                
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="source" className="form-label">Source</label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3"
                                            id="source"
                                            name="source"
                                            value={formData.source}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter source location"
                                        />
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label htmlFor="destination" className="form-label">Destination</label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3"
                                            id="destination"
                                            name="destination"
                                            value={formData.destination}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter destination location"
                                        />
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <textarea
                                            className="form-control rounded-3"
                                            id="description"
                                            name="description"
                                            rows="3"
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter RFQ description"
                                        ></textarea>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label htmlFor="pickup_date" className="form-label">Pickup Date & Time</label>
                                        <input
                                            type="datetime-local"
                                            className="form-control rounded-3"
                                            id="pickup_date"
                                            name="pickup_date"
                                            value={formData.pickup_date}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="d-flex justify-content-end gap-3">
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-light px-4 rounded-3"
                                            onClick={() => navigate('/contractor-dashboard')}
                                            disabled={loading}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary px-4 rounded-3"
                                            disabled={loading}
                                        >
                                            {loading ? 'Creating...' : 'Create RFQ'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateRFQ;

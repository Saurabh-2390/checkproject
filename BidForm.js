import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BidForm() {
    const { rfqId } = useParams();
    const navigate = useNavigate();
    const [rfqDetails, setRfqDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        bid_amount: '',
        estimated_delivery_days: '',
        notes: '',
        vehicle_id: '',
        terms_conditions: false
    });
    const [vehicles, setVehicles] = useState([]);
    const [transporterId, setTransporterId] = useState('');
        

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            
            try {
                setLoading(true);
                
                // 1. First, get transporter details
                const transporterResponse = await axios.get('http://localhost:8081/api/transporters/dashboard', {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    params: { email: user.email }
                });

                if (transporterResponse.data.success && transporterResponse.data.data.length > 0) {
                    const transporterId = transporterResponse.data.data[0].transporter_id;
                    setTransporterId(transporterId);

                    // 2. Then, get RFQ details
                    const rfqResponse = await axios.get(`http://localhost:8081/api/transporters/get-rfq-details/${rfqId}`, {
                        headers: { 
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });


                    if (rfqResponse.data.success) {
                        setRfqDetails(rfqResponse.data.data);
                        console.log('rfqDetails',rfqDetails);                    }

                    // 3. Finally, get vehicles for the transporter
                    const vehiclesResponse = await axios.get('http://localhost:8081/api/transporters/get-vehicles', {
                        headers: { 
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        params: { transporter_id: transporterId }
                    });

                    if (vehiclesResponse.data.success && vehiclesResponse.data.data.length > 0) {
                        setVehicles(vehiclesResponse.data.data);
                        // Auto-select the first vehicle
                        setFormData(prev => ({
                            ...prev,
                            vehicle_id: vehiclesResponse.data.data[0].vehicle_id
                        }));
                        
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error loading data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [rfqId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        if (!formData.terms_conditions) {
            alert('Please accept the terms and conditions');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8081/api/transporters/submit-bid', {
                rfq_id: rfqId,
                transporter_id: transporterId,
                vehicle_id: formData.vehicle_id,
                route_id: rfqDetails.route_id,
                ...formData
            }, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                alert('Bid placed successfully!');
                navigate('/transporter-dashboard');
            } else {
                alert('Failed to place bid: ' + (response.data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error placing bid:', error);
            alert('Error placing bid. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger m-3">{error}</div>;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Place Bid for RFQ #{rfqId}</h2>
            
            {rfqDetails && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h4>RFQ Details</h4>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <p><strong>Source:</strong> {rfqDetails.source}</p>
                                <p><strong>Destination:</strong> {rfqDetails.destination}</p>
                                <p><strong>Pickup Date:</strong> {new Date(rfqDetails.pickup_date).toLocaleDateString()}</p>
                            </div>
                            <div className="col-md-6">
                                <p><strong>Contractor ID:</strong> {rfqDetails.contractor_id}</p>
                                <p><strong>Route ID:</strong> {rfqDetails.route_id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="card">
                <div className="card-header">
                    <h4>Bid Information</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="vehicle_id" className="form-label">Assign Vehicle</label>
                            <select
                                className="form-select"
                                id="vehicle_id"
                                name="vehicle_id"
                                value={formData.vehicle_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a vehicle</option>
                                {vehicles.length === 0 ? (
                                    <option value="" disabled>No vehicles available</option>
                                ) : (
                                    vehicles.map(vehicle => (
                                        <option 
                                            key={vehicle.vehicle_id} 
                                            value={vehicle.vehicle_id}
                                        >
                                            {vehicle.registration_number} - {vehicle.model || 'N/A'} ({vehicle.tonnage || 'N/A'} tons)
                                        </option>
                                    ))
                                )}
                            </select>
                            {vehicles.length === 0 && (
                                <div className="text-muted mt-1">
                                    No vehicles available. Please add vehicles to your account first.
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="bid_amount" className="form-label">Bid Amount (₹)</label>
                            <input
                                type="number"
                                className="form-control"
                                id="bid_amount"
                                name="bid_amount"
                                value={formData.bid_amount}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="estimated_delivery_days" className="form-label">Estimated Delivery Time (Days)</label>
                            <input
                                type="number"
                                className="form-control"
                                id="estimated_delivery_days"
                                name="estimated_delivery_days"
                                value={formData.estimated_delivery_days}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="notes" className="form-label">Additional Notes</label>
                            <textarea
                                className="form-control"
                                id="notes"
                                name="notes"
                                rows="3"
                                value={formData.notes}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        
                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="terms_conditions"
                                name="terms_conditions"
                                checked={formData.terms_conditions}
                                onChange={handleChange}
                                required
                            />
                            <label className="form-check-label" htmlFor="terms_conditions">
                                I agree to the terms and conditions
                            </label>
                        </div>
                        
                        <div className="d-flex justify-content-between">
                            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Submit Bid
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default BidForm;
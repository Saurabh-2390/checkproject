import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from "./logo.png";


function ContractorRegistration() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    businessLicense: '',
    contactPerson: '',
    phoneNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gstNumber: '',
    panNumber: '',
    bankAccountNumber: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await axios.post(
        'http://localhost:8081/api/contractors/create-contractor',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      if (response.data?.success) {
        alert('Registration successful!');
        navigate('/contractor-dashboard');
      } else {
        throw new Error(response.data?.message || 'Registration failed');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Registration failed. Please try again.';
      alert(errorMessage);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: "linear-gradient(135deg, #f0f7ff, #ffffff)" }}>
      {/* Navigation Bar */}
      <header className="p-3 bg-white text-dark d-flex align-items-center shadow-sm">
        <img
          src={logo}
          alt="VahanLink Logo"
          style={{ height: '50px', marginRight: '60px', marginLeft: '60px' }}
        />
        <nav className="ms-auto me-5">
          <ul className="nav">
            <li className="nav-item">
              <Link className="nav-link text-dark fw-medium" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark fw-medium" to="/about-us">About Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark fw-medium" to="/contact">Contact</Link>
            </li>
            <li className="nav-item">
              <button onClick={handleLogout} className="nav-link text-dark fw-medium border-0 bg-transparent">Logout</button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Form Section */}
      <div className="d-flex align-items-center justify-content-center flex-grow-1"
      style={{ paddingTop: "80px", paddingBottom: "40px" }}>
        <div
          className="card shadow-lg border-0 rounded-4"
          style={{
            width: "800px",
            background: "#ffffff",
            boxShadow: "0 8px 24px rgba(219, 199, 199, 0.08)"
          }}
        >
          <div className="card-body p-5">
            <h3 className="mb-2 text-uppercase"
              style={{
                color: "#00e6a8", // accent highlight (matches your brand buttons)
                fontWeight: "800",
                fontSize: "2rem",
                letterSpacing: "1.5px",
                textShadow: "0 3px 8px rgba(0, 0, 0, 0.6)",
                textAlign: "center"
              }}>Contractor Registration</h3>

            <p className="mb-0"
              style={{
                color: "#94a3b8", // soft muted text
                fontSize: "1rem",
                textAlign: "center"
              }}>
              Welcome, <strong>{user?.username || "User"}</strong>. Please fill in your contractor details.
            </p> <br></br>

            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    {/* Company Information */}
                                    <div className="row mb-4">
                                        <div className="col-12">
                                            <h5 
                                                className="mb-3 p-2 rounded" 
                                                style={{
                                                        fontSize: "18px",
                                                        fontWeight: "700",
                                                        color: "#ffffff",         // white text (since your background is dark)
                                                        marginTop: "20px",
                                                        marginBottom: "10px",
                                                        borderBottom: "1px solid #444", // subtle divider
                                                        paddingBottom: "5px"
                                                    }}
                                              > Company Information</h5>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label text-light">Company Name *</label>
                                            <input
                                                type="text"
                                                className="form-control bg-dark text-light border-secondary"
                                                name="companyName"
                                                value={formData.companyName}
                                                onChange={handleInputChange}
                                                    
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label text-light">Business License Number *</label>
                                            <input
                                                type="text"
                                                className="form-control bg-dark text-light border-secondary"
                                                name="businessLicense"
                                                value={formData.businessLicense}
                                                onChange={handleInputChange}
                                            
                                            />
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="row mb-4">
                                        <div className="col-12">
                                            <h5 
                                                className="mb-3 p-2 rounded" 
                                                style={{
                                                        fontSize: "18px",
                                                        fontWeight: "700",
                                                        color: "#ffffff",         // white text (since your background is dark)
                                                        marginTop: "20px",
                                                        marginBottom: "10px",
                                                        borderBottom: "1px solid #444", // subtle divider
                                                        paddingBottom: "5px"
                                                    }}>Contact Information</h5>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label text-light">Contact Person </label>
                                            <input
                                                type="text"
                                                className="form-control bg-dark text-light border-secondary"
                                                name="contactPerson"
                                                value={formData.contactPerson}
                                                onChange={handleInputChange}
                                                
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label text-light">Phone Number </label>
                                            <input
                                                type="tel"
                                                className="form-control bg-dark text-light border-secondary"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleInputChange}
                                                
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label text-light">Email </label>
                                            <input
                                                type="email"
                                                className="form-control bg-dark text-light border-secondary"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                
                                            />
                                        </div>
                                    </div>

                                    {/* Address Information */}
                                    <div className="row mb-4">
                                        <div className="col-12">
                                            <h5 
                                                className="mb-3 p-2 rounded" 
                                                style={{
                                                        fontSize: "18px",
                                                        fontWeight: "700",
                                                        color: "#ffffff",         // white text (since your background is dark)
                                                        marginTop: "20px",
                                                        marginBottom: "10px",
                                                        borderBottom: "1px solid #444", // subtle divider
                                                        paddingBottom: "5px"
                                                    }}>Address Information</h5>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="form-label text-light">Address </label>
                                            <textarea
                                                className="form-control bg-dark text-light border-secondary"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                rows="2"
                                                
                                            ></textarea>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label text-light">City </label>
                                            <input
                                                type="text"
                                                className="form-control bg-dark text-light border-secondary"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label text-light">State </label>
                                            <input
                                                type="text"
                                                className="form-control bg-dark text-light border-secondary"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label text-light">Pincode </label>
                                            <input
                                                type="text"
                                                className="form-control bg-dark text-light border-secondary"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                                
                                            />
                                        </div>
                                    </div>

                                    {/* Legal & Financial Information */}
                                    <div className="row mb-4">
                                        <div className="col-12">
                                            <h5 
                                                className="mb-3 p-2 rounded" 
                                                style={{
                                                        fontSize: "18px",
                                                        fontWeight: "700",
                                                        color: "#ffffff",         // white text (since your background is dark)
                                                        marginTop: "20px",
                                                        marginBottom: "10px",
                                                        borderBottom: "1px solid #444", // subtle divider
                                                        paddingBottom: "5px"
                                                    }}
                                                        >
                                                Legal & Financial Information </h5>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label text-light">GST Number</label>
                                            <input
                                                type="text"
                                                className="form-control bg-dark text-light border-secondary"
                                                name="gstNumber"
                                                value={formData.gstNumber}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label text-light">PAN Number </label>
                                            <input
                                                type="text"
                                                className="form-control bg-dark text-light border-secondary"
                                                name="panNumber"
                                                value={formData.panNumber}
                                                onChange={handleInputChange}
                                                
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label text-light">Bank Account Number </label>
                                            <input
                                                type="text"
                                                className="form-control bg-dark text-light border-secondary"
                                                name="bankAccountNumber"
                                                value={formData.bankAccountNumber}
                                                onChange={handleInputChange}
                                                
                                            />
                                        </div>
                                    </div>

              {/* Buttons */}
              <div className="d-flex justify-content-between mt-4">
                <button
                  type="button"
                  onClick={() => navigate('/registration')}
                  className="btn fw-semibold rounded-3 text-white"
                  style={{
                    background: "linear-gradient(135deg, #00e6a8, #00bfa6)",
                    border: "none",
                    padding: "8px 20px",
                    boxShadow: "0 3px 8px rgba(0, 230, 168, 0.3)"
                  }}
                >
                  Back to Role Selection
                </button>

                <button
                  type="submit"
                  className="btn fw-semibold rounded-3 text-white"
                  style={{
                    background: "linear-gradient(135deg, #00e6a8, #00bfa6)",
                    border: "none",
                    padding: "8px 20px",
                    boxShadow: "0 3px 8px rgba(0, 230, 168, 0.3)"
                  }}
                >
                  Register as Contractor
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
      {/* Footer */}
      <footer className="container-fluid py-3 bg-white text-center mt-auto border-top">
        <div className="mb-2">
          <Link to="/about" className="text-dark me-3"><i className="bi bi-info-circle"></i> About Us</Link>
          <Link to="/contact" className="text-dark me-3"><i className="bi bi-envelope"></i> Contact</Link>
          <Link to="/privacy" className="text-dark me-3"><i className="bi bi-shield-lock"></i> Privacy Policy</Link>
          <Link to="/terms" className="text-dark"><i className="bi bi-file-earmark-text"></i> Terms of Use</Link>
        </div>
        <div className="text-muted small">© 2025 Company Name</div>
      </footer>
    </div>
  );
}

export default ContractorRegistration;

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from 'axios';
import logo from "./logo.png";

function ContractorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [contractorData, setContractorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    fetchContractorData(token, userData.email);
  }, [navigate]);

  const fetchContractorData = async (token, email) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/contractors/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
          'Content-Type': 'application/json',
          params: { email: email }
        }
      );
      if (response.data.success) {
        setContractorData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching contractor data:', error);
      setError('Failed to load contractor data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger m-3">{error}</div>;
  }

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{ background: "linear-gradient(135deg, #f0f7ff, #ffffff)" }}
    >
      {/* Navigation Bar */}
      <header className="p-3 bg-white text-dark d-flex align-items-center shadow-sm">
        <img
          src={logo}
          alt="VahanLink Logo"
          style={{ height: "50px", marginRight: "60px", marginLeft: "60px" }}
        />

        <nav className="ms-auto me-5">
          <ul className="nav align-items-center">
            <li className="nav-item">
              <Link className="nav-link text-dark fw-medium" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark fw-medium" to="/about-us">About Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark fw-medium" to="/contact">Contact</Link>
            </li>

            {/* Dropdown */}
            <div className="dropdown me-1">
              <button
                className="btn btn-link nav-link text-dark dropdown-toggle fw-medium"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Menu
              </button>
              <ul className="dropdown-menu" aria-labelledby="contractorMenu">
                                <li><Link className="dropdown-item" to="/contractor/create-rfq">Create RFQ</Link></li>
                                <li><Link className="dropdown-item" to="/contractor/view-rfq">View RFQs</Link></li>
                                <li><Link className="dropdown-item" to="/contractor/view-bid-details">View Bids</Link></li>
                            </ul>
            </div>

            {/* Switch Role */}
            <div className="dropdown me-1">
              <button
                className="btn btn-link nav-link text-dark dropdown-toggle fw-medium"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Switch Role
              </button>
              <ul className="dropdown-menu shadow-sm">
                <li><Link className="dropdown-item" to="/registration">Consignor</Link></li>
                <li><Link className="dropdown-item" to="/registration">Consignee</Link></li>
                <li><Link className="dropdown-item" to="/registration">Contractor</Link></li>
                <li><Link className="dropdown-item" to="/registration">Driver</Link></li>
                <li><Link className="dropdown-item" to="/registration">Admin</Link></li>
              </ul>
            </div>

            {/* Logout */}
            <li className="nav-item">
              <button onClick={handleLogout} className="btn btn-outline-dark px-3 fw-medium">Logout</button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Section */}
      <div
        className="d-flex align-items-center justify-content-center flex-grow-1"
        style={{ paddingTop: "80px", paddingBottom: "40px" }}
      >
        <div className="container my-4">
          <div className="row justify-content-center">
            <div className="col-md-10">
              <div
                className="card shadow-lg border-0 rounded-4 text-dark mb-4"
                style={{
                  background: "#ffffff",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)"
                }}
              >
                <div
                  className="card-header d-flex justify-content-between align-items-center border-0"
                  style={{ background: "transparent", paddingBottom: "10px" }}
                >
                  <h4
                    className="mb-0 text-uppercase flex-grow-1 text-center text-light"
                    style={{
                      color: "#333",
                      fontWeight: "700",
                      fontSize: "1.8rem",
                      letterSpacing: "1px"
                    }}
                  >
                    Contractor Profile
                  </h4>

                  {/* Edit Button */}
                  <Link
                    to="/contractor/edit"
                    className="px-5 py-2 rounded-pill fw-semibold shadow-sm"
                    style={{
                      background: "linear-gradient(135deg, #00e6a8, #00bfa6)",
                      color: "#ffffff",
                      border: "none",
                      letterSpacing: "0.6px",
                      transition: "all 0.3s ease",
                      boxShadow: "0 3px 8px rgba(0, 230, 168, 0.3)"
                    }}
                  >
                    Edit Profile
                  </Link>
                </div>

                {/* Body */}
                <div className="card-body px-4 py-4">
                  {contractorData && (
                    <div className="row">
                      {/* Company Details */}
                      <div className="col-md-6 mb-4">
                        <h5
                          className="fw-bold text-uppercase mb-3"
                          style={{ color: "#00e6a8", letterSpacing: "1px" }}
                        >
                          Company Details
                        </h5>
                        <p><span className="fw-bold text-secondary">Company Name:</span>{" "}<span className="text-light">{contractorData[0].company_name}</span></p>
                        <p><span className="fw-bold text-secondary">Business License:</span>{" "} <span className="text-light">{contractorData[0].business_license || 'N/A'}</span></p>
                        <p><span className="fw-bold text-secondary">GST Number:</span>{" "} <span className="text-light">{contractorData[0].gst_number || 'N/A'}</span></p>
                        <p><span className="fw-bold text-secondary">PAN Number:</span>{" "} <span className="text-light">{contractorData[0].pan_number || 'N/A'}</span></p>
                      </div>

                      {/* Contact Information */}
                      <div className="col-md-6 mb-4">
                        <h5
                          className="fw-bold text-uppercase mb-3"
                          style={{ color: "#00e6a8", letterSpacing: "1px" }}
                        >
                          Contact Information
                        </h5>
                        <p><span className="fw-bold text-secondary">Contact Person:</span>{" "}<span className="text-light">{contractorData[0].contact_person || 'N/A'}</span></p>
                        <p><span className="fw-bold text-secondary">Email:</span>{" "}<span className="text-light">{contractorData[0].email || 'N/A'}</span></p>
                        <p><span className="fw-bold text-secondary">Phone:</span>{" "}<span className="text-light">{contractorData[0].phone_number || 'N/A'}</span></p>
                        <p>
                          <span className="fw-bold text-secondary">Address:</span>{" "}
                          <span className="text-light">{contractorData[0].address || 'N/A'}, {contractorData[0].city}, {contractorData[0].state} - {contractorData[0].pincode}</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bids Management */}
              <div
                className="card shadow-lg border-0 rounded-4 text-dark"
                style={{
                  background: "#ffffff",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)"
                }}
              >
                <div className="card-body px-4 py-4">
                  <h5
                    className="fw-bold text-uppercase mb-3"
                    style={{ color: "#00e6a8", letterSpacing: "1px" }}
                  >
                    Bids Management
                  </h5>
                  <p className="mb-3 "
                  style={{ color: "#868a8eff" }}>
                    View, track and manage all bids submitted by transporters for your RFQs.
                  </p>
                  <Link
                    to="/contractor/bids"
                    className="btn fw-semibold px-4 py-2 rounded-pill shadow-sm"
                    style={{
                      background: "linear-gradient(135deg, #00e6a8, #00bfa6)",
                      color: "#ffffff",
                      border: "none",
                      letterSpacing: "0.6px",
                      transition: "all 0.3s ease",
                      boxShadow: "0 3px 8px rgba(0, 230, 168, 0.3)"
                    }}
                  >
                    View All Bids
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container-fluid py-3 bg-white text-center mt-auto border-top">
        <div className="mb-2">
          <Link to="/about" className="text-dark me-3">About Us</Link>
          <Link to="/contact" className="text-dark me-3">Contact</Link>
        </div>
        <div className="text-muted small">
          &copy; {new Date().getFullYear()} VahanLink. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default ContractorDashboard;

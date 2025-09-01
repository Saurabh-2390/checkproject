import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from './logo.png';




function Login() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Basic validation
        if (!values.email || !values.password) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        
        try {
            const response = await axios.post('http://localhost:8081/api/auth/login', values, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: false
            });
            
            if (response.data.token) {
                // Store token and user data
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                if (response.data.user.role === 'transporter') {
                    navigate('/TransporterDashboard');
                } else if (response.data.user.role === 'contractor') {
                    navigate('/ContractorDashboard');
                } else {
                    navigate('/registration');
                }
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || 
                              err.message || 
                              'Login failed. Please try again.';
                              alert(errorMessage);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
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
                                
                                {/* Navigation Menu */}
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
                                            <Link className="nav-link text-dark fw-medium" to="/signup">Register</Link>
                                        </li>
                                    </ul>
                                </nav>
                            </header>

<div className="d-flex align-items-center justify-content-center flex-grow-1">
  <div 
    className="card shadow-lg border-0 rounded-4" 
    style={{ 
      width: '420px', 
      background: "#ffffff", 
      boxShadow: "0 8px 24px rgba(219, 199, 199, 0.08)" 
    }}
  >
    <div className="card-body p-5">
      {/* Heading */}
      <h3 className="text-center fw-bold mb-2 text-white">Login to your account</h3>
      <p className="text-center text-white small mb-4">Sign in to track your shipments</p>


      {/* Error */}
      {error && (
        <div className="alert alert-danger py-2 small text-center rounded-3">{error}</div>
      )}

      {/* Form */}
    <form onSubmit={handleSubmit}>

      {/* Email */}
  < div className="mb-3">
    <label className="form-label small fw-semibold text-white">Email / Phone</label>
   <input
    type="text"
    className="form-control form-control-lg border-0 rounded-4 shadow-sm"
    placeholder="Enter email or phone"
    value={values.email}
    onChange={e => setValues({ ...values, email: e.target.value })}
    disabled={isLoading}
    style={{
        backgroundColor: "#ffffff",   // white background
        color: "#000000",             // black text
        transition: "all 0.2s ease",
        height: "32px",      // custom vertical size
        fontSize: "14px",    // make text fit nicely
        padding: "4px 10px",  // adjust padding
        transition: "all 0.2s ease"
    }}
    onFocus={e => e.target.style.boxShadow = "0 0 0 4px rgba(13,110,253,0.15)"}
    onBlur={e => e.target.style.boxShadow = "none"}
/>

  </div>

  {/* Password */}
  <div className="mb-3">
    <label className="form-label small fw-semibold text-white">Password</label>
    <input
      type="password"
      className="form-control form-control-lg bg-dark border-0 rounded-4 shadow-sm "
      placeholder="Enter password"
      value={values.password}
      onChange={e => setValues({ ...values, password: e.target.value })}
      disabled={isLoading}
      style={{
        background: "#23272b",
        color: "#fff",
        height: "32px",      // custom vertical size
        fontSize: "14px",    // make text fit nicely
        padding: "4px 10px",  // adjust padding
        transition: "all 0.2s ease"
      }}
      onFocus={e => e.target.style.boxShadow = "0 0 0 4px rgba(13,110,253,0.15)"}
      onBlur={e => e.target.style.boxShadow = "none"}
    />
  </div>

        {/* Remember + Forgot */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="form-check">
            <input type="checkbox" className="form-check-input" id="remember" />
            <label className="form-check-label small text-white">Remember me</label>
          </div>
          <Link 
            to="/forgot-password" 
            className="small fw-semibold text-decoration-none text-white" 
            style={{ color: "#707b8cff" }}
          >
            Forgot Password?
          </Link>
        </div>

        {/* Buttons */}
        <button
          type="submit"
  className="btn w-100 mb-3 py-2 fw-semibold rounded-3 text-white"
  style={{
                                                        background: "linear-gradient(135deg, #00e6a8, #00bfa6)", // main gradient
                                                        color: "#ffffff", // white text for contrast
                                                        border: "none",
                                                        letterSpacing: "0.6px",
                                                        transition: "all 0.3s ease",
                                                        boxShadow: "0 3px 8px rgba(0, 230, 168, 0.3)",
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.target.style.background = "linear-gradient(135deg, #00f7c3, #00d1a0)";
                                                            e.target.style.transform = "translateY(-2px)";
                                                            e.target.style.boxShadow = "0 6px 16px rgba(0, 230, 168, 0.5)";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.background = "linear-gradient(135deg, #00e6a8, #00bfa6)";
                                                            e.target.style.transform = "translateY(0)";
                                                            e.target.style.boxShadow = "0 3px 8px rgba(0, 230, 168, 0.3)";
                                                        }}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>



        <button
          type="button"
  onClick={() => navigate('/signup')}
  className="btn w-100 py-2 fw-semibold rounded-3 text-white"
  style={{
    background: "linear-gradient(90deg, #2d2d2d, #1a1a1a)", // Dark gradient
    border: "1px solid #00bfa6", // Subtle green border
    transition: "all 0.3s ease"
  }}
  onMouseEnter={e => {
    e.currentTarget.style.background = "linear-gradient(90deg, #00f7c3, #00d1a0)";
    e.currentTarget.style.color = "#000";
  }}
  onMouseLeave={e => {
    e.currentTarget.style.background = "linear-gradient(90deg, #2d2d2d, #1a1a1a)";
    e.currentTarget.style.color = "#fff";
  }}
>
  Register
</button>

        {/* Signup note */}
        <p className="text-center small  mt-3 text-white">
          Don’t have an account? <Link to="/signup" className="fw-semibold" style={{ color: "#1753b4ff" }}>Create one</Link>
        </p>
      </form>
    </div>
  </div>
</div>
</div>
    );
}

export default Login;
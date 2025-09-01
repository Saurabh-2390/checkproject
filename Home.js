import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.png';
import bgImage from './back2.webp';

function Home() {
    return (
        <div className="bg-black min-vh-100 d-flex flex-column">

            {/* Header Section */}
            <header className="p-3 bg-white text-dark d-flex align-items-center">
                <img src={logo} alt="VahanLink Logo"
                style={{ height: '50px', marginRight: '60px', marginLeft: '60px' }}/>


            {/* Navigation Menu */}
            <nav className="ms-auto me-5">
            <ul className="nav">
            <li className="nav-item">
            <Link className="nav-link active text-dark fw-bold" to="/home">Home</Link></li>
            <li className="nav-item">
            <Link className="nav-link text-dark" to="/industries">Industries</Link></li>
            <li className="nav-item">
            <Link className="nav-link text-dark" to="/why-us">Why Us?</Link></li>
            <li className="nav-item">
            <Link className="nav-link text-dark" to="/about-us">About Us</Link></li>
            <li className="nav-item">
            <Link className="nav-link text-dark" to="/tracking">Tracking</Link></li>
            </ul> </nav>
            </header>


            {/* Background Image with overlay and centered content */}
            <div
                style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center',
                         minHeight: 'calc(100vh - 160px)', display: 'flex', alignItems: 'center',
                         justifyContent: 'center', position: 'relative', flex: 1}}>


            {/* Overlay */}
            <div
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'absolute', top: 0, left: 0,
                        width: '100%', height: '100%',}}></div>

            {/* Content */}
                <div className="text-center" style={{ position: 'relative', zIndex: 1, marginLeft: '55%', width: 'fit-content' }}>
                    <h1 className="text-light mb-3"
                    style={{ fontFamily: "'Poppins', sans-serif", fontSize: "3rem", fontWeight: "bold" }}>
                        Welcome to Vahanlink </h1>

                    <p className="text-light mb-4"
                    style={{ fontFamily: "'Poppins', sans-serif", fontSize: "1.5rem" }}>
                        Your trusted partner in logistics
                    </p>

                    <div className="d-grid gap-3"
    style={{ maxWidth: '340px', margin: '0 auto', padding: '32px 24px' }}>

    {/* Login Button */}
    <Link to="/login" className="btn btn-lg"
        style={{
            background: 'linear-gradient(90deg, #141E30 0%, #243B55 100%)', // Custom Dark Blue Gradient
            border: 'none',
            color: '#fff',
            fontWeight: 600,
            borderRadius: '8px',
            letterSpacing: '0.5px',
            boxShadow: '0 4px 12px rgba(13, 110, 253, 0.3)', // soft blue glow
            transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
        Login
    </Link>

    {/* Register Button */}
    <Link to="/signup" className="btn btn-lg"
        style={{
            background: 'linear-gradient(90deg, #11998e 0%, #38ef7d 100%)', // Teal → Green gradient
            border: 'none',
            color: '#fff',
            fontWeight: 600,
            borderRadius: '8px',
            letterSpacing: '0.5px',
            boxShadow: '0 4px 12px rgba(25, 135, 84, 0.3)', // soft green glow
            transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
        Register
    </Link>
</div>

                </div>
            </div>
            
            
            {/* Footer */}
            <footer className="bg-white text-dark text-center py-3 mt-auto">
                <p className="mb-0" style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.9rem" }}>
                    © {new Date().getFullYear()} Vahanlink. All rights reserved.
                </p>
            </footer>
        </div>
    );
}

export default Home;

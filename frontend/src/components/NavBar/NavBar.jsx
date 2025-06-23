import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const navigate = useNavigate();

    return (
        <header>
            <div
                onClick={() => navigate("/")}
                style={{ cursor: "pointer" }}
                className="logo"
            >
                Centraliza
            </div>
            <nav>
            <a href="/login" >Login</a>
            </nav>
        </header>
    );
};

export default NavBar;
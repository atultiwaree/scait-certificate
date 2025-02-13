
import './App.css'
import CertificateForm from '../MainPage'


import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StudentResult from '../StudentResult';



export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/scait-certificate" element={<CertificateForm />} />
                <Route path="/scait-certificate/result" element={<StudentResult />} />
            </Routes>
        </Router>
    );
}

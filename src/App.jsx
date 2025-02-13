
import './App.css'
import CertificateForm from '../MainPage'


import React from "react";
import StudentResult from '../StudentResult';
import { HashRouter as Router, Route, Routes } from "react-router-dom";


export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<CertificateForm />} />
                <Route path="/result" element={<StudentResult />} />
            </Routes>
        </Router>
    );
}

import React, { useState, useEffect } from "react";
import './src/App.css'; // Ensure this path is correct

export default function CertificateForm() {
    const [formData, setFormData] = useState({
        enrollmentNumber: "",
        rollNumber: "",
        studentName: "",
        duration: "1 Year",
        fatherName: "",
        session: "",
        motherName: "",
        dob: "",
        courseName: "ADCA",
        subjects: [
            { name: "Computer Fundamental", theoryMarks: "", practicalMarks: "", grade: "" },
            { name: "Operating System, Typing", theoryMarks: "", practicalMarks: "", grade: "" },
            { name: "Ms Word, Excel, PowerPoint", theoryMarks: "", practicalMarks: "", grade: "" },
            { name: "Programming (HTML)", theoryMarks: "", practicalMarks: "", grade: "" },
            { name: "Photoshop, Corel Draw", theoryMarks: "", practicalMarks: "", grade: "" },
            { name: "Accounting, Tally", theoryMarks: "", practicalMarks: "", grade: "" }
        ],
        totalPercentage: "",
        overallGrade: "",
        dateOfIssue: "",
        photo: null,
        photoError: ""
    });

    // Function to calculate percentage and grade for each subject
    const calculatePercentageAndGrade = () => {
        const newSubjects = formData.subjects.map(subject => {
            const theory = parseFloat(subject.theoryMarks) || 0;
            const practical = parseFloat(subject.practicalMarks) || 0;
            const totalMarks = theory + practical;

            const percentage = ((totalMarks / 100) * 100).toFixed(2); // Assuming max marks per subject is 100

            // Assign grade based on percentage
            let grade;
            if (percentage >= 90) {
                grade = "A+";
            } else if (percentage >= 80) {
                grade = "A";
            } else if (percentage >= 70) {
                grade = "B";
            } else if (percentage >= 60) {
                grade = "C";
            } else if (percentage >= 50) {
                grade = "D";
            } else {
                grade = "F";
            }

            return { ...subject, grade };
        });

        // Update formData with new subjects and their grades
        setFormData(prevData => ({
            ...prevData,
            subjects: newSubjects
        }));
    };

    // Function to calculate total percentage and overall grade
    const calculateTotalPercentageAndGrade = () => {
        let totalMarks = 0;
        let maxMarks = formData.subjects.length * 100; // Assuming max marks per subject is 100

        formData.subjects.forEach(subject => {
            const theory = parseFloat(subject.theoryMarks) || 0;
            const practical = parseFloat(subject.practicalMarks) || 0;
            totalMarks += theory + practical;
        });

        const totalPercentage = ((totalMarks / maxMarks) * 100).toFixed(2);

        // Assign overall grade based on total percentage
        let overallGrade;
        if (totalPercentage >= 90) {
            overallGrade = "A+";
        } else if (totalPercentage >= 80) {
            overallGrade = "A";
        } else if (totalPercentage >= 70) {
            overallGrade = "B";
        } else if (totalPercentage >= 60) {
            overallGrade = "C";
        } else if (totalPercentage >= 50) {
            overallGrade = "D";
        } else {
            overallGrade = "F";
        }

        // Update formData with total percentage and overall grade
        setFormData(prevData => ({
            ...prevData,
            totalPercentage,
            overallGrade
        }));
    };

    // Recalculate percentage, grade, total percentage, and overall grade whenever marks change
    useEffect(() => {
        calculatePercentageAndGrade();
        calculateTotalPercentageAndGrade();
    }, [formData.subjects]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubjectChange = (index, type, value) => {
        const newSubjects = [...formData.subjects];
        newSubjects[index][type] = value;
        setFormData({ ...formData, subjects: newSubjects });
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const img = new Image();
            img.src = URL.createObjectURL(file);

            img.onload = () => {
                
                    setFormData(prevData => ({
                        ...prevData,
                        photo: file,
                        photoError: ""
                    }));
                
            };
        }
    };

    const handleGenerateCertificate = async () => {
        // Check if image is selected and valid
        if (formData.photoError) {
            alert("Please select a valid image (max 500x500 pixels).");
            return;
        }

        // Convert image to Base64
        const toBase64 = (file) =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });

        let photoBase64 = null;
        if (formData.photo) {
            photoBase64 = await toBase64(formData.photo);
        }

        // Prepare the data to match the required JSON format
        const formattedData = {
            ...formData,
            dob: new Date(formData.dob).toISOString(), // Convert dob to ISO string
            dateOfIssue: new Date(formData.dateOfIssue).toISOString(), // Convert dateOfIssue to ISO string
            photo: photoBase64 // Include the Base64 image
        };

        console.log(JSON.stringify(formattedData));

        try {
            const response = await fetch("https://scaitbackend.onrender.com/generate-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) throw new Error('Failed to generate certificate');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'certificate.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error generating certificate:", error);
            alert("Failed to generate the certificate. Please try again.");
        }
    };

    const handleGenerateDiploma = async () => {
        // Check if image is selected and valid
        if (formData.photoError) {
            alert("Please select a valid image (max 500x500 pixels).");
            return;
        }

        // Convert image to Base64
        const toBase64 = (file) =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });

        let photoBase64 = null;
        if (formData.photo) {
            photoBase64 = await toBase64(formData.photo);
        }

        // Prepare the data to match the required JSON format
        const formattedData = {
            ...formData,
            dob: new Date(formData.dob).toISOString(), // Convert dob to ISO string
            dateOfIssue: new Date(formData.dateOfIssue).toISOString(), // Convert dateOfIssue to ISO string
            photo: photoBase64 // Include the Base64 image
        };

        console.log(JSON.stringify(formattedData));

        try {
            const response = await fetch("https://scaitbackend.onrender.com/generate-diploma", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) throw new Error('Failed to generate diploma');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'diploma.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error generating diploma:", error);
            alert("Failed to generate the diploma. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center p-6">
            <h1 className="text-4xl font-bold text-blue-800 mb-8">Student Certificate Generator</h1>

            <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-3xl border border-blue-200">
                <div className="grid grid-cols-2 gap-6">
                    <input
                        name="enrollmentNumber"
                        value={formData.enrollmentNumber}
                        onChange={handleChange}
                        placeholder="Enrollment No."
                        className="p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                    />
                    <input
                        name="rollNumber"
                        value={formData.rollNumber}
                        onChange={handleChange}
                        placeholder="Roll No."
                        className="p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                    />
                    <input
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleChange}
                        placeholder="Student Name"
                        className="p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                    />
                    <input
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        placeholder="Father's Name"
                        className="p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                    />
                    <input
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleChange}
                        placeholder="Mother's Name"
                        className="p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                    />
                    <input
                        name="session"
                        value={formData.session}
                        onChange={handleChange}
                        placeholder="Session"
                        className="p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                    />
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 appearance-none"
                    />
                    <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                    >
                        <option value="1 Year">1 Year</option>
                        <option value="2 Years">2 Years</option>
                    </select>
                    <input
                        name="courseName"
                        value={formData.courseName}
                        onChange={handleChange}
                        placeholder="Course Name"
                        className="p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                    />
                    <input
                        type="date"
                        name="dateOfIssue"
                        value={formData.dateOfIssue}
                        onChange={handleChange}
                        className="p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 appearance-none"
                    />
                    <input
                        name="totalPercentage"
                        value={formData.totalPercentage}
                        onChange={handleChange}
                        placeholder="Total Percentage"
                        className="p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                        readOnly // Make this field read-only
                    />
                    <input
                        name="overallGrade"
                        value={formData.overallGrade}
                        onChange={handleChange}
                        placeholder="Overall Grade"
                        className="p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                        readOnly // Make this field read-only
                    />
                    {/* Image Input Field */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo (Max 500x500)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-gray-800 placeholder-gray-500"
                        />
                        {formData.photoError && (
                            <p className="text-red-500 text-sm mt-2">{formData.photoError}</p>
                        )}
                    </div>
                </div>

                <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">Subjects & Marks</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-blue-300">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="border p-3">Subject</th>
                                <th className="border p-3">Theory Marks</th>
                                <th className="border p-3">Practical Marks</th>
                                <th className="border p-3">Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.subjects.map((subject, index) => (
                                <tr key={index} className="hover:bg-blue-50 transition-colors">
                                    <td className="border p-3 text-gray-800">{subject.name}</td>
                                    <td className="border p-3">
                                        <input
                                            type="number"
                                            value={subject.theoryMarks}
                                            onChange={(e) => handleSubjectChange(index, "theoryMarks", e.target.value)}
                                            className="p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-gray-800 placeholder-gray-500"
                                            placeholder="Theory Marks"
                                        />
                                    </td>
                                    <td className="border p-3">
                                        <input
                                            type="number"
                                            value={subject.practicalMarks}
                                            onChange={(e) => handleSubjectChange(index, "practicalMarks", e.target.value)}
                                            className="p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-gray-800 placeholder-gray-500"
                                            placeholder="Practical Marks"
                                        />
                                    </td>
                                    <td className="border p-3 text-gray-800">
                                        {subject.grade}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 flex gap-4">
                    <button
                        onClick={handleGenerateCertificate}
                        className="w-1/2 bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                    >
                        Generate Certificate
                    </button>
                    <button
                        onClick={handleGenerateDiploma}
                        className="w-1/2 bg-green-600 text-white p-4 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
                    >
                        Generate Diploma
                    </button>
                </div>
            </div>
        </div>
    );
}
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DataTable from './components/DataTable';
import UploadScreen from './components/UploadScreen';

function App() {
    return (
        <Router>
            <div className="container mx-auto p-4 max-w-6xl">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Sistema de Pesquisas</h1>
                </header>
                <Routes>
                    <Route path="/" element={<DataTable />} />
                    <Route path="/upload" element={<UploadScreen />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { uploadFile } from './api';

function UploadScreen() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('Por favor, selecione um arquivo válido');
            setMessageType('error');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        try {
            setUploading(true);
            await uploadFile(formData);
            setMessage('Arquivo salvo com sucesso! Seu arquivo será processado em até 2 minutos');
            setMessageType('success');
            setFile(null);
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = '';
        } catch (error) {
            setMessage('Erro ao salvar arquivo: ' + error.message);
            setMessageType('error');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Upload de Arquivo</h2>
                    {/* Rota para voltar à tela da tabela */}
                    <Link to="/" className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition">
                        Voltar
                    </Link>
                </div>
                {message && (
                    <div className={`p-4 mb-4 rounded ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Selecionar arquivo:</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button type="submit" disabled={uploading} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                            {uploading ? 'Enviando...' : 'Enviar Arquivo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UploadScreen;

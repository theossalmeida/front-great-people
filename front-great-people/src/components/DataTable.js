import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPesquisas, saveNota, deleteNota } from './api';

function DataTable() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [newItemDialog, setNewItemDialog] = useState(false);
    const [editDialog, setEditDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [newNota, setNewNota] = useState({
        nome_pesquisa: '',
        created_date: new Date().toLocaleDateString(),
        nota_1: 0,
        nota_2: 0,
        media_pesquisa: 0
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        if (data.length > 0) {
            const results = data.filter(item =>
                item.nome_pesquisa.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredData(results);
            setCurrentPage(1);
        }
    }, [searchTerm, data]);

    useEffect(() => {
        const media = (parseFloat(newNota.nota_1) + parseFloat(newNota.nota_2)) / 2;
        setNewNota({ ...newNota, media_pesquisa: media });
    }, [newNota.nota_1, newNota.nota_2]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const pesquisasData = await fetchPesquisas();
            setData(pesquisasData);
            setFilteredData(pesquisasData);
            setLoading(false);
        } catch (err) {
            setError('Erro ao buscar dados: ' + err.message);
            setLoading(false);
        }
    };

    const handleSaveNewNota = async () => {
        try {
            await saveNota({ ...newNota, created_date: new Date().toLocaleDateString() });
            setNewItemDialog(false);
            resetForm();
            fetchData();
        } catch (e) {
            console.error(e);
            setError('Erro ao salvar: ' + e.message);
        }
    };

    const handleEditItem = async () => {
        try {
            await saveNota(currentItem);
            setEditDialog(false);
            fetchData();
        } catch (e) {
            console.error(e);
            setError('Erro ao editar: ' + e.message);
        }
    };

    const handleDeleteItem = async () => {
        try {
            await deleteNota(currentItem.id);
            setDeleteDialog(false);
            fetchData();
        } catch (e) {
            console.error(e);
            setError('Erro ao deletar: ' + e.message);
        }
    };

    const resetForm = () => {
        setNewNota({
            nome_pesquisa: '',
            created_date: new Date().toLocaleDateString(),
            nota_1: 0,
            nota_2: 0,
            media_pesquisa: 0
        });
    };

    const handleOpenEdit = (item) => {
        setCurrentItem(item);
        setEditDialog(true);
    };

    const handleOpenDelete = (item) => {
        setCurrentItem(item);
        setDeleteDialog(true);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p className="font-bold">Erro</p>
            <p>{error}</p>
            <button onClick={setError(false)} className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded">
                Voltar
            </button>
        </div>
    );

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Resultados das Pesquisas</h2>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <button onClick={fetchData} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        Atualizar
                    </button>
                    <input
                        type="text"
                        placeholder="Buscar por código da pesquisa..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="p-2 pl-10 pr-10 border rounded w-full md:w-64 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700">
                            ×
                        </button>
                    )}
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setNewItemDialog(true)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Nova Pesquisa
                    </button>
                    <Link to="/upload" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        Upload
                    </Link>
                </div>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome Pesquisa</th>
                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nota 1</th>
                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nota 2</th>
                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Média</th>
                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.length > 0 ? (
                        currentItems.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="py-3 px-4 whitespace-nowrap font-medium text-gray-900">{item.nome_pesquisa}</td>
                                <td className="py-3 px-4 whitespace-nowrap text-center">{item.nota_1}</td>
                                <td className="py-3 px-4 whitespace-nowrap text-center">{item.nota_2}</td>
                                <td className="py-3 px-4 whitespace-nowrap text-center font-medium">
                    <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.media_pesquisa ? item.media_pesquisa.toFixed(1) : 0}
                    </span>
                                </td>
                                <td className="py-3 px-4 whitespace-nowrap text-center text-sm font-medium">
                                    <div className="flex justify-center space-x-2">
                                        <button onClick={() => handleOpenEdit(item)} className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-100" title="Editar">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                        </button>
                                        <button onClick={() => handleOpenDelete(item)} className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100" title="Excluir">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="py-6 px-4 text-center text-gray-500">
                                {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum dado disponível'}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            {filteredData.length > 0 && (
                <div className="flex justify-between items-center mt-4">
                    <div>
            <span className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                            className="p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                        >
                            <option value={5}>5 por página</option>
                            <option value={10}>10 por página</option>
                        </select>
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition disabled:opacity-50"
                        >
                            Próximo
                        </button>
                    </div>
                </div>
            )}
            {newItemDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Adicionar Novo Resultado</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleSaveNewNota(); }}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Código da Pesquisa</label>
                                <input
                                    type="text"
                                    required
                                    value={newNota.nome_pesquisa}
                                    onChange={(e) => setNewNota({ ...newNota, nome_pesquisa: e.target.value })}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nota 1</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        value={newNota.nota_1}
                                        onChange={(e) => setNewNota({ ...newNota, nota_1: parseFloat(e.target.value) })}
                                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nota 2</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        value={newNota.nota_2}
                                        onChange={(e) => setNewNota({ ...newNota, nota_2: parseFloat(e.target.value) })}
                                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Média Calculada</label>
                                <div className="w-full p-2 border rounded bg-gray-50 text-gray-700">
                                    {newNota.media_pesquisa.toFixed(1)}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setNewItemDialog(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition">
                                    Cancelar
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                                    Salvar Pesquisa
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {editDialog && currentItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Editar Resultado</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleEditItem(); }}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Código da Pesquisa</label>
                                <input
                                    type="text"
                                    required
                                    value={currentItem.nome_pesquisa}
                                    onChange={(e) => setCurrentItem({ ...currentItem, nome_pesquisa: e.target.value })}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nota 1</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        max="10"
                                        step="0.1"
                                        value={currentItem.nota_1}
                                        onChange={(e) => {
                                            const nota1 = parseFloat(e.target.value);
                                            const nota2 = currentItem.nota_2;
                                            const media = (nota1 + nota2) / 2;
                                            setCurrentItem({ ...currentItem, nota_1: nota1, media_pesquisa: media });
                                        }}
                                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nota 2</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        max="10"
                                        step="0.1"
                                        value={currentItem.nota_2}
                                        onChange={(e) => {
                                            const nota2 = parseFloat(e.target.value);
                                            const nota1 = currentItem.nota_1;
                                            const media = (nota1 + nota2) / 2;
                                            setCurrentItem({ ...currentItem, nota_2: nota2, media_pesquisa: media });
                                        }}
                                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Média Calculada</label>
                                <div className="w-full p-2 border rounded bg-gray-50 text-gray-700">
                                    {currentItem.media_pesquisa ? currentItem.media_pesquisa.toFixed(1) : 0}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setEditDialog(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition">
                                    Cancelar
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {deleteDialog && currentItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Confirmar Exclusão</h2>
                        <p className="mb-6 text-gray-600">
                            Tem certeza que deseja excluir a pesquisa <strong>{currentItem.nome_pesquisa}</strong>? Esta ação não poderá ser desfeita.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setDeleteDialog(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition">
                                Cancelar
                            </button>
                            <button onClick={handleDeleteItem} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DataTable;

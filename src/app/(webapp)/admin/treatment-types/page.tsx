'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, Loader2, X, AlertCircle } from 'lucide-react';

interface TreatmentType {
    _id: string;
    name: string;
    price: number;
    description?: string;
    isActive: boolean;
}

export default function TreatmentTypesPage() {
    const [treatmentTypes, setTreatmentTypes] = useState<TreatmentType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingType, setEditingType] = useState<TreatmentType | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        isActive: true,
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTreatmentTypes();
    }, []);

    const fetchTreatmentTypes = async () => {
        try {
            const response = await fetch('/api/treatment-types');
            const data = await response.json();
            if (data.success) {
                setTreatmentTypes(data.data);
            }
        } catch (error) {
            console.error('Error fetching treatment types:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (type?: TreatmentType) => {
        if (type) {
            setEditingType(type);
            setFormData({
                name: type.name,
                price: type.price.toString(),
                description: type.description || '',
                isActive: type.isActive,
            });
        } else {
            setEditingType(null);
            setFormData({
                name: '',
                price: '',
                description: '',
                isActive: true,
            });
        }
        setError('');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const url = editingType
                ? `/api/treatment-types/${editingType._id}`
                : '/api/treatment-types';

            const method = editingType ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsModalOpen(false);
                fetchTreatmentTypes();
            } else {
                setError(data.error || 'Operation failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this treatment type? This action cannot be undone.')) return;

        try {
            const response = await fetch(`/api/treatment-types/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchTreatmentTypes();
            } else {
                alert('Failed to delete treatment type');
            }
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const filteredTypes = treatmentTypes.filter(type =>
        type.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Treatment Types</h1>
                    <p className="text-gray-600">Manage dental services and pricing</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-[#4A90D9] text-white px-4 py-2 rounded-xl hover:bg-[#357abd] transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add New Type
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search treatment types..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Price (₹)</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#4A90D9]" />
                                    </td>
                                </tr>
                            ) : filteredTypes.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No treatment types found.
                                    </td>
                                </tr>
                            ) : (
                                filteredTypes.map((type) => (
                                    <tr key={type._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{type.name}</div>
                                            {type.description && (
                                                <div className="text-sm text-gray-500">{type.description}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">
                                            ₹{type.price.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${type.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {type.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(type)}
                                                    className="p-2 text-gray-400 hover:text-[#4A90D9] hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(type._id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingType ? 'Edit Treatment Type' : 'Add Treatment Type'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent"
                                    min="0"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent"
                                    rows={3}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="rounded border-gray-300 text-[#4A90D9] focus:ring-[#4A90D9]"
                                />
                                <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#4A90D9] text-white py-3 rounded-xl font-semibold hover:bg-[#357abd] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Treatment Type'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

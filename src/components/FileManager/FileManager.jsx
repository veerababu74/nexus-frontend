import React, { useState, useRef } from 'react';
import { uploadDocument, deleteDocument, getAllKnowledgeRecords } from '../../api/documentAPI';
import './FileManager.css';


const FileManager = () => {
    const [files, setFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [sortBy, setSortBy] = useState('CreatedOn');
    const [sortOrder, setSortOrder] = useState('desc');
    const fileInputRef = useRef(null);

    React.useEffect(() => {
        const fetchFiles = async () => {
            const res = await getAllKnowledgeRecords();
            if (res?.success && Array.isArray(res.response)) {
                const mappedFiles = res.response.map(doc => ({
                    Title: doc.FileName.split('.')[0],
                    FileName: doc.FileName,
                    Hyperlink: doc.BlobUrl,
                    Tags: doc.Tags ? doc.Tags.split(',') : [],
                    FileUniqueId: doc.FileUniqueId,
                    CreatedOn: doc.CreatedDate,
                }));
                setFiles(mappedFiles);
            }
        };
        fetchFiles();
    }, []);

    const handleFileUpload = async (event) => {
        const selectedFiles = Array.from(event.target.files);
        for (const file of selectedFiles) {
            const index_name = 'my_index'; // You may want to make this dynamic
            const tag = undefined;
            try {
                const res = await uploadDocument({ file, index_name, tag });
                if (res?.res?.knowledge_api?.success) {
                    const doc = res.res.knowledge_api.response;
                    const newFile = {
                        Title: doc.FileName.split('.')[0],
                        FileName: doc.FileName,
                        Hyperlink: doc.BlobUrl,
                        Tags: doc.Tags ? doc.Tags.split(',') : ['uploaded'],
                        FileUniqueId: doc.FileUniqueId,
                        CreatedOn: new Date().toISOString(),
                    };
                    setFiles(prev => [newFile, ...prev]);
                    setUploadedFiles(prev => [...prev, newFile]);
                } else {
                    alert(res?.detail || 'Upload failed');
                }
            } catch (err) {
                alert('Upload error');
            }
        }
    };

    const handleDelete = async (fileUniqueId) => {
        const index_name = 'my_index'; // You may want to make this dynamic
        try {
            const res = await deleteDocument({ index_name, file_unique_id: fileUniqueId });
            if (res?.status === 'Success') {
                setFiles(prev => prev.filter(f => f.FileUniqueId !== fileUniqueId));
                alert('File deleted successfully');
            } else {
                alert(res?.detail || 'Delete failed');
            }
        } catch (err) {
            alert('Delete error');
        }
    };

    const getFileType = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf': return 'pdf';
            case 'doc':
            case 'docx': return 'document';
            case 'txt': return 'text';
            case 'xls':
            case 'xlsx': return 'spreadsheet';
            case 'ppt':
            case 'pptx': return 'presentation';
            default: return 'file';
        }
    };

    const generateUniqueId = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf': return '📄';
            case 'doc':
            case 'docx': return '📝';
            case 'txt': return '📋';
            case 'xls':
            case 'xlsx': return '📊';
            case 'ppt':
            case 'pptx': return '📈';
            default: return '📎';
        }
    };

    const getAllTags = () => {
        const allTags = files.flatMap(file => file.Tags);
        return [...new Set(allTags)];
    };

    const filteredFiles = files.filter(file => {
        const matchesSearch = file.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            file.FileName.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    const sortedFiles = [...filteredFiles].sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];

        if (sortOrder === 'desc') {
            return bVal.localeCompare(aVal);
        }
        return aVal.localeCompare(bVal);
    });

    const handleTagToggle = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const clearFilters = () => {
        setSearchTerm('');
    };

    return (
        <div className="file-manager-container">
            {/* Header */}
            <div className="file-manager-header">
                <div className="header-content">
                    <h1>📁 Document Manager</h1>
                    <p>Upload and manage your documents with intelligent organization</p>
                </div>
                <div className="header-stats">
                    <div className="stat-badge">
                        📊 {files.length} files
                    </div>
                    <div className="stat-badge">
                        ⬆️ {uploadedFiles.length} uploaded
                    </div>
                </div>
            </div>

            {/* Upload Section */}
            <div className="upload-section">
                <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
                    <div className="upload-icon">📤</div>
                    <div className="upload-text">
                        <h3>Upload Documents</h3>
                        <p>Drag and drop files here or click to browse</p>
                        <span className="upload-hint">Supports PDF, Word, Text, Excel, PowerPoint files</span>
                    </div>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                />
            </div>

            {/* Search and Filter Section */}
            <div className="filters-section">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="🔍 Search files by title or filename..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-controls">
                    <div className="sort-controls">
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="Title">Title</option>
                            <option value="FileName">File Name</option>
                        </select>
                        <button
                            className="sort-order-btn"
                            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                        >
                            {sortOrder === 'desc' ? '⬇️' : '⬆️'}
                        </button>
                    </div>

                    {searchTerm && (
                        <button className="clear-filters-btn" onClick={clearFilters}>
                            🗑️ Clear Search
                        </button>
                    )}
                </div>
            </div>

            {/* Files Grid */}
            <div className="files-grid">
                {sortedFiles.length === 0 ? (
                    <div className="no-files">
                        <div className="no-files-icon">📂</div>
                        <h3>No files found</h3>
                        <p>Try adjusting your filters or upload some documents</p>
                    </div>
                ) : (
                    <div className="grid-container">
                        <div className="grid-header">
                            <div className="grid-cell">ID</div>
                            <div className="grid-cell">Created</div>
                            <div className="grid-cell">Title</div>
                            <div className="grid-cell">File Name</div>
                            <div className="grid-cell">Tags</div>
                            <div className="grid-cell">Link</div>
                        </div>

                        {sortedFiles.map((file) => (
                            <div key={file.FileUniqueId} className="grid-row">
                                <div className="grid-cell id-cell">
                                    <span className="file-id">{file.FileUniqueId.slice(0, 8)}...</span>
                                </div>
                                <div className="grid-cell date-cell">
                                    {formatDate(file.CreatedOn)}
                                </div>
                                <div className="grid-cell title-cell">
                                    {file.Title}
                                </div>
                                <div className="grid-cell file-info">
                                    <span className="file-icon">{getFileIcon(file.FileName)}</span>
                                    <span className="file-name">{file.FileName}</span>
                                </div>
                                <div className="grid-cell tags-cell">
                                    {file.Tags.map((tag, index) => (
                                        <span key={index} className="file-tag">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="grid-cell link-cell">
                                    <a
                                        href={file.Hyperlink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="file-link"
                                    >
                                        🔗 Link
                                    </a>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(file.FileUniqueId)}
                                        style={{ marginLeft: '8px' }}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileManager;

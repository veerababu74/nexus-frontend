import React, { useState, useRef } from 'react';
import { uploadDocument, deleteDocument, getAllKnowledgeRecords } from '../../api/documentAPI';
import { useTheme } from '../../contexts/ThemeContext';
import { FiUpload, FiFile, FiTrash2, FiLoader, FiCheck, FiX, FiSearch, FiFilter } from 'react-icons/fi';
import './FileManager.css';


const FileManager = () => {
    const { theme } = useTheme();
    const [files, setFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [sortBy, setSortBy] = useState('CreatedOn');
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [message, setMessage] = useState('');
    const fileInputRef = useRef(null);

    React.useEffect(() => {
        const fetchFiles = async () => {
            try {
                const res = await getAllKnowledgeRecords();
                if (res?.success && Array.isArray(res.response)) {
                    const mappedFiles = res.response.map(doc => ({
                        Title: doc.FileName ? doc.FileName.split('.')[0] : 'Untitled',
                        FileName: doc.FileName || 'Unknown',
                        Hyperlink: doc.BlobUrl || '#',
                        Tags: doc.Tags ? doc.Tags.split(',').filter(tag => tag.trim()) : [],
                        FileUniqueId: doc.FileUniqueId || `temp-${Date.now()}`,
                        CreatedOn: doc.CreatedDate || new Date().toISOString(),
                    }));
                    setFiles(mappedFiles);
                } else {
                    console.error('Failed to fetch files:', res?.error || 'Unknown error');
                }
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };
        fetchFiles();
    }, []);

    // Auto-hide message after 3 seconds
    React.useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleFileSelection = (event) => {
        const newFiles = Array.from(event.target.files);
        setSelectedFiles(newFiles);
        setMessage(`${newFiles.length} file(s) selected`);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            setMessage('Please select files first');
            return;
        }

        setIsUploading(true);
        const progress = {};
        
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const fileId = `file-${i}`;
            
            try {
                progress[fileId] = 0;
                setUploadProgress({ ...progress });
                
                const index_name = 'veera';
                const tag = undefined;
                
                // Simulate progress
                const progressInterval = setInterval(() => {
                    progress[fileId] = Math.min(progress[fileId] + 10, 90);
                    setUploadProgress({ ...progress });
                }, 200);
                
                const res = await uploadDocument({ file, index_name, tag });
                
                clearInterval(progressInterval);
                progress[fileId] = 100;
                setUploadProgress({ ...progress });
                
                if (res?.res?.knowledge_api?.success) {
                    const doc = res.res.knowledge_api.response;
                    const newFile = {
                        Title: doc.FileName ? doc.FileName.split('.')[0] : file.name.split('.')[0],
                        FileName: doc.FileName || file.name,
                        Hyperlink: doc.BlobUrl || '#',
                        Tags: doc.Tags ? doc.Tags.split(',').filter(tag => tag.trim()) : ['uploaded'],
                        FileUniqueId: doc.FileUniqueId || `temp-${Date.now()}`,
                        CreatedOn: new Date().toISOString(),
                    };
                    setFiles(prev => [newFile, ...prev]);
                    setUploadedFiles(prev => [...prev, newFile]);
                } else {
                    console.error('Upload failed:', res?.detail || 'Unknown error');
                    setMessage(res?.detail || 'Upload failed');
                }
            } catch (err) {
                console.error('Upload error:', err);
                setMessage('Upload error: ' + (err.message || 'Unknown error'));
            }
        }
        
        setIsUploading(false);
        setSelectedFiles([]);
        setUploadProgress({});
        setMessage('Upload completed successfully!');
        
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (fileUniqueId) => {
        const index_name = 'veera';
        try {
            const res = await deleteDocument({ index_name, file_unique_id: fileUniqueId });
            if (res?.status === 'Success') {
                setFiles(prev => prev.filter(f => f.FileUniqueId !== fileUniqueId));
                setMessage('File deleted successfully');
            } else {
                console.error('Delete failed:', res?.detail || 'Unknown error');
                setMessage(res?.detail || 'Delete failed');
            }
        } catch (err) {
            console.error('Delete error:', err);
            setMessage('Delete error: ' + (err.message || 'Unknown error'));
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
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid Date';
        }
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
        const aVal = a[sortBy] || '';
        const bVal = b[sortBy] || '';

        // Handle undefined/null values
        if (!aVal && !bVal) return 0;
        if (!aVal) return 1;
        if (!bVal) return -1;

        // Convert to strings to ensure localeCompare works
        const aStr = String(aVal);
        const bStr = String(bVal);

        if (sortOrder === 'desc') {
            return bStr.localeCompare(aStr);
        }
        return aStr.localeCompare(bStr);
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
        <div className="file-manager-container" style={{ 
            backgroundColor: theme.colors.background,
            color: theme.colors.textPrimary 
        }}>
            {/* Message Bar */}
            {message && (
                <div className="message-bar" style={{
                    backgroundColor: theme.colors.surface,
                    border: `1px solid ${theme.colors.border}`,
                    color: theme.colors.textPrimary
                }}>
                    <FiCheck size={16} style={{ color: theme.colors.primary }} />
                    {message}
                </div>
            )}

            {/* Header */}
            <div className="file-manager-header" style={{
                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                borderBottom: `1px solid ${theme.colors.border}`
            }}>
                <div className="header-content">
                    <h1>📁 Document Manager</h1>
                    <p>Upload and manage your documents with intelligent organization</p>
                </div>
                <div className="header-stats">
                    <div className="stat-badge">
                        📊 {files.length} total files
                    </div>
                    <div className="stat-badge">
                        📤 {uploadedFiles.length} uploaded
                    </div>
                    {selectedFiles.length > 0 && (
                        <div className="stat-badge">
                            🎯 {selectedFiles.length} selected
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Section */}
            <div className="upload-section" style={{
                backgroundColor: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`
            }}>
                <div className="upload-controls">
                    {/* File Selection */}
                    <div className="file-input-container">
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
                            onChange={handleFileSelection}
                            style={{ display: 'none' }}
                            id="file-upload"
                        />
                        <label 
                            htmlFor="file-upload" 
                            className="file-input-label"
                            style={{
                                backgroundColor: theme.colors.hover,
                                border: `2px dashed ${theme.colors.border}`,
                                color: theme.colors.textSecondary
                            }}
                        >
                            <FiFile size={24} style={{ color: theme.colors.primary }} />
                            <span>Choose Files</span>
                            <small>Select documents to upload</small>
                        </label>
                    </div>

                    {/* Upload Button */}
                    <button
                        className="upload-button"
                        onClick={handleUpload}
                        disabled={selectedFiles.length === 0 || isUploading}
                        style={{
                            backgroundColor: selectedFiles.length > 0 && !isUploading ? theme.colors.primary : theme.colors.hover,
                            color: selectedFiles.length > 0 && !isUploading ? theme.colors.onPrimary : theme.colors.textSecondary,
                            border: `1px solid ${theme.colors.border}`
                        }}
                    >
                        {isUploading ? (
                            <>
                                <FiLoader className="spin" size={20} />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <FiUpload size={20} />
                                Train
                            </>
                        )}
                    </button>
                </div>

                {/* Selected Files Preview */}
                {selectedFiles.length > 0 && (
                    <div className="selected-files-preview">
                        <h4 style={{ color: theme.colors.textPrimary, marginBottom: '1rem' }}>
                            Selected Files ({selectedFiles.length})
                        </h4>
                        <div className="selected-files-grid">
                            {selectedFiles.map((file, index) => {
                                const fileId = `file-${index}`;
                                const progress = uploadProgress[fileId] || 0;
                                return (
                                    <div 
                                        key={index} 
                                        className="selected-file-item"
                                        style={{
                                            backgroundColor: theme.colors.background,
                                            border: `1px solid ${theme.colors.border}`
                                        }}
                                    >
                                        <div className="file-info">
                                            <span className="file-icon">{getFileIcon(file.name)}</span>
                                            <div className="file-details">
                                                <span className="file-name" style={{ color: theme.colors.textPrimary }}>
                                                    {file.name}
                                                </span>
                                                <span className="file-size" style={{ color: theme.colors.textSecondary }}>
                                                    {formatFileSize(file.size)}
                                                </span>
                                            </div>
                                        </div>
                                        {isUploading && progress > 0 && (
                                            <div className="upload-progress">
                                                <div 
                                                    className="progress-bar"
                                                    style={{
                                                        backgroundColor: theme.colors.hover,
                                                        borderRadius: '4px',
                                                        height: '4px',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    <div 
                                                        className="progress-fill"
                                                        style={{
                                                            backgroundColor: theme.colors.primary,
                                                            height: '100%',
                                                            width: `${progress}%`,
                                                            transition: 'width 0.3s ease'
                                                        }}
                                                    />
                                                </div>
                                                <span style={{ 
                                                    fontSize: '0.7rem', 
                                                    color: theme.colors.textSecondary 
                                                }}>
                                                    {progress}%
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Search and Filter Section */}
            <div className="filters-section">
                <div className="search-bar">
                    <FiSearch size={20} style={{ color: theme.colors.textSecondary }} />
                    <input
                        type="text"
                        placeholder="Search files by title or filename..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            backgroundColor: 'transparent',
                            color: theme.colors.textPrimary
                        }}
                    />
                </div>

                <div className="filter-controls">
                    <div className="sort-controls">
                        <FiFilter size={16} style={{ color: theme.colors.textSecondary }} />
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{
                                backgroundColor: theme.colors.surface,
                                border: `1px solid ${theme.colors.border}`,
                                color: theme.colors.textPrimary
                            }}
                        >
                            <option value="Title">Sort by Title</option>
                            <option value="FileName">Sort by File Name</option>
                            <option value="CreatedOn">Sort by Date</option>
                        </select>
                        <button
                            className="sort-order-btn"
                            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                            style={{
                                backgroundColor: theme.colors.surface,
                                border: `1px solid ${theme.colors.border}`,
                                color: theme.colors.textPrimary
                            }}
                            title={`Sort ${sortOrder === 'desc' ? 'Ascending' : 'Descending'}`}
                        >
                            {sortOrder === 'desc' ? '⬇️' : '⬆️'}
                        </button>
                    </div>

                    {searchTerm && (
                        <button 
                            className="clear-filters-btn" 
                            onClick={clearFilters}
                            style={{
                                backgroundColor: theme.colors.hover,
                                border: `1px solid ${theme.colors.border}`,
                                color: theme.colors.textPrimary
                            }}
                        >
                            <FiX size={16} />
                            Clear Search
                        </button>
                    )}
                </div>
            </div>

            {/* Files Grid */}
            <div className="files-grid">
                {sortedFiles.length === 0 ? (
                    <div className="no-files" style={{ color: theme.colors.textSecondary }}>
                        <div className="no-files-icon">📂</div>
                        <h3 style={{ color: theme.colors.textPrimary }}>No files found</h3>
                        <p>Try adjusting your filters or upload some documents</p>
                    </div>
                ) : (
                    <div className="grid-container" style={{
                        backgroundColor: theme.colors.surface,
                        border: `1px solid ${theme.colors.border}`
                    }}>
                        <div className="grid-header" style={{
                            backgroundColor: theme.colors.hover,
                            borderBottom: `1px solid ${theme.colors.border}`,
                            color: theme.colors.textPrimary
                        }}>
                            <div className="grid-cell">File ID</div>
                            <div className="grid-cell">Created Date</div>
                            <div className="grid-cell">Title</div>
                            <div className="grid-cell">File Name</div>
                            <div className="grid-cell">Tags</div>
                            <div className="grid-cell">Actions</div>
                        </div>

                        {sortedFiles.map((file) => (
                            <div 
                                key={file.FileUniqueId} 
                                className="grid-row"
                                style={{
                                    borderBottom: `1px solid ${theme.colors.border}`,
                                    '&:hover': {
                                        backgroundColor: theme.colors.hover
                                    }
                                }}
                            >
                                <div className="grid-cell id-cell">
                                    <span 
                                        className="file-id"
                                        style={{ color: theme.colors.textSecondary }}
                                    >
                                        {file.FileUniqueId.slice(0, 8)}...
                                    </span>
                                </div>
                                <div className="grid-cell date-cell">
                                    <span style={{ color: theme.colors.textSecondary }}>
                                        {formatDate(file.CreatedOn)}
                                    </span>
                                </div>
                                <div className="grid-cell title-cell">
                                    <span style={{ color: theme.colors.textPrimary, fontWeight: 500 }}>
                                        {file.Title}
                                    </span>
                                </div>
                                <div className="grid-cell file-info">
                                    <span className="file-icon">{getFileIcon(file.FileName)}</span>
                                    <span className="file-name" style={{ color: theme.colors.textPrimary }}>
                                        {file.FileName}
                                    </span>
                                </div>
                                <div className="grid-cell tags-cell">
                                    {file.Tags.map((tag, index) => (
                                        <span 
                                            key={index} 
                                            className="file-tag"
                                            style={{
                                                backgroundColor: theme.colors.hover,
                                                border: `1px solid ${theme.colors.border}`,
                                                color: theme.colors.textPrimary
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="grid-cell actions-cell">
                                    <a
                                        href={file.Hyperlink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="action-btn view-btn"
                                        style={{
                                            backgroundColor: theme.colors.primary,
                                            color: theme.colors.onPrimary,
                                            border: `1px solid ${theme.colors.primary}`
                                        }}
                                    >
                                        View
                                    </a>
                                    <button
                                        className="action-btn delete-btn"
                                        onClick={() => handleDelete(file.FileUniqueId)}
                                        style={{
                                            backgroundColor: 'transparent',
                                            color: '#ff4757',
                                            border: '1px solid #ff4757'
                                        }}
                                    >
                                        <FiTrash2 size={14} />
                                        Delete
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

import React, { useState, useRef } from 'react';
import './FileManager.css';

const FileManager = () => {
    const [files, setFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [sortBy, setSortBy] = useState('CreatedOn');
    const [sortOrder, setSortOrder] = useState('desc');
    const fileInputRef = useRef(null);

    // Mock data for demonstration
    const mockData = [
        {
            "Title": "Q1 Financial Summary",
            "FileName": "Report_Q1.pdf",
            "Hyperlink": "https://example.com/files/Report_Q1.pdf",
            "Tags": ["finance", "q1", "report"],
            "FileUniqueId": "a1b2c3d4-e5f6-7890-ab12-cd34ef567890",
            "CreatedOn": "2025-01-15T10:30:00Z"
        },
        {
            "Title": "Weekly Team Meeting Notes",
            "FileName": "Team_Meeting_Notes.docx",
            "Hyperlink": "https://example.com/files/Team_Meeting_Notes.docx",
            "Tags": ["meeting", "team", "notes"],
            "FileUniqueId": "b2c3d4e5-f678-9012-ab34-cd56ef789012",
            "CreatedOn": "2025-01-22T14:00:00Z"
        },
        {
            "Title": "2025 Marketing Strategy",
            "FileName": "Marketing_Strategy.pptx",
            "Hyperlink": "https://example.com/files/Marketing_Strategy.pptx",
            "Tags": ["marketing", "strategy", "plan"],
            "FileUniqueId": "c3d4e5f6-7890-1234-ab56-cd78ef901234",
            "CreatedOn": "2025-02-01T09:15:00Z"
        },
        {
            "Title": "Product Design Specifications",
            "FileName": "Product_Design_Specs.pdf",
            "Hyperlink": "https://example.com/files/Product_Design_Specs.pdf",
            "Tags": ["product", "design", "specs"],
            "FileUniqueId": "d4e5f678-9012-3456-ab78-cd90ef123456",
            "CreatedOn": "2025-02-05T16:45:00Z"
        },
        {
            "Title": "HR Policy Guidelines",
            "FileName": "HR_Policies.docx",
            "Hyperlink": "https://example.com/files/HR_Policies.docx",
            "Tags": ["hr", "policies", "compliance"],
            "FileUniqueId": "e5f67890-1234-5678-ab90-cd12ef345678",
            "CreatedOn": "2025-02-10T11:20:00Z"
        },
        {
            "Title": "Customer Feedback Insights",
            "FileName": "Customer_Feedback.xlsx",
            "Hyperlink": "https://example.com/files/Customer_Feedback.xlsx",
            "Tags": ["customer", "feedback", "survey"],
            "FileUniqueId": "f6789012-3456-7890-ab12-cd34ef567890",
            "CreatedOn": "2025-02-15T13:10:00Z"
        },
        {
            "Title": "Annual Performance Report 2024",
            "FileName": "Annual_Report_2024.pdf",
            "Hyperlink": "https://example.com/files/Annual_Report_2024.pdf",
            "Tags": ["annual", "report", "performance"],
            "FileUniqueId": "01234567-89ab-cdef-0123-456789abcdef",
            "CreatedOn": "2025-02-20T08:55:00Z"
        },
        {
            "Title": "Employee Training Material",
            "FileName": "Training_Material.pptx",
            "Hyperlink": "https://example.com/files/Training_Material.pptx",
            "Tags": ["training", "employee", "learning"],
            "FileUniqueId": "12345678-9abc-def0-1234-56789abcdef0",
            "CreatedOn": "2025-02-25T15:30:00Z"
        },
        {
            "Title": "Project Timeline Overview",
            "FileName": "Project_Timeline.xlsx",
            "Hyperlink": "https://example.com/files/Project_Timeline.xlsx",
            "Tags": ["project", "timeline", "planning"],
            "FileUniqueId": "23456789-abcd-ef01-2345-6789abcdef01",
            "CreatedOn": "2025-03-01T12:40:00Z"
        },
        {
            "Title": "Legal Agreement Draft",
            "FileName": "Legal_Agreement.pdf",
            "Hyperlink": "https://example.com/files/Legal_Agreement.pdf",
            "Tags": ["legal", "agreement", "contract"],
            "FileUniqueId": "3456789a-bcde-f012-3456-789abcdef012",
            "CreatedOn": "2025-03-05T17:05:00Z"
        }
    ];

    React.useEffect(() => {
        setFiles(mockData);
    }, []);

    const handleFileUpload = (event) => {
        const selectedFiles = Array.from(event.target.files);

        selectedFiles.forEach(file => {
            const newFile = {
                Title: file.name.split('.')[0],
                FileName: file.name,
                Hyperlink: URL.createObjectURL(file),
                Tags: [getFileType(file.name), "uploaded"],
                FileUniqueId: generateUniqueId(),
                CreatedOn: new Date().toISOString(),
                file: file
            };

            setFiles(prev => [newFile, ...prev]);
            setUploadedFiles(prev => [...prev, newFile]);
        });
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

import React from 'react';
import { FileIcon, Trash2Icon, DownloadIcon, Loader2Icon, ImageIcon, FileTextIcon, FileVideoIcon, FileAudioIcon, FileSpreadsheetIcon, PresentationIcon as FilePresentationIcon, FileCodeIcon, FileArchiveIcon, FolderIcon } from 'lucide-react';
import { GoogleFile } from '../types';

interface FileListProps {
  files: GoogleFile[];
  onDelete: (fileId: string) => void;
  onDownload: (file: GoogleFile) => void;
  isDeleting: { [key: string]: boolean };
}

const getFileTypeInfo = (mimeType: string) => {
  // Image types
  if (mimeType.startsWith('image/')) {
    return {
      icon: <ImageIcon className="h-5 w-5 text-blue-500" />,
      label: mimeType.split('/')[1].toUpperCase()
    };
  }
  
  // Document types
  if (mimeType === 'application/pdf') {
    return {
      icon: <FileTextIcon className="h-5 w-5 text-red-500" />,
      label: 'PDF'
    };
  }
  
  if (mimeType.includes('document') || mimeType.includes('msword')) {
    return {
      icon: <FileTextIcon className="h-5 w-5 text-blue-600" />,
      label: 'Document'
    };
  }
  
  // Spreadsheet types
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
    return {
      icon: <FileSpreadsheetIcon className="h-5 w-5 text-green-600" />,
      label: 'Spreadsheet'
    };
  }
  
  // Presentation types
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
    return {
      icon: <FilePresentationIcon className="h-5 w-5 text-orange-500" />,
      label: 'Presentation'
    };
  }
  
  // Video types
  if (mimeType.startsWith('video/')) {
    return {
      icon: <FileVideoIcon className="h-5 w-5 text-purple-500" />,
      label: 'Video'
    };
  }
  
  // Audio types
  if (mimeType.startsWith('audio/')) {
    return {
      icon: <FileAudioIcon className="h-5 w-5 text-pink-500" />,
      label: 'Audio'
    };
  }
  
  // Code files
  if (mimeType.includes('javascript') || mimeType.includes('typescript') || 
      mimeType.includes('json') || mimeType.includes('html') || 
      mimeType.includes('css') || mimeType.includes('xml')) {
    return {
      icon: <FileCodeIcon className="h-5 w-5 text-gray-600" />,
      label: 'Code'
    };
  }
  
  // Archive files
  if (mimeType.includes('zip') || mimeType.includes('rar') || 
      mimeType.includes('tar') || mimeType.includes('7z')) {
    return {
      icon: <FileArchiveIcon className="h-5 w-5 text-yellow-600" />,
      label: 'Archive'
    };
  }

  // Google Drive folder
  if (mimeType === 'application/vnd.google-apps.folder') {
    return {
      icon: <FolderIcon className="h-5 w-5 text-indigo-500" />,
      label: 'Folder'
    };
  }

  // Default file type
  return {
    icon: <FileIcon className="h-5 w-5 text-gray-400" />,
    label: mimeType.split('/')[1]?.toUpperCase() || 'File'
  };
};

const formatFileSize = (size?: string) => {
  if (!size) return '-';
  const bytes = parseInt(size);
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const FileList: React.FC<FileListProps> = ({ files, onDelete, onDownload, isDeleting }) => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="bg-white rounded-lg shadow">
        <div className="hidden md:block"> {/* Desktop view */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modified</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {files.map((file) => {
                const fileType = getFileTypeInfo(file.mimeType);
                return (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        {fileType.icon}
                        <span className="text-sm text-gray-900 ml-2 truncate max-w-xs">{file.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-gray-500">{fileType.label}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(file.modifiedTime).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onDownload(file)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          title="Download"
                          disabled={isDeleting[file.id]}
                        >
                          <DownloadIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => onDelete(file.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Delete"
                          disabled={isDeleting[file.id]}
                        >
                          {isDeleting[file.id] ? (
                            <Loader2Icon className="h-5 w-5 animate-spin" />
                          ) : (
                            <Trash2Icon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="md:hidden"> {/* Mobile view */}
          <div className="divide-y divide-gray-200">
            {files.map((file) => {
              const fileType = getFileTypeInfo(file.mimeType);
              return (
                <div key={file.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      {fileType.icon}
                      <span className="text-sm font-medium text-gray-900 truncate">{file.name}</span>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => onDownload(file)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                        title="Download"
                        disabled={isDeleting[file.id]}
                      >
                        <DownloadIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDelete(file.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete"
                        disabled={isDeleting[file.id]}
                      >
                        {isDeleting[file.id] ? (
                          <Loader2Icon className="h-5 w-5 animate-spin" />
                        ) : (
                          <Trash2Icon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>{fileType.label}</p>
                    <p>{new Date(file.modifiedTime).toLocaleDateString()}</p>
                    <p>{formatFileSize(file.size)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
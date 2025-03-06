import React, { useEffect, useState } from 'react';
import { FileList } from './components/FileList';
import { FileUpload } from './components/FileUpload';
import { Login } from './components/Login';
import { GoogleFile } from './types';
import { GOOGLE_CLIENT_ID, GOOGLE_API_KEY, SCOPES } from './config';
import { FolderIcon, UserIcon } from 'lucide-react';
import { gapi } from 'gapi-script';

declare global {
  interface Window {
    gapi: typeof gapi;
  }
}

function App() {
  const [files, setFiles] = useState<GoogleFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<{ [key: string]: boolean }>({});
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const initGoogleAPI = async () => {
      try {
        await new Promise<void>((resolve) => {
          gapi.load('client:auth2', resolve);
        });

        await gapi.client.init({
          apiKey: GOOGLE_API_KEY,
          clientId: GOOGLE_CLIENT_ID,
          scope: SCOPES,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
        });

        gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn) => {
          setIsAuthenticated(isSignedIn);
          if (isSignedIn) {
            loadDriveFiles();
            const email = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail();
            setUserEmail(email);
          }
        });

        setIsAuthenticated(gapi.auth2.getAuthInstance().isSignedIn.get());
        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
          const email = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail();
          setUserEmail(email);
        }
        setIsLoading(false);

        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
          await loadDriveFiles();
        }
      } catch (err) {
        console.error('Error initializing Google API:', err);
        setError('Failed to initialize Google Drive API');
        setIsLoading(false);
      }
    };

    initGoogleAPI();
  }, []);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await gapi.auth2.getAuthInstance().signIn();
      setIsAuthenticated(true);
      const email = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail();
      setUserEmail(email);
      await loadDriveFiles();
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to sign in');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await gapi.auth2.getAuthInstance().signOut();
      setIsAuthenticated(false);
      setFiles([]);
      setUserEmail('');
    } catch (err) {
      setError('Failed to sign out');
    }
  };

  const loadDriveFiles = async () => {
    try {
      const response = await gapi.client.drive.files.list({
        fields: 'files(id, name, mimeType, modifiedTime, size)',
        pageSize: 50,
        orderBy: 'modifiedTime desc'
      });
      setFiles(response.result.files);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading files:', err);
      setError('Failed to load files');
      setIsLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const metadata = {
        name: file.name,
        mimeType: file.type || 'application/octet-stream',
        description: `Uploaded on ${new Date().toLocaleString()}`
      };

      const form = new FormData();
      const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
      form.append('metadata', metadataBlob);
      form.append('file', file);

      const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
      
      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: form
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      await loadDriveFiles();
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      setIsDeleting(prev => ({ ...prev, [fileId]: true }));
      await gapi.client.drive.files.delete({
        fileId: fileId,
      });
      setFiles(files.filter(file => file.id !== fileId));
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete file');
    } finally {
      setIsDeleting(prev => ({ ...prev, [fileId]: false }));
    }
  };

  const handleDownload = async (file: GoogleFile) => {
    try {
      const response = await gapi.client.drive.files.get({
        fileId: file.id,
        alt: 'media',
      });

      const blob = new Blob([response.body], { type: file.mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download file');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} isLoggingIn={isLoggingIn} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <FolderIcon className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Google Drive Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
                <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">{userEmail}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium transition duration-150"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
            <button 
              onClick={() => setError(null)} 
              className="ml-2 text-red-700 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        <div className="mb-8">
          <FileUpload onUpload={handleUpload} isUploading={isUploading} />
        </div>

        <FileList
          files={files}
          onDelete={handleDelete}
          onDownload={handleDownload}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
}

export default App;
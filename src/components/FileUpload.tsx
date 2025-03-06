import React, { useRef } from 'react';
import { UploadIcon, Loader2Icon } from 'lucide-react';

interface FileUploadProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload, isUploading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex items-center justify-center w-full px-4 sm:px-0">
      <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
          {isUploading ? (
            <>
              <Loader2Icon className="w-8 h-8 mb-3 text-gray-500 animate-spin" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </>
          ) : (
            <>
              <UploadIcon className="w-8 h-8 mb-3 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">Any file type</p>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>
    </div>
  );
};
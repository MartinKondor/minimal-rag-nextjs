'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Toast } from '@/app/components/ui/toast';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/app/components/ui/card';
import { Upload, Search, File, ArrowRight, Key } from 'lucide-react';
import { SearchResult } from '@/lib/types';

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

export default function MainPage() {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [toast, setToast] = useState<ToastState | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [openaiApiKey, setOpenaiApiKey] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async () => {
    if (!openaiApiKey) {
      setToast({ message: 'Please enter your OpenAI API key', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, openaiApiKey }),
      });
      const data = await response.json();

      if (response.ok) {
        setResults(data.searchResults);
        setToast({ message: 'Search completed successfully', type: 'success' });
      } else {
        throw new Error(data.error || 'An error occurred during search');
      }
    } catch (error) {
      console.error('Search error:', error);
      setToast({ message: 'An error occurred during search', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!openaiApiKey) {
      setToast({ message: 'Please enter your OpenAI API key', type: 'error' });
      return;
    }

    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/plain') {
        setToast({ message: 'Only .txt files are allowed', type: 'error' });
        return;
      }

      if (selectedFile.size > 20000) {
        setToast({
          message: 'File content must be under 20,000 characters',
          type: 'error',
        });
        return;
      }

      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async () => {
    if (!file) {
      setToast({ message: 'Please select a file first', type: 'error' });
      return;
    }

    if (!openaiApiKey) {
      setToast({ message: 'Please enter your OpenAI API key', type: 'error' });
      return;
    }

    setUploading(true);
    try {
      const response = await fetch('/api/upload', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: await file.text(),
          openaiApiKey,
        }),
      });

      if (response.ok) {
        setToast({ message: 'File uploaded successfully', type: 'success' });
      } else {
        throw new Error('File upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setToast({ message: 'File upload failed', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900">
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-2xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-purple-600 dark:text-purple-400">
              🤖 Minimal RAG Search
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-300">
              Enter your OpenAI API key, upload a .txt file (max 20,000
              characters), then enter your search query.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-6">
              <motion.div
                className="flex items-center space-x-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Input
                  type="password"
                  placeholder="Enter your OpenAI API key"
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  className="flex-grow"
                />
                <Key className="h-5 w-5 text-gray-400" />
              </motion.div>

              <motion.div
                className="flex items-center space-x-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".txt"
                  className="hidden"
                  disabled={!openaiApiKey}
                />
                <Button
                  onClick={handleUploadClick}
                  variant="outline"
                  className="flex-1"
                >
                  <Upload className="mr-2 h-4 w-4" /> Select File
                </Button>
                <Button
                  onClick={handleFileUpload}
                  disabled={!file || uploading || !openaiApiKey}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {uploading ? (
                    <motion.div
                      className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  ) : (
                    <ArrowRight className="mr-2 h-4 w-4" />
                  )}
                  {uploading ? 'Uploading...' : 'Upload File'}
                </Button>
              </motion.div>

              <AnimatePresence>
                {fileName && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-purple-100 dark:bg-purple-900 p-4 rounded-md"
                  >
                    <div className="flex items-center space-x-2">
                      <File className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                        {fileName} ({(file?.size || 0) / 1000} KB)
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Enter search query..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-grow"
                  disabled={!file || !openaiApiKey}
                />
                <Button
                  onClick={handleSearch}
                  disabled={loading || !file || !openaiApiKey}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? (
                    <motion.div
                      className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  ) : (
                    <Search className="mr-2 h-4 w-4" />
                  )}
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardContent>
            <AnimatePresence>
              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6 space-y-4"
                >
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Most Relevant Results
                  </h3>
                  {results
                    .sort((result) => result.score)
                    .map((result, index) => (
                      <motion.div
                        key={index}
                        className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <p className="text-gray-800 dark:text-gray-200">
                          {result.content}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Score: {result.score.toFixed(2)}
                        </p>
                      </motion.div>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </main>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

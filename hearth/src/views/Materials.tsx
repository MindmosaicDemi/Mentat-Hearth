import { useState, useCallback } from 'react';
import { useAppStore } from '../context/appStore';
import { db } from '../db/schema';
import type { SourceDocument } from '../db/schema';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

export const Materials = () => {
  const { setCurrentView } = useAppStore();
  const [isDragging, setIsDragging] = useState(false);
  const [documents, setDocuments] = useState<SourceDocument[]>([]);
  const [processingFile, setProcessingFile] = useState(false);

  const loadDocuments = useCallback(async () => {
    const docs = await db.sourceDocuments.toArray();
    setDocuments(docs);
  }, []);

  // Load documents on mount
  useState(() => {
    loadDocuments();
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setProcessingFile(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      let docType: SourceDocument['type'] = 'textbook';
      
      // Simple heuristic for document type detection
      const fileName = file.name.toLowerCase();
      if (fileName.includes('syllabus') || fileName.includes('outline')) {
        docType = 'syllabus';
      } else if (fileName.includes('past') || fileName.includes('exam') || fileName.includes('paper')) {
        docType = 'pastPaper';
      }

      // Process PDF
      if (file.type === 'application/pdf') {
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const textChunks: string[] = [];
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          textChunks.push(pageText);
        }

        const docId = crypto.randomUUID();
        
        await db.sourceDocuments.add({
          id: docId,
          type: docType,
          name: file.name,
          status: 'imported',
          chunkCount: textChunks.length,
          importedAt: new Date().toISOString(),
        });

        // Store chunks
        const chunks = textChunks.map((text, index) => ({
          id: `${docId}-chunk-${index}`,
          sourceDocId: docId,
          text,
          pageNumber: index + 1,
        }));

        await db.documentChunks.bulkAdd(chunks);

        // If syllabus, generate tasks
        if (docType === 'syllabus') {
          // TODO: Use AI to extract tasks from syllabus
          console.log('Syllabus detected - would generate task map');
        }

        // If past paper, generate challenge
        if (docType === 'pastPaper') {
          // TODO: Use AI to create challenge from past paper
          console.log('Past paper detected - would generate challenge');
        }

        // If textbook, extract TOC
        if (docType === 'textbook') {
          // TODO: Extract chapter structure
          console.log('Textbook detected - would extract TOC');
        }

        alert(`Successfully imported: ${file.name}`);
      } else {
        alert('Please upload PDF files only.');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert(`Failed to process ${file.name}`);
    } finally {
      setProcessingFile(false);
      loadDocuments();
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      await processFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-white">Materials Library</h1>
          <button
            onClick={() => setCurrentView('home')}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors"
          >
            ← Back to Home
          </button>
        </header>

        <section
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragging
              ? 'border-purple-500 bg-purple-900/20'
              : 'border-slate-600 bg-slate-800/50'
          }`}
        >
          <div className="space-y-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div>
              <p className="text-lg text-gray-300">
                Drag and drop your learning materials here
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Supports PDF textbooks, past papers, and syllabi
              </p>
            </div>
            <div>
              <label className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md cursor-pointer transition-colors">
                <span>Choose Files</span>
                <input
                  type="file"
                  accept=".pdf,.epub"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </div>
            {processingFile && (
              <p className="text-purple-400">Processing files...</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">Your Materials</h2>
          {documents.length === 0 ? (
            <p className="text-gray-400">No materials imported yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {documents.map((doc) => (
                <div key={doc.id} className="bg-slate-800/50 rounded-lg p-4 backdrop-blur">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-1 text-xs rounded ${
                      doc.type === 'textbook' ? 'bg-blue-600/20 text-blue-400' :
                      doc.type === 'pastPaper' ? 'bg-green-600/20 text-green-400' :
                      'bg-purple-600/20 text-purple-400'
                    }`}>
                      {doc.type === 'textbook' ? 'Textbook' :
                       doc.type === 'pastPaper' ? 'Past Paper' : 'Syllabus'}
                    </span>
                    <span className="text-xs text-gray-500">{doc.chunkCount} chunks</span>
                  </div>
                  <h3 className="text-white font-medium truncate mb-2">{doc.name}</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    Imported: {new Date(doc.importedAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    {doc.type === 'textbook' && (
                      <button
                        onClick={() => setCurrentView('reader')}
                        className="flex-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
                      >
                        Read
                      </button>
                    )}
                    <button className="flex-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="text-center text-gray-500 text-sm pt-8">
          <p>All materials are stored locally on your device. No uploads to external servers.</p>
        </footer>
      </div>
    </div>
  );
};

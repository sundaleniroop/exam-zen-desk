import React, { useState } from 'react';
import { AlertCircle, Archive, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUploader } from './FileUploader';
import { CompressionProgress } from './CompressionProgress';
import { CompressionResults } from './CompressionResults';
import { HuffmanCoding } from './HuffmanCoding';
import { CompressionResult, CompressionProgress as ProgressType } from './types';
import { useToast } from '@/hooks/use-toast';

export const CompressionTool: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<ProgressType | null>(null);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [error, setError] = useState<string>('');
  const [decompressedContent, setDecompressedContent] = useState<string>('');
  const { toast } = useToast();

  const handleFileSelect = (file: File, content: string) => {
    setSelectedFile(file);
    setFileContent(content);
    setCompressionResult(null);
    setError('');
    setDecompressedContent('');
  };

  const handleCompress = async () => {
    if (!fileContent || !selectedFile) {
      setError('Please select a file first');
      return;
    }

    if (fileContent.length === 0) {
      setError('File is empty');
      return;
    }

    setIsProcessing(true);
    setError('');
    setCompressionResult(null);

    try {
      const huffmanCoding = new HuffmanCoding(setProgress);
      
      // Simulate async processing for better UX
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const result = huffmanCoding.compress(fileContent);
      setCompressionResult(result);
      
      toast({
        title: "Compression Complete",
        description: `File compressed with ${result.compressionRatio.toFixed(1)}% space savings`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Compression failed';
      setError(errorMessage);
      toast({
        title: "Compression Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressionResult || !selectedFile) return;

    // Create a JSON blob containing the compressed data and tree
    const compressionData = {
      compressedData: compressionResult.compressedData,
      huffmanTree: compressionResult.huffmanTree,
      originalFileName: selectedFile.name,
      metadata: {
        originalSize: compressionResult.originalSize,
        compressedSize: compressionResult.compressedSize,
        compressionRatio: compressionResult.compressionRatio,
        timestamp: new Date().toISOString()
      }
    };

    const blob = new Blob([JSON.stringify(compressionData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name.replace(/\.[^/.]+$/, '.huff');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Complete",
      description: "Compressed file downloaded successfully",
    });
  };

  const handleDecompress = () => {
    if (!compressionResult) return;

    try {
      const huffmanCoding = new HuffmanCoding();
      const decompressed = huffmanCoding.decompress(
        compressionResult.compressedData,
        compressionResult.huffmanTree
      );
      
      setDecompressedContent(decompressed);
      
      // Verify decompression
      if (decompressed === fileContent) {
        toast({
          title: "Decompression Successful",
          description: "File decompressed perfectly - no data loss detected",
        });
      } else {
        toast({
          title: "Decompression Warning",
          description: "Decompressed content differs from original",
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Decompression failed';
      setError(errorMessage);
      toast({
        title: "Decompression Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setFileContent('');
    setCompressionResult(null);
    setProgress(null);
    setError('');
    setDecompressedContent('');
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
              <Archive className="h-8 w-8 text-primary" />
              File Compression Tool
            </CardTitle>
            <CardDescription className="text-lg">
              Compress and decompress files using Huffman coding algorithm
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="compress" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="compress">Compress</TabsTrigger>
            <TabsTrigger value="decompress" disabled={!compressionResult}>
              Decompress & Verify
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compress" className="space-y-6">
            {/* File Upload */}
            {!selectedFile && (
              <FileUploader
                onFileSelect={handleFileSelect}
                disabled={isProcessing}
                accept=".txt,.md,.csv,.json,.xml,.html,.css,.js,.ts,.py,.java,.cpp,.c,.h"
              />
            )}

            {/* Selected File Info */}
            {selectedFile && !compressionResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Selected File</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(2)} KB • {fileContent.length} characters
                      </p>
                    </div>
                    <Button onClick={handleReset} variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Choose Different File
                    </Button>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleCompress} 
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Compressing...
                        </>
                      ) : (
                        <>
                          <Archive className="h-4 w-4 mr-2" />
                          Compress File
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Progress */}
            {progress && isProcessing && (
              <CompressionProgress progress={progress} />
            )}

            {/* Results */}
            {compressionResult && (
              <CompressionResults
                result={compressionResult}
                originalFileName={selectedFile?.name || 'file.txt'}
                onDownload={handleDownload}
                onDecompress={handleDecompress}
              />
            )}
          </TabsContent>

          <TabsContent value="decompress" className="space-y-6">
            {decompressedContent && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Decompression Verification</CardTitle>
                  <CardDescription>
                    Comparing original content with decompressed content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Original Content (Preview)</h4>
                      <div className="p-3 bg-muted rounded-md text-sm font-mono max-h-48 overflow-y-auto">
                        {fileContent.substring(0, 500)}
                        {fileContent.length > 500 && '...'}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Decompressed Content (Preview)</h4>
                      <div className="p-3 bg-muted rounded-md text-sm font-mono max-h-48 overflow-y-auto">
                        {decompressedContent.substring(0, 500)}
                        {decompressedContent.length > 500 && '...'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-card border rounded-lg">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">
                          {fileContent.length === decompressedContent.length ? '✓' : '✗'}
                        </div>
                        <div className="text-xs text-muted-foreground">Length Match</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          {fileContent === decompressedContent ? '✓' : '✗'}
                        </div>
                        <div className="text-xs text-muted-foreground">Content Match</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-success">
                          {fileContent === decompressedContent ? '100%' : '0%'}
                        </div>
                        <div className="text-xs text-muted-foreground">Accuracy</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Reset Button */}
        {(selectedFile || compressionResult) && (
          <div className="text-center">
            <Button onClick={handleReset} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Start Over
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
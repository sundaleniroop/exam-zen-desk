import React from 'react';
import { Download, FileText, Zap, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CompressionResult } from './types';

interface CompressionResultsProps {
  result: CompressionResult;
  originalFileName: string;
  onDownload: () => void;
  onDecompress: () => void;
}

export const CompressionResults: React.FC<CompressionResultsProps> = ({
  result,
  originalFileName,
  onDownload,
  onDecompress
}) => {
  const formatBytes = (bytes: number) => {
    return `${(bytes / 8).toFixed(2)} bytes`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-success" />
          Compression Complete
        </CardTitle>
        <CardDescription>
          File compressed successfully using Huffman coding
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <FileText className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{formatBytes(result.originalSize)}</div>
            <div className="text-xs text-muted-foreground">Original Size</div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <Zap className="h-6 w-6 mx-auto mb-2 text-success" />
            <div className="text-2xl font-bold">{formatBytes(result.compressedSize)}</div>
            <div className="text-xs text-muted-foreground">Compressed Size</div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <BarChart3 className="h-6 w-6 mx-auto mb-2 text-warning" />
            <div className="text-2xl font-bold">{result.compressionRatio.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Space Saved</div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold">
              {(result.originalSize / result.compressedSize).toFixed(1)}x
            </div>
            <div className="text-xs text-muted-foreground">Compression Ratio</div>
          </div>
        </div>

        {/* File Info */}
        <div className="p-4 bg-card border rounded-lg">
          <h4 className="font-medium mb-2">File Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Original File:</span>
              <div className="font-medium">{originalFileName}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Compressed File:</span>
              <div className="font-medium">{originalFileName.replace(/\.[^/.]+$/, '.huff')}</div>
            </div>
          </div>
        </div>

        {/* Compression Details */}
        <div className="p-4 bg-card border rounded-lg">
          <h4 className="font-medium mb-2">Compression Details</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Algorithm:</span>
              <span>Huffman Coding</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bits Saved:</span>
              <span>{result.originalSize - result.compressedSize} bits</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Efficiency:</span>
              <span className="text-success font-medium">
                {result.compressionRatio > 0 ? 'Excellent' : 'No compression needed'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={onDownload} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download Compressed File
          </Button>
          <Button onClick={onDecompress} variant="outline" className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            Test Decompression
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
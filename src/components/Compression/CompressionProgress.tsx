import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CompressionProgress as CompressionProgressType } from './types';

interface CompressionProgressProps {
  progress: CompressionProgressType;
}

export const CompressionProgress: React.FC<CompressionProgressProps> = ({ progress }) => {
  const getStageDescription = (stage: string) => {
    switch (stage) {
      case 'analyzing':
        return 'Analyzing file content and character frequencies';
      case 'building-tree':
        return 'Building optimal Huffman coding tree';
      case 'encoding':
        return 'Encoding text with generated codes';
      case 'complete':
        return 'Compression completed successfully';
      default:
        return 'Processing...';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Compression Progress</CardTitle>
        <CardDescription>
          {getStageDescription(progress.stage)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{progress.message}</span>
            <span className="font-medium">{progress.progress}%</span>
          </div>
          <Progress value={progress.progress} className="h-2" />
        </div>
        
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className={`p-2 rounded text-center transition-colors ${
            progress.stage === 'analyzing' ? 'bg-primary text-primary-foreground' : 
            progress.progress > 10 ? 'bg-success text-success-foreground' : 'bg-muted'
          }`}>
            Analyze
          </div>
          <div className={`p-2 rounded text-center transition-colors ${
            progress.stage === 'building-tree' ? 'bg-primary text-primary-foreground' : 
            progress.progress > 30 ? 'bg-success text-success-foreground' : 'bg-muted'
          }`}>
            Build Tree
          </div>
          <div className={`p-2 rounded text-center transition-colors ${
            progress.stage === 'encoding' ? 'bg-primary text-primary-foreground' : 
            progress.progress > 70 ? 'bg-success text-success-foreground' : 'bg-muted'
          }`}>
            Encode
          </div>
          <div className={`p-2 rounded text-center transition-colors ${
            progress.stage === 'complete' ? 'bg-success text-success-foreground' : 'bg-muted'
          }`}>
            Complete
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
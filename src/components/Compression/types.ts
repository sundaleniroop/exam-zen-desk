export interface HuffmanNode {
  char: string | null;
  frequency: number;
  left: HuffmanNode | null;
  right: HuffmanNode | null;
}

export interface CompressionResult {
  compressedData: string;
  huffmanTree: HuffmanNode;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export interface CompressionProgress {
  stage: 'analyzing' | 'building-tree' | 'encoding' | 'complete';
  progress: number;
  message: string;
}
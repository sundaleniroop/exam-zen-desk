import { HuffmanNode, CompressionResult, CompressionProgress } from './types';

export class HuffmanCoding {
  private updateProgress?: (progress: CompressionProgress) => void;

  constructor(progressCallback?: (progress: CompressionProgress) => void) {
    this.updateProgress = progressCallback;
  }

  private buildFrequencyTable(text: string): Map<string, number> {
    this.updateProgress?.({
      stage: 'analyzing',
      progress: 10,
      message: 'Analyzing character frequencies...'
    });

    const frequencyMap = new Map<string, number>();
    for (const char of text) {
      frequencyMap.set(char, (frequencyMap.get(char) || 0) + 1);
    }
    return frequencyMap;
  }

  private buildHuffmanTree(frequencyMap: Map<string, number>): HuffmanNode {
    this.updateProgress?.({
      stage: 'building-tree',
      progress: 30,
      message: 'Building Huffman tree...'
    });

    const priorityQueue: HuffmanNode[] = [];
    
    // Create leaf nodes for each character
    for (const [char, frequency] of frequencyMap) {
      priorityQueue.push({
        char,
        frequency,
        left: null,
        right: null
      });
    }

    // Sort by frequency (ascending)
    priorityQueue.sort((a, b) => a.frequency - b.frequency);

    // Build the tree
    while (priorityQueue.length > 1) {
      const left = priorityQueue.shift()!;
      const right = priorityQueue.shift()!;

      const mergedNode: HuffmanNode = {
        char: null,
        frequency: left.frequency + right.frequency,
        left,
        right
      };

      // Insert the merged node in sorted position
      let insertIndex = 0;
      while (insertIndex < priorityQueue.length && 
             priorityQueue[insertIndex].frequency < mergedNode.frequency) {
        insertIndex++;
      }
      priorityQueue.splice(insertIndex, 0, mergedNode);
    }

    return priorityQueue[0];
  }

  private buildCodeTable(root: HuffmanNode): Map<string, string> {
    const codeTable = new Map<string, string>();

    const buildCodes = (node: HuffmanNode, code: string) => {
      if (node.char !== null) {
        // Leaf node - store the code
        codeTable.set(node.char, code || '0'); // Handle single character case
        return;
      }

      if (node.left) buildCodes(node.left, code + '0');
      if (node.right) buildCodes(node.right, code + '1');
    };

    buildCodes(root, '');
    return codeTable;
  }

  compress(text: string): CompressionResult {
    if (!text) throw new Error('Text cannot be empty');

    // Build frequency table
    const frequencyMap = this.buildFrequencyTable(text);

    // Build Huffman tree
    const huffmanTree = this.buildHuffmanTree(frequencyMap);

    // Build code table
    const codeTable = this.buildCodeTable(huffmanTree);

    this.updateProgress?.({
      stage: 'encoding',
      progress: 70,
      message: 'Encoding text...'
    });

    // Encode the text
    let compressedData = '';
    for (const char of text) {
      compressedData += codeTable.get(char) || '';
    }

    const originalSize = text.length * 8; // Original size in bits (ASCII)
    const compressedSize = compressedData.length;
    const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;

    this.updateProgress?.({
      stage: 'complete',
      progress: 100,
      message: 'Compression complete!'
    });

    return {
      compressedData,
      huffmanTree,
      originalSize,
      compressedSize,
      compressionRatio
    };
  }

  decompress(compressedData: string, huffmanTree: HuffmanNode): string {
    if (!compressedData || !huffmanTree) {
      throw new Error('Invalid compressed data or Huffman tree');
    }

    let decompressedText = '';
    let currentNode = huffmanTree;
    
    for (const bit of compressedData) {
      if (bit === '0') {
        currentNode = currentNode.left!;
      } else {
        currentNode = currentNode.right!;
      }

      // If we reach a leaf node, add the character and reset
      if (currentNode.char !== null) {
        decompressedText += currentNode.char;
        currentNode = huffmanTree;
      }
    }

    return decompressedText;
  }
}
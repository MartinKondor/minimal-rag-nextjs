import {
  TxtParentNodeWithSentenceNodeContent,
  split as splitToSentences,
} from 'sentence-splitter';
import { MAX_CHUNK_CHARACTERS } from './constants';

const parseSentences = (content: string) => {
  const cleanedText = content.replace(/\n/g, ' ').replace(/ {2,}/g, ' ');
  return splitToSentences(cleanedText)
    .filter((sentence) => sentence.type === 'Sentence')
    .map((sentence: TxtParentNodeWithSentenceNodeContent) => sentence.raw);
};

const chunkSingleSentence = (sentence: string): string[] => {
  // Chunk a single sentence into smaller chunks by words
  const chunks: string[] = [];
  const words = sentence.split(/\s+/);
  let currentChunk = '';

  for (const word of words) {
    if (currentChunk.length + word.length + 1 > MAX_CHUNK_CHARACTERS) {
      chunks.push(currentChunk.trim());
      currentChunk = word;
    } else {
      currentChunk += (currentChunk.length > 0 ? ' ' : '') + word;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};

const chunkMultipleSentences = (sentences: string[]): string[] => {
  // Chunk multiple sentences together to create chunks containing multiple sentences
  // Keep in mind the character and sentence limit
  const chunks: string[] = [];
  let currentChunk: string[] = [];

  for (const sentence of sentences) {
    if (sentence.length === 0) {
      continue;
    }

    // In case of weirdly long sentences
    if (sentence.length >= MAX_CHUNK_CHARACTERS) {
      console.warn(
        `Sentence is too long: ${sentence.length} characters, splitting it into smaller chunks by words.`,
      );

      const sentenceChunks = chunkSingleSentence(sentence);
      for (const sentenceChunk of sentenceChunks) {
        const currentChunkInOneString = currentChunk.join(' ');
        if (
          currentChunkInOneString.length + sentenceChunk.length + 1 >
          MAX_CHUNK_CHARACTERS
        ) {
          if (currentChunk.length > 0) {
            chunks.push(currentChunkInOneString.trim());
          }
          currentChunk = [sentenceChunk];
        } else {
          currentChunk.push(sentenceChunk);
        }
      }
      continue;
    }

    const currentChunkInOneString = currentChunk.join(' ');
    if (
      currentChunkInOneString.length + sentence.length + 1 >
      MAX_CHUNK_CHARACTERS
    ) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunkInOneString.trim());
      }
      currentChunk = [sentence];
    } else {
      currentChunk.push(sentence);
    }
  }

  if (currentChunk.length > 0) {
    // Remove possible duplicated sentences
    currentChunk = currentChunk.filter(
      (sentence, index, self) => self.indexOf(sentence) === index,
    );
    chunks.push(currentChunk.join(' ').trim());
  }

  // Just a quick check
  chunks.forEach((chunk: string) => {
    if (chunk.length > MAX_CHUNK_CHARACTERS) {
      throw new Error(
        `Chunk is too long: ${chunk.length} characters, max is ${MAX_CHUNK_CHARACTERS}.`,
      );
    }
  });

  return chunks;
};

export const chunkFile = (content: string): string[] => {
  const rawSentences = parseSentences(content);
  return chunkMultipleSentences(rawSentences);
};

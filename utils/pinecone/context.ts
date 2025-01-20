import { ScoredPineconeRecord } from '@pinecone-database/pinecone';
import { getEmbeddings } from './embeddings';
import { getMatchesFromEmbeddings } from './pinecone';

type Metadata = {
  url: string;
  text: string;
  chunk: string;
  _node_content: string;
};

// The function `getContext` is used to retrieve the context of a given message
export const getContext = async (
  text: string,
  namespace: string,
  maxTokens = 3000,
  minScore = 0.3,
  getOnlyText = true
): Promise<string | ScoredPineconeRecord[]> => {
  // Get the embeddings of the input message
  const embedding = await getEmbeddings(text);

  // Retrieve the matches for the embeddings from the specified namespace
  const matches = await getMatchesFromEmbeddings(embedding, 3, namespace);
  const node_contents = matches.map(
    (match) => (match as unknown as Metadata)._node_content
  );

  // Filter out the matches that have a score lower than the minimum score
  const qualifyingDocs = matches.filter((m) => m.score && m.score > minScore);

  if (!getOnlyText) {
    // Use a map to deduplicate matches by URL
    return qualifyingDocs;
  }

  // Convert _node_content from string to JSON
  const metadatas = qualifyingDocs.map((match) => {
    try {
      // Assuming _node_content is a JSON string
      const parsed = JSON.parse(
        (match.metadata?._node_content as string) || '{}'
      );
    } catch (error) {
      console.error('Error parsing _node_content:', error);
      // Fallback: treat _node_content directly as Metadata
    }
  });

  // let docs = qualifyingDocs.map((qDoc) => (qDoc.metadata as Metadata).text);
  // console.log('docs', docs);
  return qualifyingDocs.join('\n').substring(0, maxTokens);
};

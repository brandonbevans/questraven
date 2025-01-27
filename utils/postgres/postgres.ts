import { createClient } from '@supabase/supabase-js';

export type Metadata = {
  url: string;
  text: string;
  chunk: string;
  hash: string;
  _node_content: string;
};

export type ScoredRecord = {
  metadata: Metadata;
  score: number;
};

const getMatchesFromEmbeddings = async (
  embeddings: number[],
  resultLimit: number,
  namespace: string
): Promise<ScoredRecord[]> => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    const { data: matches, error } = await supabase
      .schema('vecs')
      .rpc('match_documents', {
        vector: embeddings,
        result_limit: resultLimit,
        namespace: namespace
      });

    if (error) {
      console.error('Error querying embeddings:', error);
      throw error;
    }
    console.log('matches', matches);

    // Transform the results to match the expected format
    return matches.map((match: any) => ({
      metadata: match.metadata,
      score: match.similarity
    }));
  } catch (e) {
    console.error('Error querying embeddings:', e);
    throw new Error(`Error querying embeddings: ${e}`);
  }
};

export { getMatchesFromEmbeddings };

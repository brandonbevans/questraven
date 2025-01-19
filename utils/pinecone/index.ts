// import { PineconeVectorStore } from '@llamaindex/pinecone';
import {
  OpenAI,
  OpenAIEmbedding,
  PineconeVectorStore,
  VectorStoreIndex,
  serviceContextFromDefaults
} from 'llamaindex';

export async function getDataSource(gameName: string) {
  const ctx = serviceContextFromDefaults({
    llm: new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-4o-mini'
    }),
    embedModel: new OpenAIEmbedding({
      apiKey: process.env.OPENAI_API_KEY,
      model: 'text-embedding-3-small'
    })
  });

  const store = new PineconeVectorStore({
    indexName: 'documents',
    namespace: gameName
  });
  return await VectorStoreIndex.fromVectorStore(store, ctx);
}

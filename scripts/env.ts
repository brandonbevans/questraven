import { config } from 'dotenv';
import path from 'path';

export function loadEnv() {
  // Load .env.local first
  config({ path: path.resolve(process.cwd(), '.env.local') });
  // Fallback to .env if needed
  config({ path: path.resolve(process.cwd(), '.env') });
}

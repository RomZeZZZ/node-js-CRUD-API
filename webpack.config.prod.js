import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './src/main.js',
  target: 'node',
  mode: 'production',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'backend.js'
  }
}
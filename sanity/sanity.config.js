import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import schemas from './schemas';

export default defineConfig({
  projectId: 'your_project_id',
  dataset: 'production',
  title: 'Alpha Omega Studio',
  plugins: [deskTool()],
  schema: {
    types: schemas
  }
});

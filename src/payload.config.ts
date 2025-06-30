// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { registerSLACheckRoute } from './endpoints/checkSLAs.js'
import { Blog } from './collections/Blog.js'
import { Workflows } from './collections/Workflows.js'
import { WorkflowInstances } from './collections/WorkflowInstances.js'
import { WorkflowLogs } from './collections/WorkflowLogs.js'
import { Users } from './collections/Users.js' // ✅ Add this line
import { registerWorkflowRoutes } from './endpoints/workflowRoutes.js'
import WorkflowDashboard from './admin/views/WorkflowDashboard.js'
import { registerWorkflowAnalytics } from './endpoints/analytics.js'
import { Roles } from './collections/Roles.js';

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users', // ✅ Make sure this slug exists in the collections
    components: {
      views: {
        Dashboard: WorkflowDashboard,
      },
    },
  },
  collections: [
    Users,  
    Roles,              // ✅ Include Users collection
    Blog,
    Workflows,
    WorkflowInstances,
    WorkflowLogs,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
  endpoints: [
    registerWorkflowRoutes,
    registerSLACheckRoute,
    registerWorkflowAnalytics,
  ],
})

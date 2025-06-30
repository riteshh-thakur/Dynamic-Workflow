

import { CollectionConfig } from 'payload/types';
import { WorkflowSidebar } from '../admin/components/WorkflowSidebar';

export const Blog: CollectionConfig = {
slug: 'blog',
admin: {
useAsTitle: 'title',
components: {
views: {
Edit: WorkflowSidebar,
},
},
},
access: {
read: () => true,
create: ({ req: { user } }) => Boolean(user),
update: ({ req: { user } }) => Boolean(user),
delete: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')),
},
fields: [
{
name: 'title',
type: 'text',
required: true,
},
{
name: 'slug',
type: 'text',
required: true,
unique: true,
},
{
name: 'content',
type: 'richText',
required: true,
},
{
name: 'workflow',
type: 'relationship',
relationTo: 'workflows',
required: false,
admin: {
position: 'sidebar',
description: 'Select a workflow for this blog post.',
},
},
{
name: 'workflowInstance',
type: 'relationship',
relationTo: 'workflow-instances',
required: false,
admin: {
position: 'sidebar',
description: 'Linked workflow instance (auto-managed).',
readOnly: true,
},
},
],
};
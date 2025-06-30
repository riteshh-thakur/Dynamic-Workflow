import { CollectionConfig } from 'payload/types';

export const WorkflowInstances: CollectionConfig = {
slug: 'workflow-instances',
admin: {
useAsTitle: 'workflow',
defaultColumns: ['collection', 'documentId', 'currentStep', 'status'],
},
access: {
read: ({ req: { user } }) => Boolean(user), // only authenticated users
create: () => false, // created programmatically
update: () => false, // updated via backend logic only
delete: () => false,
},
fields: [
{
name: 'workflow',
type: 'relationship',
relationTo: 'workflows',
required: true,
},
{
name: 'collection',
type: 'text',
required: true,
admin: {
description: 'The name of the collection this workflow is attached to (e.g., blog, product).',
},
},
{
name: 'documentId',
type: 'text',
required: true,
},
{
name: 'currentStep',
type: 'text',
required: true,
},
{
name: 'status',
type: 'select',
options: ['in_progress', 'approved', 'rejected', 'escalated'],
defaultValue: 'in_progress',
required: true,
},
{
name: 'stepStartedAt',
type: 'date',
required: true,
defaultValue: () => new Date(),
},
{
name: 'escalated',
type: 'checkbox',
defaultValue: false,
},
],
};
import { CollectionConfig } from 'payload/types';

export const WorkflowLogs: CollectionConfig = {
slug: 'workflow-logs',
admin: {
useAsTitle: 'stepLabel',
defaultColumns: ['workflowInstance', 'collection', 'docId', 'user', 'action'],
},
access: {
read: ({ req: { user } }) => Boolean(user),
create: () => false, // Logs are only created by code
update: () => false, // Immutable
delete: () => false,
},
fields: [
{
name: 'workflowInstance',
type: 'relationship',
relationTo: 'workflow-instances',
required: true,
},
{
name: 'collection',
type: 'text',
required: true,
},
{
name: 'docId',
type: 'text',
required: true,
},
{
name: 'stepLabel',
type: 'text',
required: true,
},
{
name: 'user',
type: 'relationship',
relationTo: 'users',
required: true,
},
{
name: 'action',
type: 'select',
options: ['approved', 'rejected', 'commented'],
required: true,
},
{
name: 'comment',
type: 'textarea',
required: false,
},
{
name: 'timestamp',
type: 'date',
defaultValue: () => new Date(),
required: true,
},
],
};
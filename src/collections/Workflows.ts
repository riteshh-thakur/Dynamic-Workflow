import { CollectionConfig } from 'payload/types';

export const Workflows: CollectionConfig = {
slug: 'workflows',
admin: {
useAsTitle: 'name',
defaultColumns: ['name', 'steps'],
},
access: {
read: () => true,
create: ({ req: { user } }) => Boolean(user && user.roles?.includes('admin')),
update: ({ req: { user } }) => Boolean(user && user.roles?.includes('admin')),
delete: ({ req: { user } }) => Boolean(user && user.roles?.includes('admin')),
},
fields: [
{
name: 'name',
type: 'text',
required: true,
},
{
name: 'steps',
type: 'array',
required: true,
label: 'Workflow Steps',
minRows: 1,
fields: [
{
name: 'label',
type: 'text',
required: true,
},
{
name: 'stepType',
type: 'select',
required: true,
options: [
{ label: 'Approval', value: 'approval' },
{ label: 'Review', value: 'review' },
{ label: 'Sign-Off', value: 'signoff' },
{ label: 'Comment-Only', value: 'comment' },
],
},
{
name: 'assignedToRoles',
type: 'relationship',
relationTo: 'roles',
hasMany: true,
required: false,
},
{
name: 'assignedToUsers',
type: 'relationship',
relationTo: 'users',
hasMany: true,
required: false,
},
{
name: 'condition',
type: 'code',
required: false,
admin: {
language: 'json',
description: 'Use JSON logic to define step conditions.',
},
},
{
name: 'slaHours',
type: 'number',
required: false,
admin: {
description: 'Set time limit (in hours) before this step is considered overdue.',
},
},
{
name: 'escalateToRoles',
type: 'relationship',
relationTo: 'roles',
hasMany: true,
required: false,
admin: {
description: 'Roles to notify if SLA is missed for this step.',
},
},
{
name: 'nextStepOnApprove',
type: 'text',
required: false,
},
{
name: 'nextStepOnReject',
type: 'text',
required: false,
},
],
},
],
};
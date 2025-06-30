import { CollectionConfig } from 'payload/types';

export const Users: CollectionConfig = {
slug: 'users',
auth: true,
admin: {
useAsTitle: 'email',
},
access: {
read: () => true,
update: ({ req: { user } }) => Boolean(user),
create: () => true,
},
fields: [
{
name: 'roles',
type: 'text',
hasMany: true,
required: true,
defaultValue: ['editor'],
admin: {
description: 'User roles. Use "admin" to grant workflow creation/edit rights.',
},
},
{
name: 'fullName',
type: 'text',
required: false,
admin: {
position: 'sidebar',
},
},
],
};
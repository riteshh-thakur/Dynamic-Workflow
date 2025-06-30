🛠️ Dynamic Workflow Management System in Payload CMS
This project implements a fully dynamic, reusable, and role-based workflow engine inside Payload CMS. It allows administrators to create multi-step approval workflows that can be attached to any collection (e.g., blogs, contracts, products) through the admin panel.

Built using Payload CMS, MongoDB, TypeScript, and custom admin UI components.

🚀 Features
✅ Dynamic multi-step workflow builder
✅ Role-based access (approve, review, sign-off, comment-only)
✅ Conditional branching based on outcome (approve/reject)
✅ SLA support and auto-escalation
✅ Workflow progress sidebar in Admin UI
✅ Immutable audit trail (workflow logs)
✅ REST API support for integrations
✅ Custom admin dashboard for analytics

🧱 Architecture Overview
📁 collections/

blog.ts – sample collection with workflow support

workflows.ts – workflow templates (multi-step definitions)

workflow-instances.ts – runtime tracking of each document’s workflow

workflow-logs.ts – audit logs (read-only, immutable)

users.ts – users with roles for access control

📁 components/

WorkflowSidebar.tsx – React component injected into Admin UI for live step tracking & action

📁 workflow/

workflowEngine.ts – core logic for step evaluation, transitions, and SLA handling

📁 endpoints/

workflowRoutes.ts – custom REST API endpoints

analytics.ts – admin route for workflow status analytics

📦 Installation & Setup
Clone this repository:

git clone https://github.com/riteshh-thakur/Dynamic-Workflow.git
cd workflow-system

Install dependencies:

npm install

Create a .env file based on .env.example:

PORT=3000
MONGODB_URI=mongodb://localhost:27017/payload-workflow
PAYLOAD_SECRET=your-secret-key
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

Start the development server:

npm run dev

Visit Payload Admin:

http://localhost:3000/admin

👤 User Roles & Access
admin → full access (can create workflows)

reviewer → assigned to review steps

approver → assigned to approval steps

editor → can create content

Example User document:

{
"email": "admin@example.com",
"password": "admin",
"roles": ["admin"]
}

You can create users from the admin UI or insert via MongoDB.

🧪 How It Works (Flow)
Admin creates a workflow in Workflows collection:

Add steps (review/approve/comment)

Assign roles/users

Set SLAs and next steps

Editor creates a blog and attaches the workflow

On Save:

The backend hook triggers workflowEngine.ts

A new workflowInstance is created

Step is assigned to users based on role

In Admin UI:

WorkflowSidebar shows current step

Assigned user takes action (approve/reject/comment)

Each action:

Updates the workflowInstance

Adds entry in workflowLogs (immutable)

Transitions to next step or completes workflow

REST API available to:

Manually trigger workflows

Query workflow status

Check SLA violations

📡 REST API Endpoints
🔁 POST /api/workflows/trigger

Manually trigger or advance workflow

Request body:

{
"collection": "blog",
"docId": "64ab12ef34567890",
"currentUser": "user-id",
"action": "approved",
"comment": "Reviewed by editor"
}

📥 GET /api/workflows/status/:collection/:docId

Fetch current workflow state for a document

📈 GET /api/workflows/check-slas

Check all running workflows for overdue steps based on SLA

📊 Dashboard & Analytics
Visit /workflow-dashboard (admin-only)

You’ll see:

Count of in-progress, approved, rejected workflows

SLA overdue steps

Recent actions

Average completion time (if added)

🧩 Extensibility
This engine is designed to be reusable across any Payload collection.

To add workflow support to another collection (e.g., product):

Add a workflow relationship field in product.ts

Import and inject WorkflowSidebar in product admin views

That's it — the engine works dynamically!

🎁 Bonus Features
SLA escalation logic (step overdue triggers new logs)

JSON condition logic (using json-logic) in steps

Workflow step transition control via nextStepOnApprove / nextStepOnReject

Comment-only step support

Approver feedback visible in Admin UI

🧠 Credits
This task was created by Ritesh Thakur as a submission for the Payload CMS Workflow Challenge.

Built with:

Payload CMS

MongoDB

React (for sidebar component)

Node.js / TypeScript

📬 Contact / Feedback
Have feedback or want to collaborate?

Reach out at: thakurritesh8219@gmail.com
GitHub: github.com/riteshh-thakur


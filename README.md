🛠️ Dynamic Workflow Management System in Payload CMS
This project implements a fully dynamic, reusable, and role-based workflow engine inside Payload CMS. It allows administrators to create multi-step approval workflows that can be attached to any collection (e.g., blogs, contracts, products) through the admin panel.

🚀 Features
✅ Dynamic Workflow Builder: Create multi-step workflows directly in the admin panel.
✅ Role-Based Access: Define specific roles like approve, review, sign-off, and comment-only.
✅ Conditional Branching: Route workflows differently based on approval or rejection outcomes.
✅ SLA Support: Set Service Level Agreements for steps and configure auto-escalation rules.
✅ Live Progress Sidebar: A custom React component shows the real-time workflow status in the Admin UI.
✅ Immutable Audit Trail: All workflow actions are logged for a complete, unchangeable history.
✅ REST API Support: Integrate the workflow engine with external systems.
✅ Custom Admin Dashboard: Get a high-level overview of workflow analytics.

🧱 Architecture Overview
📁 collections/
blog.ts – A sample collection demonstrating how to integrate workflow support.

workflows.ts – The collection for defining workflow templates (multi-step definitions).

workflow-instances.ts – Tracks the runtime state of each document's active workflow.

workflow-logs.ts – Read-only, immutable audit logs for every action taken.

users.ts – Manages users and their assigned roles for access control.

📁 components/
WorkflowSidebar.tsx – The custom React component injected into the Admin UI for live step tracking and user actions.

📁 workflow/
workflowEngine.ts – The core logic for step evaluation, state transitions, and SLA handling.

📁 endpoints/
workflowRoutes.ts – Custom REST API endpoints for external integrations.

analytics.ts – The admin route for the workflow status analytics dashboard.

📦 Installation & Setup
Clone this repository:

git clone [https://github.com/riteshh-thakur/Dynamic-Workflow.git](https://github.com/riteshh-thakur/Dynamic-Workflow.git)
cd Dynamic-Workflow

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
Navigate to http://localhost:3000/admin in your browser.

👤 User Roles & Access
admin → Full access, including creating and managing workflow templates.

reviewer → Can be assigned to "review" steps.

approver → Can be assigned to "approval" steps.

editor → Can create content that utilizes workflows.

Example User document:

{
  "email": "admin@example.com",
  "password": "admin",
  "roles": ["admin"]
}

You can create users from the admin UI or insert them directly via MongoDB.

🧪 How It Works (Flow)
An Admin creates a workflow in the Workflows collection.

An Editor creates a new blog post and attaches the desired workflow.

On Save, a backend hook triggers the workflowEngine.ts.

A new workflowInstance document is created to track the blog post's progress.

In the Admin UI, the WorkflowSidebar shows the current step and available actions.

When the assigned user takes an action, the workflowInstance is updated, a workflowLog is created, and the workflow transitions to the next step.

📡 REST API Endpoints
🔁 Trigger Workflow
Manually trigger or advance a workflow step.
POST /api/workflows/trigger

Request Body:

{
  "collection": "blog",
  "docId": "64ab12ef34567890",
  "currentUser": "user-id",
  "action": "approved",
  "comment": "Reviewed by editor"
}

📥 Fetch Workflow Status
Fetch the current workflow state for a specific document.
GET /api/workflows/status/:collection/:docId

📈 Check SLAs
Check all running workflows for overdue steps based on their defined SLA.
GET /api/workflows/check-slas

📊 Dashboard & Analytics
Visit /workflow-dashboard (admin-only) to see:

Counts of in-progress, approved, and rejected workflows.

A list of all steps that are currently overdue.

A feed of recent workflow actions.

Average completion time for workflows.

🧩 Extensibility
This engine is designed to be reusable across any Payload collection. To add workflow support to another collection (e.g., products):

Add a workflow relationship field in product.ts.

Import and inject the WorkflowSidebar component in the product collection's admin views.

That's it—the engine works dynamically!

🎁 Bonus Features
SLA Escalation: Logic to trigger new logs or notifications when a step is overdue.

JSON Condition Logic: Use json-logic in steps for complex conditional routing.

Controlled Transitions: Explicitly define nextStepOnApprove and nextStepOnReject.

Comment-Only Steps: Allow users to add feedback without changing the workflow state.

Visible Feedback: Approver comments are visible directly in the Admin UI sidebar.

🧠 Credits
This task was created by Ritesh Thakur as a submission for the Payload CMS Workflow Challenge.


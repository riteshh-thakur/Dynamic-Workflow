import payload from 'payload';
import { User } from 'payload/generated-types';

interface RunWorkflowProps {
  collection: string;
  docId: string;
  currentUser: User;
  triggerType: 'auto' | 'manual';
  comment?: string;
  action?: 'approved' | 'rejected' | 'commented';
}

export async function runWorkflow({
  collection,
  docId,
  currentUser,
  triggerType = 'auto',
  comment,
  action,
}: RunWorkflowProps): Promise<void> {
  try {
    const doc = await payload.findByID({
      collection,
      id: docId,
    });

    if (!doc || !doc.workflow) {
      console.log(`[workflowEngine] No workflow attached to document ${docId}`);
      return;
    }

    const workflowTemplate = await payload.findByID({
      collection: 'workflows',
      id: doc.workflow,
    });

    const steps = workflowTemplate.steps;
    if (!steps || steps.length === 0) {
      console.warn(`[workflowEngine] Workflow has no steps.`);
      return;
    }

    const existing = await payload.find({
      collection: 'workflow-instances',
      where: {
        and: [
          { collection: { equals: collection } },
          { documentId: { equals: docId } },
        ],
      },
    });

    let instance = existing.docs[0];

    if (!instance) {
      const firstStep = steps[0];

      const createdInstance = await payload.create({
        collection: 'workflow-instances',
        data: {
          workflow: workflowTemplate.id,
          collection,
          documentId: docId,
          currentStep: firstStep.label,
          status: 'in_progress',
          stepStartedAt: new Date(),
        },
      });

      instance = createdInstance;

      await payload.update({
        collection,
        id: docId,
        data: {
          workflowInstance: createdInstance.id,
        },
      });

      notifyStepUsers(firstStep, doc);
      return;
    }

    if (action && currentUser) {
      const currentStep = steps.find(
        (step: any) => step.label === instance.currentStep
      );

      if (!currentStep) {
        console.warn(`[workflowEngine] Current step not found.`);
        return;
      }

      await payload.create({
        collection: 'workflow-logs',
        data: {
          workflowInstance: instance.id,
          collection,
          docId,
          stepLabel: currentStep.label,
          user: currentUser.id,
          action,
          comment,
          timestamp: new Date(),
        },
      });

      let nextStepLabel: string | null = null;
      if (action === 'approved') {
        nextStepLabel = currentStep.nextStepOnApprove;
      } else if (action === 'rejected') {
        nextStepLabel = currentStep.nextStepOnReject;
      }

      const nextStep = steps.find((step: any) => step.label === nextStepLabel);

      if (nextStep) {
        await payload.update({
          collection: 'workflow-instances',
          id: instance.id,
          data: {
            currentStep: nextStep.label,
            stepStartedAt: new Date(),
          },
        });

        notifyStepUsers(nextStep, doc);
      } else {
        const newStatus = action === 'approved' ? 'approved' : 'rejected';

        await payload.update({
          collection: 'workflow-instances',
          id: instance.id,
          data: {
            status: newStatus,
          },
        });

        console.log(`[workflowEngine] Workflow completed as ${newStatus}`);
      }
    }
  } catch (err) {
    console.error('[workflowEngine] Error:', err);
  }
}

function notifyStepUsers(step: any, doc: any) {
  const users = step.assignedToUsers || [];
  const roles = step.assignedToRoles || [];

  console.log(
    `[NOTIFY] Step "${step.label}" triggered for document "${doc.title || doc.id}". Assigned to users: ${users?.join(', ')} | roles: ${roles?.join(', ')}`
  );
}

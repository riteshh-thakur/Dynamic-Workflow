import { Express } from 'express';

export const registerSLACheckRoute = (app: Express) => {
  app.get('/api/workflows/check-slas', async (req, res) => {
    try {
      const overdueRes = await req.payload.find({
        collection: 'workflow-instances',
        where: {
          status: { equals: 'in_progress' },
        },
        limit: 100,
      });

      const now = new Date();
      const escalatedInstances: string[] = [];

      for (const instance of overdueRes.docs) {
        const workflow = await req.payload.findByID({
          collection: 'workflows',
          id: instance.workflow,
        });

        const currentStep = workflow.steps.find(
          (s: any) => s.label === instance.currentStep
        );
        if (!currentStep || !currentStep.slaHours) continue;

        const deadline = new Date(instance.stepStartedAt);
        deadline.setHours(deadline.getHours() + currentStep.slaHours);

        if (now > deadline) {
          // Log escalation
          await req.payload.create({
            collection: 'workflow-logs',
            data: {
              workflowInstance: instance.id,
              collection: instance.collection,
              docId: instance.documentId,
              stepLabel: currentStep.label,
              action: 'escalated',
              comment: `Step SLA expired. Escalated to roles: ${currentStep.escalateToRoles?.join(', ') || 'N/A'}`,
              timestamp: new Date(),
            },
          });

          // Simulated notification
          console.warn(`[SLA] Escalation triggered for ${instance.collection}/${instance.documentId} at step "${currentStep.label}"`);

          escalatedInstances.push(instance.id);
        }
      }

      return res.status(200).json({
        message: 'SLA check completed',
        escalated: escalatedInstances,
      });
    } catch (err) {
      console.error('[SLA] Error during check:', err);
      return res.status(500).json({ error: 'SLA check failed' });
    }
  });
};

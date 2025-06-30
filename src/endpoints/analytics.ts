import { Express } from 'express';

export const registerWorkflowAnalytics = (app: Express) => {
  app.get('/api/workflows/analytics', async (req, res) => {
    try {
      const instanceRes = await req.payload.find({
        collection: 'workflow-instances',
        limit: 1000,
        depth: 2,
      });

      const instances = instanceRes.docs;

      const total = instances.length;
      const inProgress = instances.filter((i) => i.status === 'in_progress').length;
      const approved = instances.filter((i) => i.status === 'approved').length;
      const rejected = instances.filter((i) => i.status === 'rejected').length;

      const now = new Date();
      let overdueSteps = 0;

      instances.forEach((i) => {
        if (!i.stepStartedAt || !i.workflow || !i.currentStep) return;

        const currentStep = i.workflow.steps?.find(
          (s: any) => s.label === i.currentStep
        );

        if (!currentStep || !currentStep.slaHours) return;

        const deadline = new Date(i.stepStartedAt);
        deadline.setHours(deadline.getHours() + currentStep.slaHours);

        if (now > deadline) {
          overdueSteps += 1;
        }
      });

      const recentLogsRes = await req.payload.find({
        collection: 'workflow-logs',
        limit: 10,
        sort: '-timestamp',
        depth: 2,
      });

      return res.status(200).json({
        total,
        inProgress,
        approved,
        rejected,
        overdueSteps,
        recentLogs: recentLogsRes.docs,
      });
    } catch (err) {
      console.error('[Analytics] Error:', err);
      return res.status(500).json({ error: 'Analytics fetch failed', details: err });
    }
  });
};

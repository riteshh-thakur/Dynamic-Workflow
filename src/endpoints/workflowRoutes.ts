import { Express } from 'express';
import { runWorkflow } from '../workflow/workflowEngine';

export const registerWorkflowRoutes = (app: Express) => {
  // POST /api/workflows/trigger
  app.post('/api/workflows/trigger', async (req, res) => {
    const { collection, docId, action, comment } = req.body;
    const currentUser = req.user;

    if (!collection || !docId || !action || !currentUser) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      await runWorkflow({
        collection,
        docId,
        currentUser,
        triggerType: 'manual',
        action,
        comment,
      });

      return res.status(200).json({ message: 'Workflow updated successfully.' });
    } catch (err) {
      console.error('[workflowRoutes] Error triggering workflow:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/workflows/status/:collection/:docId
  app.get('/api/workflows/status/:collection/:docId', async (req, res) => {
    const { collection, docId } = req.params;

    try {
      const instanceRes = await req.payload.find({
        collection: 'workflow-instances',
        where: {
          and: [
            { collection: { equals: collection } },
            { documentId: { equals: docId } },
          ],
        },
      });

      const instance = instanceRes.docs?.[0];
      if (!instance) {
        return res.status(404).json({ error: 'No workflow instance found for the document.' });
      }

      const logsRes = await req.payload.find({
        collection: 'workflow-logs',
        where: {
          workflowInstance: { equals: instance.id },
        },
        sort: '-timestamp',
        depth: 2,
      });

      return res.status(200).json({
        instance,
        logs: logsRes.docs,
      });
    } catch (err) {
      console.error('[workflowRoutes] Error fetching status:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
};

'use client';

import React, { useEffect, useState } from 'react';
import { useDocumentInfo } from '@payloadcms/ui/providers/DocumentInfo';
import { useAuth } from '@payloadcms/ui/providers/Auth';
import { Button } from '@payloadcms/ui/elements/Button';

const WorkflowSidebar: React.FC = () => {
  const { id, collection } = useDocumentInfo();
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [instance, setInstance] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !collection?.slug) return;

      try {
        const instanceRes = await fetch(
          `/api/workflow-instances?where[collection][equals]=${collection.slug}&where[documentId][equals]=${id}`
        );
        const instanceData = await instanceRes.json();
        const wfInstance = instanceData.docs?.[0];
        setInstance(wfInstance);

        if (wfInstance?.id) {
          const logRes = await fetch(
            `/api/workflow-logs?where[workflowInstance][equals]=${wfInstance.id}&sort=-timestamp`
          );
          const logData = await logRes.json();
          setLogs(logData.docs);
        }
      } catch (err) {
        console.error('Failed to fetch workflow data:', err);
      }
    };

    fetchData();
  }, [id, collection?.slug]);

  const handleAction = async (action: 'approved' | 'rejected' | 'commented') => {
    try {
      await fetch('/api/workflows/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: collection.slug,
          docId: id,
          action,
          comment: `Performed ${action} from Admin UI`,
        }),
      });

      window.location.reload();
    } catch (err) {
      console.error('Workflow action failed:', err);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h3>🛠 Workflow Info</h3>
      {instance ? (
        <>
          <p><strong>Status:</strong> {instance.status}</p>
          <p><strong>Current Step:</strong> {instance.currentStep}</p>

          <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <Button onClick={() => handleAction('approved')} size="sm">✅ Approve</Button>{' '}
            <Button onClick={() => handleAction('rejected')} size="sm">❌ Reject</Button>{' '}
            <Button onClick={() => handleAction('commented')} size="sm">💬 Comment</Button>
          </div>

          <hr />
          <h4>📜 Workflow Logs</h4>
          <ul style={{ paddingLeft: '1rem' }}>
            {logs.map((log, index) => (
              <li key={index}>
                <strong>{log.action}</strong> by <em>{log.user?.email || 'Unknown'}</em> at{' '}
                {new Date(log.timestamp).toLocaleString()}<br />
                {log.comment && <span>📝 {log.comment}</span>}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No active workflow instance for this document.</p>
      )}
    </div>
  );
};

export default WorkflowSidebar;

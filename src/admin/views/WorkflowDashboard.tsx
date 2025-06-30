'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@payloadcms/ui/providers/Auth';

const WorkflowDashboard: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const res = await fetch('/api/workflows/analytics');
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error('Failed to fetch workflow analytics', err);
      }
    };

    loadSummary();
  }, []);

  if (!summary) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📊 Workflow Dashboard</h2>
      <p>Welcome, {user?.email}</p>

      <div style={{ marginTop: '1rem' }}>
        <ul>
          <li><strong>📝 Total Workflows:</strong> {summary.total}</li>
          <li><strong>🔄 In Progress:</strong> {summary.inProgress}</li>
          <li><strong>✅ Approved:</strong> {summary.approved}</li>
          <li><strong>❌ Rejected:</strong> {summary.rejected}</li>
          <li><strong>⏰ Overdue Steps:</strong> {summary.overdueSteps}</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h4>📅 Last 7 Days Activity</h4>
        <ul>
          {summary.recentLogs?.map((log: any, index: number) => (
            <li key={index} style={{ marginBottom: '0.5rem' }}>
              <strong>{log.action}</strong> by {log.user?.email || 'Unknown'} in <code>{log.collection}</code> / <em>{log.stepLabel}</em><br />
              <span style={{ fontSize: '0.9rem', color: '#666' }}>
                at {new Date(log.timestamp).toLocaleString()}
              </span>
              {log.comment && (
                <div style={{ fontSize: '0.9rem', color: '#444' }}>
                  📝 {log.comment}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WorkflowDashboard;

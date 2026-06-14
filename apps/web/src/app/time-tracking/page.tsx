'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button, LoadingSpinner, Card } from '@/components/ui';

interface TimeEntry {
  entry_id: string;
  job_id: string;
  job_title: string;
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  hourly_rate: number;
  total_amount: number;
  description: string;
  status: 'pending' | 'approved' | 'invoiced';
  screenshot?: string;
}

interface Invoice {
  invoice_id: string;
  client_name: string;
  amount: number;
  date_issued: string;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  time_entries: TimeEntry[];
  payment_link?: string;
}

export default function TimeTrackingPage() {
  const [activeTimer, setActiveTimer] = useState<{
    jobId: string;
    jobTitle: string;
    startTime: number;
  } | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tab, setTab] = useState<'tracking' | 'invoices'>('tracking');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTimer) {
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - activeTimer.startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

  async function loadData() {
    try {
      const token = localStorage.getItem('veritas_token');

      const [entriesRes, invoicesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/time-entries`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invoices`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (entriesRes.ok) {
        const data = await entriesRes.json();
        setTimeEntries(data.data || []);
      }

      if (invoicesRes.ok) {
        const data = await invoicesRes.json();
        setInvoices(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  function startTimer(jobId: string, jobTitle: string) {
    setActiveTimer({
      jobId,
      jobTitle,
      startTime: Date.now(),
    });
  }

  async function stopTimer() {
    if (!activeTimer) return;

    try {
      const token = localStorage.getItem('veritas_token');
      const durationMinutes = Math.floor(elapsed / 60);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/time-entries`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            job_id: activeTimer.jobId,
            duration_minutes: durationMinutes,
            date: new Date().toISOString().split('T')[0],
            description: `Work on ${activeTimer.jobTitle}`,
          }),
        }
      );

      if (res.ok) {
        setActiveTimer(null);
        setElapsed(0);
        loadData();
      }
    } catch (error) {
      console.error('Failed to save time entry:', error);
    }
  }

  async function generateInvoice(timeEntryIds: string[]) {
    try {
      const token = localStorage.getItem('veritas_token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/invoices/generate`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ time_entry_ids: timeEntryIds }),
        }
      );

      if (res.ok) {
        loadData();
        alert('Invoice generated successfully!');
      }
    } catch (error) {
      console.error('Failed to generate invoice:', error);
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const totalEarnings = timeEntries
    .filter((e) => e.status !== 'invoiced')
    .reduce((sum, e) => sum + e.total_amount, 0);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading time tracking..." />;
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black mb-2">
              ⏱️ Time Tracking
            </h1>
            <p className="text-gray-400">
              Track hours and generate invoices automatically
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-800">
            <button
              onClick={() => setTab('tracking')}
              className={`px-4 py-3 font-bold border-b-2 transition-all ${
                tab === 'tracking'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400'
              }`}
            >
              🕐 Time Tracking
            </button>
            <button
              onClick={() => setTab('invoices')}
              className={`px-4 py-3 font-bold border-b-2 transition-all ${
                tab === 'invoices'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400'
              }`}
            >
              📄 Invoices
            </button>
          </div>

          {tab === 'tracking' ? (
            // Time Tracking Tab
            <div className="space-y-6">
              {/* Active Timer */}
              {activeTimer ? (
                <Card
                  variant="elevated"
                  className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-700/30"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-green-400 mb-1">
                        Currently tracking
                      </p>
                      <p className="text-2xl font-bold text-green-300 mb-2">
                        {activeTimer.jobTitle}
                      </p>
                      <p className="text-4xl font-black text-white font-mono">
                        {formatTime(elapsed)}
                      </p>
                    </div>

                    <Button
                      variant="danger"
                      onClick={stopTimer}
                      className="h-fit"
                    >
                      Stop & Save
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card variant="default">
                  <p className="text-gray-400 text-center py-8">
                    No timer active. Start tracking below.
                  </p>
                </Card>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Card variant="default">
                  <p className="text-xs text-gray-400 mb-1">Total Tracked</p>
                  <p className="text-2xl font-black text-cyan-400">
                    {Math.floor(
                      timeEntries.reduce((sum, e) => sum + e.duration_minutes, 0) / 60
                    )}h
                  </p>
                </Card>

                <Card variant="default" className="bg-green-900/20 border-green-700/30">
                  <p className="text-xs text-green-400 mb-1">To Invoice</p>
                  <p className="text-2xl font-black text-green-300">
                    ${totalEarnings.toFixed(2)}
                  </p>
                </Card>

                <Card variant="default">
                  <p className="text-xs text-gray-400 mb-1">Invoiced</p>
                  <p className="text-2xl font-black text-gray-300">
                    ${timeEntries
                      .filter((e) => e.status === 'invoiced')
                      .reduce((sum, e) => sum + e.total_amount, 0)
                      .toFixed(2)}
                  </p>
                </Card>
              </div>

              {/* Time Entries */}
              <Card variant="default">
                <h3 className="text-lg font-bold mb-4">📝 Time Entries</h3>

                {timeEntries.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    No time entries yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {timeEntries.slice(0, 10).map((entry) => (
                      <div
                        key={entry.entry_id}
                        className="p-4 rounded-lg bg-gray-800/30 border border-gray-700 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-bold">{entry.job_title}</p>
                          <p className="text-sm text-gray-400">
                            {entry.date} • {entry.duration_minutes} minutes
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {entry.description}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-black text-cyan-400">
                            ${entry.total_amount.toFixed(2)}
                          </p>
                          <p
                            className={`text-xs font-bold mt-1 px-2 py-1 rounded ${
                              entry.status === 'pending'
                                ? 'bg-yellow-900/30 text-yellow-400'
                                : entry.status === 'approved'
                                ? 'bg-blue-900/30 text-blue-400'
                                : 'bg-green-900/30 text-green-400'
                            }`}
                          >
                            {entry.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Generate Invoice Button */}
              {timeEntries.filter((e) => e.status === 'approved').length > 0 && (
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() =>
                    generateInvoice(
                      timeEntries
                        .filter((e) => e.status === 'approved')
                        .map((e) => e.entry_id)
                    )
                  }
                >
                  📄 Generate Invoice
                </Button>
              )}
            </div>
          ) : (
            // Invoices Tab
            <div className="space-y-4">
              {invoices.length === 0 ? (
                <Card variant="default" className="text-center py-12">
                  <p className="text-3xl mb-2">📄</p>
                  <p className="font-bold">No invoices yet</p>
                </Card>
              ) : (
                invoices.map((invoice) => (
                  <Card key={invoice.invoice_id} variant="default">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold">{invoice.client_name}</p>
                        <p className="text-sm text-gray-400">
                          Issued: {invoice.date_issued}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-black text-cyan-400">
                          ${invoice.amount.toFixed(2)}
                        </p>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full inline-block mt-1 ${
                            invoice.status === 'draft'
                              ? 'bg-gray-700 text-gray-300'
                              : invoice.status === 'sent'
                              ? 'bg-blue-900/30 text-blue-400'
                              : invoice.status === 'paid'
                              ? 'bg-green-900/30 text-green-400'
                              : 'bg-red-900/30 text-red-400'
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-400 mb-3">
                      {invoice.time_entries.length} time entries • Due:{' '}
                      {invoice.due_date}
                    </p>

                    <div className="flex gap-2 flex-wrap">
                      {invoice.status === 'draft' && (
                        <Button variant="outline" size="sm">
                          📝 Edit
                        </Button>
                      )}
                      {invoice.status === 'draft' && (
                        <Button variant="primary" size="sm">
                          📤 Send
                        </Button>
                      )}
                      {invoice.payment_link && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(invoice.payment_link, '_blank')
                          }
                        >
                          💳 Payment Link
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          window.open(
                            `/invoices/${invoice.invoice_id}/pdf`,
                            '_blank'
                          )
                        }
                      >
                        📥 Download PDF
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}

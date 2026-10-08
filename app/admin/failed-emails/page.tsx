"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/admin/ui";
import {
  listFailedEmails,
  retryFailedEmail,
  retryAllFailedEmails,
  deleteFailedEmail,
  type FailedEmail,
} from "@/lib/admin/services/failedEmails";

export default function AdminFailedEmailsPage() {
  const [emails, setEmails] = useState<FailedEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const response = await listFailedEmails(page, 20, statusFilter);
      setEmails(response.emails);
      setTotalPages(response.pagination.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [page, statusFilter]);

  const handleRetry = async (id: string) => {
    try {
      await toast.promise(retryFailedEmail(id), {
        loading: "Retrying email...",
        success: "Retry triggered successfully!",
        error: (err: any) => err.response?.data?.message || err.message || "Retry failed",
      });
      fetchEmails();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleRetryAll = async () => {
    try {
      await toast.promise(retryAllFailedEmails(), {
        loading: "Retrying all pending emails...",
        success: "Batch retry triggered successfully!",
        error: (err: any) => err.response?.data?.message || err.message || "Batch retry failed",
      });
      fetchEmails();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await toast.promise(deleteFailedEmail(id), {
        loading: "Deleting record...",
        success: "Record deleted successfully",
        error: "Failed to delete record",
      });
      fetchEmails();
    } catch (err: any) {
      console.error(err);
    }
  };

  const pendingCount = emails.filter((e) => e.status === "pending").length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <PageHeader
          title="Failed Emails"
          description="View and manage emails that failed to send."
        />
        <button
          onClick={handleRetryAll}
          className="bg-signal text-ink font-medium px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          Retry All Pending
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm text-sand/60 font-body">Status</label>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="bg-sand/[0.04] border border-sand/10 rounded-lg px-3 py-2 text-sand text-sm outline-none cursor-pointer"
        >
          <option value="all" className="bg-ink">All statuses</option>
          <option value="pending" className="bg-ink">Pending</option>
          <option value="retrying" className="bg-ink">Retrying</option>
          <option value="sent" className="bg-ink">Sent</option>
        </select>
      </div>

      {loading && emails.length === 0 ? (
        <p className="text-sand/40 font-body text-sm">Loading emails…</p>
      ) : (
        <div className="bg-sand/[0.04] border border-sand/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="text-left text-sand/40 border-b border-sand/10">
                <th className="p-4 font-normal">To</th>
                <th className="p-4 font-normal">Subject</th>
                <th className="p-4 font-normal">Status</th>
                <th className="p-4 font-normal">Type</th>
                <th className="p-4 font-normal">Retries</th>
                <th className="p-4 font-normal">Last Error</th>
                <th className="p-4 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/10 text-sand/80">
              {emails.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sand/40">
                    No emails found.
                  </td>
                </tr>
              ) : (
                emails.map((email) => (
                  <tr key={email._id} className="hover:bg-sand/[0.02]">
                    <td className="p-4">{email.to}</td>
                    <td className="p-4">{email.subject}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${email.status === "sent"
                          ? "bg-green-500/10 text-green-400"
                          : email.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-blue-500/10 text-blue-400"
                          }`}
                      >
                        {email.status}
                      </span>
                    </td>
                    <td className="p-4 capitalize">{email.emailType}</td>
                    <td className="p-4">{email.retryCount}</td>
                    <td className="p-4 max-w-[200px] truncate" title={email.lastError || "None"}>
                      {email.lastError || "None"}
                    </td>
                    <td className="p-4 space-x-2">
                      {email.status !== "sent" && (
                        <button
                          onClick={() => handleRetry(email._id)}
                          className="text-signal hover:underline"
                        >
                          Retry
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(email._id)}
                        className="text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="p-4 border-t border-sand/10 flex justify-between items-center text-sm">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="text-sand/60 hover:text-sand disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sand/40">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="text-sand/60 hover:text-sand disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

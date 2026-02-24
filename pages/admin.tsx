import { useEffect, useState, FormEvent } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const API_BASE = typeof window !== "undefined" ? window.location.origin : "";

type SubscriptionStatus = "trialing" | "active" | "canceled" | "expired";

interface AdminUser {
  id: string;
  email: string;
  createdAt: string;
  subscription: {
    id: string;
    status: SubscriptionStatus;
    plan: "monthly" | "yearly" | null;
    platform: "google_play" | "app_store" | "stripe_web" | null;
    currentPeriodEnd: string | null;
  } | null;
}

interface AdminStats {
  totals: {
    totalUsers: number;
    newUsers30d: number;
    totalSubscriptions: number;
    newSubscriptions30d: number;
  };
  byStatus: {
    active: number;
    trialing: number;
    canceled: number;
    expired: number;
  };
  byPlan: {
    activeMonthly: number;
    activeYearly: number;
  };
  revenueEstimate: {
    mrrUsd: number;
    arrUsd: number;
  };
  generatedAt: string;
}

const AdminPage: NextPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);

  const token =
    typeof router.query.token === "string" ? router.query.token : "";

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const [usersRes, statsRes] = await Promise.all([
          fetch(`${API_BASE}/api/admin/users`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE}/api/admin/stats`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const usersData = await usersRes.json().catch(() => ({}));
        if (!usersRes.ok) {
          setError(
            (usersData.error as string) || "Failed to load users"
          );
          return;
        }
        setUsers((usersData.users as AdminUser[]) ?? []);

        const statsData = await statsRes.json().catch(() => ({}));
        if (!statsRes.ok) {
          setError(
            (statsData.error as string) || "Failed to load stats"
          );
          return;
        }
        setStats(statsData as AdminStats);
      } catch {
        setError("Network error while loading admin data");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const handleSave = async (
    e: FormEvent,
    user: AdminUser,
    status: SubscriptionStatus,
    activeUntil: string
  ) => {
    e.preventDefault();
    if (!token) {
      setError("Missing token. Please log in again.");
      return;
    }
    setSavingUserId(user.id);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/set-subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          status,
          activeUntil: activeUntil || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data.error as string) || "Failed to update subscription");
        return;
      }
      const updated = data.subscription as {
        status: SubscriptionStatus;
        currentPeriodEnd: string | null;
      };
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? {
                ...u,
                subscription: {
                  ...(u.subscription ?? {
                    id: "",
                    plan: null,
                    platform: null,
                  }),
                  status: updated.status,
                  currentPeriodEnd: updated.currentPeriodEnd,
                },
              }
            : u
        )
      );
    } catch {
      setError("Network error while saving subscription");
    } finally {
      setSavingUserId(null);
    }
  };

  if (!token) {
    return (
      <main style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Admin</h1>
          <p style={styles.text}>
            No token provided. Please log in first, then open the admin page
            with your token:
          </p>
          <p style={styles.code}>
            /admin?token=&lt;your_jwt_token_from_login_or_embed_url&gt;
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Admin: Users, Subscriptions &amp; Reports</h1>
        {stats && (
          <div style={styles.statsRow}>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Total users</div>
              <div style={styles.statValue}>
                {stats.totals.totalUsers}
              </div>
              <div style={styles.statSub}>
                +{stats.totals.newUsers30d} last 30 days
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Active subscriptions</div>
              <div style={styles.statValue}>
                {stats.byStatus.active}
              </div>
              <div style={styles.statSub}>
                {stats.byPlan.activeMonthly} monthly ·{" "}
                {stats.byPlan.activeYearly} yearly
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Est. MRR (USD)</div>
              <div style={styles.statValue}>
                {stats.revenueEstimate.mrrUsd.toFixed(0)}
              </div>
              <div style={styles.statSub}>
                ARR ≈ ${stats.revenueEstimate.arrUsd.toFixed(0)}
              </div>
            </div>
          </div>
        )}
        <p style={styles.text}>
          Below is the full user list with their latest subscription. You can
          update status and active-until date.
        </p>
        {error && <p style={styles.error}>{error}</p>}
        {loading ? (
          <p style={styles.text}>Loading users…</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Created</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Active until</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const sub = user.subscription;
                  const defaultStatus: SubscriptionStatus =
                    sub?.status ?? "trialing";
                  const defaultDate = sub?.currentPeriodEnd
                    ? new Date(sub.currentPeriodEnd)
                        .toISOString()
                        .slice(0, 10)
                    : "";
                  return (
                    <tr key={user.id}>
                      <td style={styles.td}>{user.email}</td>
                      <td style={styles.td}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td style={styles.td}>
                        <select
                          defaultValue={defaultStatus}
                          onChange={(e) => {
                            user.subscription = {
                              ...(user.subscription ?? {
                                id: "",
                                plan: null,
                                platform: null,
                              }),
                              status: e.target
                                .value as SubscriptionStatus,
                              currentPeriodEnd:
                                user.subscription?.currentPeriodEnd ?? null,
                            };
                          }}
                          style={styles.input}
                        >
                          <option value="trialing">trialing</option>
                          <option value="active">active</option>
                          <option value="canceled">canceled</option>
                          <option value="expired">expired</option>
                        </select>
                      </td>
                      <td style={styles.td}>
                        <input
                          type="date"
                          defaultValue={defaultDate}
                          onChange={(e) => {
                            if (user.subscription) {
                              user.subscription.currentPeriodEnd =
                                e.target.value || null;
                            }
                          }}
                          style={styles.input}
                        />
                      </td>
                      <td style={styles.td}>
                        <form
                          onSubmit={(e) =>
                            handleSave(
                              e,
                              user,
                              (user.subscription?.status ??
                                defaultStatus) as SubscriptionStatus,
                              (user.subscription?.currentPeriodEnd ??
                                defaultDate) as string
                            )
                          }
                        >
                          <button
                            type="submit"
                            disabled={savingUserId === user.id}
                            style={styles.button}
                          >
                            {savingUserId === user.id
                              ? "Saving…"
                              : "Save"}
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    fontFamily: "system-ui, -apple-system, sans-serif",
    background: "#FAF9F6",
  },
  card: {
    width: "100%",
    maxWidth: 960,
    background: "#FFFFFF",
    padding: 24,
    borderRadius: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  title: {
    margin: "0 0 8px",
    fontSize: 24,
    fontWeight: 500,
    color: "#2D3748",
  },
  text: {
    margin: "0 0 16px",
    color: "#4A5568",
    fontSize: 14,
  },
  error: {
    margin: "0 0 16px",
    color: "#C53030",
    fontSize: 14,
  },
  tableWrapper: {
    maxHeight: "70vh",
    overflow: "auto" as const,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: 13,
  },
  th: {
    textAlign: "left" as const,
    padding: "8px 6px",
    borderBottom: "1px solid #E2E8F0",
    fontWeight: 500,
    color: "#2D3748",
    background: "#F7FAFC",
    position: "sticky" as const,
    top: 0,
  },
  td: {
    padding: "8px 6px",
    borderBottom: "1px solid #EDF2F7",
    verticalAlign: "middle" as const,
  },
  input: {
    width: "100%",
    padding: "6px 8px",
    borderRadius: 6,
    border: "1px solid #CBD5E0",
    fontSize: 13,
  },
  button: {
    padding: "6px 10px",
    borderRadius: 999,
    border: "none",
    background: "#2B6CB0",
    color: "#FFFFFF",
    cursor: "pointer",
    fontSize: 12,
  },
  code: {
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    background: "#F7FAFC",
    fontFamily: "monospace",
    fontSize: 12,
  },
  statsRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: "1 1 180px",
    minWidth: 0,
    padding: 12,
    borderRadius: 12,
    background: "#F7FAFC",
    border: "1px solid #E2E8F0",
  },
  statLabel: {
    fontSize: 11,
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    color: "#718096",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 600,
    color: "#2D3748",
  },
  statSub: {
    marginTop: 2,
    fontSize: 12,
    color: "#4A5568",
  },
};

export default AdminPage;


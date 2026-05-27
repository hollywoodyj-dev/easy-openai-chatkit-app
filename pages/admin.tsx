import { useEffect, useState, FormEvent, useMemo } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const API_BASE = typeof window !== "undefined" ? window.location.origin : "";

type SubscriptionStatus = "trialing" | "active" | "canceled" | "expired";

interface AdminUser {
  id: string;
  email: string;
  createdAt: string;
  country?: string | null;
  effectiveStatus?: SubscriptionStatus | "none";
  subscription: {
    id: string;
    status: SubscriptionStatus;
    plan: "monthly" | "yearly" | null;
    platform: "google_play" | "app_store" | "stripe_web" | null;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    /** Apple original_transaction_id / transaction_id, Play purchase token, etc. */
    externalSubscriptionId: string | null;
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
  byCountry?: {
    country: string | null;
    users: number;
  }[];
  revenueEstimate: {
    mrrUsd: number;
    arrUsd: number;
  };
  generatedAt: string;
}

interface ConversionCatalogEntry {
  name: string;
  label: string;
  tier: string;
  description: string;
  count30d: number;
}

interface ConversionTrackingData {
  windowDays: number;
  generatedAt: string;
  ga4Configured: boolean;
  ga4MeasurementId: string | null;
  primaryKpi: { event: string; count30d: number };
  catalog: ConversionCatalogEntry[];
  paidLpBreakdown: { lp: string; count: number }[];
  recentEvents: {
    id: string;
    eventName: string;
    userId: string | null;
    source: string | null;
    lp: string | null;
    adGroup: string | null;
    platform: string | null;
    path: string | null;
    createdAt: string;
  }[];
}

const AdminPage: NextPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [clearingUserId, setClearingUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [conversion, setConversion] = useState<ConversionTrackingData | null>(
    null,
  );
  const [conversionError, setConversionError] = useState<string | null>(null);

  const token =
    typeof router.query.token === "string" ? router.query.token : "";

  /** Same Apple purchase identity written to multiple rows (common after pre-guard testing). */
  const duplicateAppStoreRefs = useMemo(() => {
    const counts = new Map<string, number>();
    for (const u of users) {
      const ref = u.subscription?.externalSubscriptionId?.trim();
      if (!ref || u.subscription?.platform !== "app_store") continue;
      counts.set(ref, (counts.get(ref) ?? 0) + 1);
    }
    return new Set(
      [...counts.entries()].filter(([, n]) => n > 1).map(([id]) => id)
    );
  }, [users]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const authHeaders = { Authorization: `Bearer ${token}` };
        const [usersRes, statsRes, conversionRes] = await Promise.all([
          fetch(`${API_BASE}/api/admin/users`, { headers: authHeaders }),
          fetch(`${API_BASE}/api/admin/stats`, { headers: authHeaders }),
          fetch(`${API_BASE}/api/admin/conversion-tracking`, {
            headers: authHeaders,
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

        const conversionData = await conversionRes.json().catch(() => ({}));
        if (!conversionRes.ok) {
          setConversion(null);
          setConversionError(
            (conversionData.error as string) ||
              "Failed to load conversion tracking",
          );
        } else {
          setConversion(conversionData as ConversionTrackingData);
          setConversionError(null);
        }
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

      const locRes = await fetch(
        `${API_BASE}/api/admin/set-user-location`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user.id,
            country: user.country ?? null,
          }),
        }
      );
      const locData = await locRes.json().catch(() => ({}));
      if (!locRes.ok) {
        setError(
          (locData.error as string) ||
            "Subscription updated, but failed to update location"
        );
        return;
      }
      const updated = data.subscription as {
        id?: string;
        status: SubscriptionStatus;
        plan?: "monthly" | "yearly" | null;
        platform?: "google_play" | "app_store" | "stripe_web" | null;
        currentPeriodStart?: string | null;
        currentPeriodEnd: string | null;
        externalSubscriptionId?: string | null;
      };
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? {
                ...u,
                country: user.country ?? null,
                subscription: {
                  ...(u.subscription ?? {
                    id: "",
                    plan: null,
                    platform: null,
                    currentPeriodStart: null,
                    currentPeriodEnd: null,
                    externalSubscriptionId: null,
                  }),
                  id: updated.id ?? u.subscription?.id ?? "",
                  status: updated.status,
                  plan: updated.plan ?? u.subscription?.plan ?? null,
                  platform:
                    updated.platform ?? u.subscription?.platform ?? null,
                  currentPeriodStart:
                    updated.currentPeriodStart ??
                    u.subscription?.currentPeriodStart ??
                    null,
                  currentPeriodEnd: updated.currentPeriodEnd,
                  externalSubscriptionId:
                    updated.externalSubscriptionId ??
                    u.subscription?.externalSubscriptionId ??
                    null,
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

  const handleClearStoreRef = async (user: AdminUser) => {
    if (!token) {
      setError("Missing token. Please log in again.");
      return;
    }
    const ref = user.subscription?.externalSubscriptionId?.trim();
    if (!ref) return;

    if (
      typeof window !== "undefined" &&
      !window.confirm(
        `Clear Store ref for ${user.email}?\n\nThis removes the Apple purchase link from this row so another Wisewave account can verify the same Apple subscription. Only clear rows that should NOT own this Apple sub.`
      )
    ) {
      return;
    }

    setClearingUserId(user.id);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/clear-subscription-store-ref`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data.error as string) || "Failed to clear Store ref");
        return;
      }
      const updated = data.subscription as {
        externalSubscriptionId: string | null;
      };
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id && u.subscription
            ? {
                ...u,
                subscription: {
                  ...u.subscription,
                  externalSubscriptionId: updated.externalSubscriptionId ?? null,
                },
              }
            : u
        )
      );
    } catch {
      setError("Network error while clearing Store ref");
    } finally {
      setClearingUserId(null);
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
        {stats?.byCountry && stats.byCountry.length > 0 && (
          <p style={styles.text}>
            Top countries:&nbsp;
            {stats.byCountry
              .slice(0, 5)
              .map((c) => `${c.country ?? "Unknown"} (${c.users})`)
              .join(", ")}
          </p>
        )}

        <section style={styles.trackingSection}>
          <h2 style={styles.trackingTitle}>Conversion tracking (last 30 days)</h2>
          {conversionError && (
            <p style={styles.error}>{conversionError}</p>
          )}
          {conversion && (
            <>
              <p style={styles.text}>
                GA4:{" "}
                {conversion.ga4Configured ? (
                  <>
                    configured (<code style={styles.inlineCode}>
                      {conversion.ga4MeasurementId}
                    </code>
                    )
                  </>
                ) : (
                  <strong>not configured</strong>
                )}{" "}
                — set <code style={styles.inlineCode}>
                  NEXT_PUBLIC_GA_MEASUREMENT_ID
                </code>{" "}
                on Vercel for client events.
              </p>
              <div style={styles.statsRow}>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Primary KPI</div>
                  <div style={styles.statValue}>
                    {conversion.primaryKpi.count30d}
                  </div>
                  <div style={styles.statSub}>
                    {conversion.primaryKpi.event}
                  </div>
                </div>
                {conversion.paidLpBreakdown.map((row) => (
                  <div key={row.lp} style={styles.statCard}>
                    <div style={styles.statLabel}>{row.lp}</div>
                    <div style={styles.statValue}>{row.count}</div>
                    <div style={styles.statSub}>paid LP events</div>
                  </div>
                ))}
              </div>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Event</th>
                      <th style={styles.th}>Tier</th>
                      <th style={styles.th}>30d count</th>
                      <th style={styles.th}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conversion.catalog.map((entry) => (
                      <tr key={entry.name}>
                        <td style={styles.td}>
                          <span style={styles.mono}>{entry.name}</span>
                        </td>
                        <td style={styles.td}>{entry.tier}</td>
                        <td style={styles.td}>{entry.count30d}</td>
                        <td style={styles.td}>{entry.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h3 style={styles.trackingSubtitle}>Recent events</h3>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>When</th>
                      <th style={styles.th}>Event</th>
                      <th style={styles.th}>Source</th>
                      <th style={styles.th}>LP / ad group</th>
                      <th style={styles.th}>Path</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conversion.recentEvents.map((ev) => (
                      <tr key={ev.id}>
                        <td style={styles.td}>
                          {new Date(ev.createdAt).toLocaleString()}
                        </td>
                        <td style={styles.td}>
                          <span style={styles.mono}>{ev.eventName}</span>
                        </td>
                        <td style={styles.td}>{ev.source ?? "—"}</td>
                        <td style={styles.td}>
                          {[ev.lp, ev.adGroup].filter(Boolean).join(" · ") ||
                            "—"}
                        </td>
                        <td style={styles.td}>{ev.path ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {!conversion && !conversionError && loading && (
            <p style={styles.text}>Loading conversion data…</p>
          )}
        </section>

        <p style={styles.text}>
          Below is the full user list with their latest subscription. You can
          update status and active-until date. For App Store subscriptions,
          <strong> Store ref</strong> is the value used to tie an Apple purchase
          to this Wisewave account (typically Apple&apos;s{" "}
          <code style={styles.inlineCode}>original_transaction_id</code>).
          If several emails show the same ref, that is usually from earlier
          testing with one Apple ID before ownership checks; only one Wisewave
          account should stay linked to that Apple subscription.
        </p>
        {duplicateAppStoreRefs.size > 0 && (
          <p style={styles.warnBanner}>
            <strong>Duplicate Store ref on app_store:</strong>{" "}
            {duplicateAppStoreRefs.size} value(s) appear on more than one user.
            Rows with a highlighted Store ref share the same Apple subscription
            identity.             Use <strong>Clear ref</strong> on rows that should not own this Apple
            subscription, then the intended account can use Restore purchase again.
          </p>
        )}
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
                  <th style={styles.th}>Country</th>
                  <th style={styles.th}>Plan</th>
                  <th style={styles.th}>Platform</th>
                  <th style={styles.th}>Store ref</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Active until</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const sub = user.subscription;
                  const defaultStatus: SubscriptionStatus =
                    (user.effectiveStatus === "none" ? "trialing" : user.effectiveStatus) ??
                    sub?.status ??
                    "trialing";
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
                        <input
                          type="text"
                          placeholder="US, GB, HK…"
                          defaultValue={user.country ?? ""}
                          onChange={(e) => {
                            user.country = e.target.value || null;
                          }}
                          style={styles.input}
                        />
                      </td>
                      <td style={styles.td}>
                        {sub?.plan ? (
                          <span style={styles.mono}>{sub.plan}</span>
                        ) : (
                          <span style={styles.muted}>—</span>
                        )}
                      </td>
                      <td style={styles.td}>
                        {sub?.platform ? (
                          <span style={styles.mono}>{sub.platform}</span>
                        ) : (
                          <span style={styles.muted}>—</span>
                        )}
                      </td>
                      <td
                        style={{
                          ...styles.td,
                          ...(sub?.externalSubscriptionId &&
                          sub?.platform === "app_store" &&
                          duplicateAppStoreRefs.has(
                            sub.externalSubscriptionId.trim()
                          )
                            ? styles.tdDupRef
                            : null),
                        }}
                      >
                        {sub?.externalSubscriptionId ? (
                          <span
                            style={styles.monoSmall}
                            title={sub.externalSubscriptionId}
                          >
                            {sub.externalSubscriptionId}
                          </span>
                        ) : (
                          <span style={styles.muted}>—</span>
                        )}
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
                                currentPeriodStart: null,
                                externalSubscriptionId: null,
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
                        {sub?.status && user.effectiveStatus && sub.status !== user.effectiveStatus && (
                          <div style={{ fontSize: 10, color: "#C05621", marginTop: 4 }}>
                            effective: {user.effectiveStatus}
                          </div>
                        )}
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
                        <div style={styles.actionsCol}>
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
                              disabled={
                                savingUserId === user.id ||
                                clearingUserId === user.id
                              }
                              style={styles.button}
                            >
                              {savingUserId === user.id
                                ? "Saving…"
                                : "Save"}
                            </button>
                          </form>
                          {sub?.externalSubscriptionId ? (
                            <button
                              type="button"
                              disabled={
                                savingUserId === user.id ||
                                clearingUserId === user.id
                              }
                              style={styles.buttonSecondary}
                              onClick={() => void handleClearStoreRef(user)}
                            >
                              {clearingUserId === user.id
                                ? "Clearing…"
                                : "Clear ref"}
                            </button>
                          ) : null}
                        </div>
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
    maxWidth: 1200,
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
  tdDupRef: {
    background: "#FFFAF0",
    boxShadow: "inset 0 0 0 1px #F6AD55",
  },
  warnBanner: {
    margin: "0 0 16px",
    padding: "10px 12px",
    borderRadius: 8,
    background: "#FFFAF0",
    border: "1px solid #F6AD55",
    color: "#744210",
    fontSize: 13,
    lineHeight: 1.45,
  },
  input: {
    width: "100%",
    padding: "6px 8px",
    borderRadius: 6,
    border: "1px solid #CBD5E0",
    fontSize: 13,
  },
  mono: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: 12,
  },
  monoSmall: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: 11,
    wordBreak: "break-all" as const,
    display: "block",
    maxWidth: 220,
  },
  muted: {
    color: "#A0AEC0",
    fontSize: 12,
  },
  inlineCode: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: 12,
    background: "#EDF2F7",
    padding: "1px 4px",
    borderRadius: 4,
  },
  actionsCol: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 6,
    alignItems: "flex-start" as const,
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
  buttonSecondary: {
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid #C05621",
    background: "#FFFFFF",
    color: "#C05621",
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
  trackingSection: {
    marginBottom: 24,
    paddingTop: 8,
    borderTop: "1px solid #E2E8F0",
  },
  trackingTitle: {
    margin: "0 0 12px",
    fontSize: 18,
    fontWeight: 500,
    color: "#2D3748",
  },
  trackingSubtitle: {
    margin: "16px 0 8px",
    fontSize: 14,
    fontWeight: 500,
    color: "#2D3748",
  },
};

export default AdminPage;


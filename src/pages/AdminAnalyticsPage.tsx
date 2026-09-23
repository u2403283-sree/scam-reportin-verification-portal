import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import {
  ShieldAlert,
  BarChart3,
  TrendingUp,
  Landmark,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Filter
} from 'lucide-react';
import { api } from '../services/api.ts';
import { AnalyticsData } from '../types/index.ts';
import { StatCard } from '../components/ui/StatCard.tsx';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.tsx';
import { RiskBadge } from '../components/ui/RiskBadge.tsx';

export const AdminAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      setLoading(true);
      try {
        const res = await api.getAnalytics();
        setData(res);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="py-24">
        <LoadingSpinner label="Compiling cyber telemetry and risk distribution charts..." />
      </div>
    );
  }

  const customTooltipStyle = {
    backgroundColor: '#090d16',
    borderColor: '#334155',
    borderRadius: '8px',
    color: '#f8fafc',
    fontSize: '12px',
    fontFamily: 'JetBrains Mono, monospace',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin"
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 font-mono mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Moderation
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-purple-400" />
            <span>Cyber Threat Intelligence & Analytics</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Aggregated trends, financial loss vectors, category prevalence, and recurring target identifiers.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto">
          <Calendar className="w-3.5 h-3.5 text-purple-400" />
          <span>Q3 2026 Telemetry</span>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Reports Indexed"
          value={data.totalReports}
          subtitle="Citizen incident filings"
          icon={ShieldAlert}
          color="purple"
        />
        <StatCard
          title="Total Financial Loss"
          value={`₹${(data.totalAmountLost / 100000).toFixed(1)} Lakhs`}
          subtitle="Cumulative reported loss"
          icon={Landmark}
          color="rose"
        />
        <StatCard
          title="Audited Scams"
          value={data.verifiedReports}
          subtitle="Verified threats"
          icon={ShieldCheck}
          color="emerald"
        />
        <StatCard
          title="Critical / High Ratio"
          value={`${Math.round((data.highRiskReports / (data.totalReports || 1)) * 100)}%`}
          subtitle="Severe financial risk cases"
          icon={AlertTriangle}
          color="amber"
        />
      </div>

      {/* Row 1: Reports Over Time & Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reports & Financial Loss (Area Chart) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
                Monthly Incident Influx & Financial Loss
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Number of filed cases vs financial damage (in ₹ Thousands)
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.reportsOverTime}>
                <defs>
                  <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="reports"
                  name="Reports Filed"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorReports)"
                />
                <Area
                  type="monotone"
                  dataKey="lossInThousands"
                  name="Loss (₹ Thousands)"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorLoss)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution (Pie Chart) */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            Threat Severity Distribution
          </h3>
          <p className="text-xs text-slate-400">Cases classified by algorithmic scoring</p>

          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {data.riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800 font-mono">
            {data.riskDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300">{item.name}:</span>
                <span className="font-bold text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Category Breakdown & Top Scammer Identifiers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown Bar Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            Incident Prevalence by Category
          </h3>
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.reportsByCategory}
                layout="vertical"
                margin={{ left: 20, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#94a3b8"
                  tick={{ fontSize: 11 }}
                  width={110}
                />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="count" fill="#38bdf8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Flagged Scam Identifiers */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            Most Frequently Reported Scam Identifiers
          </h3>
          <p className="text-xs text-slate-400">
            Clustered telephone numbers, fraudulent domains, and bank accounts with multiple independent victim reports.
          </p>

          <div className="space-y-2.5">
            {data.topReportedIdentifiers.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {item.type}
                    </span>
                    <span className="font-mono font-bold text-white text-xs">
                      {item.masked}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Primary Vector: {item.category}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded text-[11px]">
                    {item.count} Reports
                  </span>
                  <RiskBadge level={item.riskLevel} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

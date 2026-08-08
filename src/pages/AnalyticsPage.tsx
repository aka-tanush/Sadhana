import React, { useState } from 'react';
import { useSadhana } from '../context/JapaContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { BarChart3, Flame, Award, PieChart as PieIcon, Activity } from 'lucide-react';
import { formatNumber } from '../utils/formatters';

export const AnalyticsPage: React.FC = () => {
  const {
    dailyChartData,
    weeklyChartData,
    monthlyChartData,
    categoryDistribution,
    heatmapData,
    totalOverallCount,
    currentStreak,
    longestStreak,
    sadhanas,
    entries
  } = useSadhana();

  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Find most practiced Sadhana
  const getMostPracticedSadhana = () => {
    if (sadhanas.length === 0 || entries.length === 0) return null;
    const countMap = new Map<string, number>();
    entries.forEach(e => {
      countMap.set(e.sadhanaId, (countMap.get(e.sadhanaId) || 0) + e.count);
    });

    let topId = '';
    let topCount = 0;
    countMap.forEach((cnt, id) => {
      if (cnt > topCount) {
        topCount = cnt;
        topId = id;
      }
    });

    const sadhana = sadhanas.find(s => s.id === topId);
    return sadhana ? { sadhana, count: topCount } : null;
  };

  const topSadhanaInfo = getMostPracticedSadhana();

  // Average daily count across active days
  const activeDaysCount = heatmapData.filter(d => d.count > 0).length;
  const avgDailyCount = activeDaysCount > 0 ? Math.round(totalOverallCount / activeDaysCount) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-amber-300/70 dark:border-amber-900/50 shadow-xs">
        <div>
          <h2 className="text-2xl font-bold font-rozha text-amber-950 dark:text-amber-100 flex items-center gap-2 tracking-wide">
            <BarChart3 className="w-6 h-6 text-amber-600" />
            <span>Sadhana Analytics & Insights</span>
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
            Deep insights into your spiritual practice consistency, category distribution, and streak milestones.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1 bg-amber-100/60 dark:bg-stone-800/80 p-1 rounded-2xl border border-amber-200/60 dark:border-stone-700">
          {(['daily', 'weekly', 'monthly'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                timeframe === tf
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-stone-600 dark:text-stone-300 hover:text-amber-800'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 border border-amber-200/50">
          <p className="text-xs text-stone-500 font-semibold">Total Chants Logged</p>
          <p className="text-2xl font-black text-amber-950 dark:text-amber-100 font-mono mt-1">
            {formatNumber(totalOverallCount)}
          </p>
        </div>

        <div className="glass-card p-5 border border-amber-200/50">
          <p className="text-xs text-stone-500 font-semibold">Average Daily Count</p>
          <p className="text-2xl font-black text-orange-600 font-mono mt-1">
            ~{formatNumber(avgDailyCount)} / Day
          </p>
        </div>

        <div className="glass-card p-5 border border-amber-200/50">
          <p className="text-xs text-stone-500 font-semibold">Current / Max Streak</p>
          <p className="text-2xl font-black text-amber-800 dark:text-amber-200 font-mono mt-1">
            🔥 {currentStreak} / {longestStreak} Days
          </p>
        </div>

        <div className="glass-card p-5 border border-amber-200/50">
          <p className="text-xs text-stone-500 font-semibold">Most Practiced Sadhana</p>
          <p className="text-base font-bold text-amber-950 dark:text-amber-100 truncate mt-1">
            {topSadhanaInfo ? topSadhanaInfo.sadhana.name : 'N/A'}
          </p>
          {topSadhanaInfo && (
            <p className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold">
              {formatNumber(topSadhanaInfo.count)} Chants Total
            </p>
          )}
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Bar/Line Chart Column */}
        <div className="lg:col-span-8 glass-card p-6 border border-amber-200/60">
          <h3 className="text-base font-bold font-cinzel text-amber-950 dark:text-amber-100 mb-4 capitalize flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-600" />
            <span>{timeframe} Chant Progress Chart</span>
          </h3>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {timeframe === 'daily' ? (
                <BarChart data={dailyChartData}>
                  <XAxis dataKey="displayDate" stroke="#888888" fontSize={11} />
                  <YAxis stroke="#888888" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1C1613',
                      borderColor: '#F59E0B',
                      borderRadius: '12px',
                      color: '#FFF'
                    }}
                  />
                  <Bar dataKey="count" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                </BarChart>
              ) : timeframe === 'weekly' ? (
                <BarChart data={weeklyChartData}>
                  <XAxis dataKey="label" stroke="#888888" fontSize={10} />
                  <YAxis stroke="#888888" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1C1613',
                      borderColor: '#EA580C',
                      borderRadius: '12px',
                      color: '#FFF'
                    }}
                  />
                  <Bar dataKey="count" fill="#EA580C" radius={[6, 6, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={monthlyChartData}>
                  <XAxis dataKey="label" stroke="#888888" fontSize={11} />
                  <YAxis stroke="#888888" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1C1613',
                      borderColor: '#D97706',
                      borderRadius: '12px',
                      color: '#FFF'
                    }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#F59E0B" strokeWidth={3} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart Column */}
        <div className="lg:col-span-4 glass-card p-6 border border-amber-200/60 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold font-cinzel text-amber-950 dark:text-amber-100 mb-4 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-amber-600" />
              <span>Category Breakdown</span>
            </h3>

            {categoryDistribution.length === 0 ? (
              <p className="text-xs text-stone-500 py-12 text-center">No categories logged yet.</p>
            ) : (
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-amber-200/40">
            {categoryDistribution.map(cat => (
              <div key={cat.name} className="flex items-center gap-1.5 text-xs font-semibold">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                <span>{cat.name} ({cat.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 365-Day GitHub-style Heat Map Grid */}
      <div className="glass-card p-6 border border-amber-200/60">
        <h3 className="text-base font-bold font-cinzel text-amber-950 dark:text-amber-100 mb-4">
          365-Day Annual Sadhana Activity Matrix
        </h3>

        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto no-scrollbar p-1">
          {heatmapData.map(day => {
            let bgClass = 'bg-stone-200/60 dark:bg-stone-800';
            if (day.intensity === 1) bgClass = 'bg-amber-200 dark:bg-amber-950';
            if (day.intensity === 2) bgClass = 'bg-amber-400';
            if (day.intensity === 3) bgClass = 'bg-amber-600';
            if (day.intensity === 4) bgClass = 'bg-orange-600';

            return (
              <div
                key={day.date}
                title={`${day.date}: ${day.count} Chants`}
                className={`w-3.5 h-3.5 rounded-sm ${bgClass} transition-all hover:scale-125`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

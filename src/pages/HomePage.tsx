import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { 
  Flame, 
  Gauge, 
  TrendingUp, 
  Wind, 
  Droplets,
  AlertCircle,
  CheckCircle,
  Activity
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  generateBoilerData, 
  generateTimeSeriesData, 
  getCurrentKPI,
  type KPIData,
  type BoilerData 
} from '../utils/mockData';

export function HomePage() {
  const [kpi, setKpi] = useState<KPIData>(getCurrentKPI());
  const [realtimeData, setRealtimeData] = useState<BoilerData[]>([]);
  const [historicalData] = useState(generateTimeSeriesData(24));

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setKpi(getCurrentKPI());
      
      setRealtimeData(prev => {
        const newData = generateBoilerData();
        const updated = [...prev, newData].slice(-30);
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const statusColor = {
    optimal: 'text-green-500',
    warning: 'text-yellow-500',
    critical: 'text-red-500',
  };

  const statusBg = {
    optimal: 'bg-green-500/10 border-green-500/20',
    warning: 'bg-yellow-500/10 border-yellow-500/20',
    critical: 'bg-red-500/10 border-red-500/20',
  };

  const fuelMixData = [
    { name: 'Batubara', value: 100 - kpi.cofringRatio, fill: '#334155' },
    { name: 'Biomassa', value: kpi.cofringRatio, fill: '#f97316' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard Monitoring Boiler</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Real-time monitoring dan analisis performa cofiring</p>
        </div>
        <div className={`px-4 py-2 rounded-lg border ${statusBg[kpi.status]}`}>
          <div className="flex items-center gap-2">
            {kpi.status === 'optimal' ? (
              <CheckCircle className={`w-5 h-5 ${statusColor[kpi.status]}`} />
            ) : (
              <AlertCircle className={`w-5 h-5 ${statusColor[kpi.status]}`} />
            )}
            <span className={`font-medium ${statusColor[kpi.status]} capitalize`}>
              {kpi.status === 'optimal' ? 'Optimal' : kpi.status === 'warning' ? 'Peringatan' : 'Kritis'}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Suhu Steam</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {kpi.steamTemp.toFixed(1)}°C
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Target: 538-539°C</p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-lg">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Tekanan Drum</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {kpi.drumPressure.toFixed(1)} bar
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Target: 248-249 bar</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
              <Gauge className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Efisiensi</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {kpi.efficiency.toFixed(1)}%
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Optimal
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Emisi CO₂</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {kpi.co2Emission.toFixed(0)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">mg/Nm³</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
              <Wind className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Rasio Cofiring</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {kpi.cofringRatio.toFixed(1)}%
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Max: 5%</p>
            </div>
            <div className="bg-emerald-100 dark:bg-emerald-900/20 p-3 rounded-lg">
              <Droplets className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature & Pressure Trend */}
        <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Tren Suhu & Tekanan (24 Jam)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(ts) => new Date(ts).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis yAxisId="left" stroke="#f97316" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                labelFormatter={(ts) => new Date(ts).toLocaleString('id-ID')}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="steamTemp" 
                stroke="#f97316" 
                name="Suhu (°C)" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="drumPressure" 
                stroke="#3b82f6" 
                name="Tekanan (bar)" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Efficiency & Emissions */}
        <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Efisiensi & Emisi CO₂ (24 Jam)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={historicalData}>
              <defs>
                <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(ts) => new Date(ts).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis yAxisId="left" stroke="#10b981" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#a855f7" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                labelFormatter={(ts) => new Date(ts).toLocaleString('id-ID')}
              />
              <Legend />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="efficiency" 
                stroke="#10b981" 
                fill="url(#colorEff)"
                name="Efisiensi (%)" 
                strokeWidth={2}
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="co2Emission" 
                stroke="#a855f7" 
                fill="url(#colorCO2)"
                name="CO₂ (mg/Nm³)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fuel Flow Rates */}
        <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Flow Rate Bahan Bakar
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={historicalData.slice(-12)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(ts) => new Date(ts).toLocaleTimeString('id-ID', { hour: '2-digit' })}
                stroke="#64748b"
                fontSize={11}
              />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                labelFormatter={(ts) => new Date(ts).toLocaleString('id-ID')}
              />
              <Legend />
              <Bar dataKey="coalFlow" fill="#334155" name="Batubara (ton/hr)" />
              <Bar dataKey="biomassFlow" fill="#f97316" name="Biomassa (ton/hr)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Fuel Mix Pie Chart */}
        <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Komposisi Bahan Bakar
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={fuelMixData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                outerRadius={80}
                dataKey="value"
              >
                {fuelMixData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                formatter={(value: number) => `${value.toFixed(1)}%`}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Rasio Cofiring: <span className="font-semibold text-orange-500">{kpi.cofringRatio.toFixed(1)}%</span>
            </p>
          </div>
        </Card>

        {/* Emission Levels */}
        <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Level Emisi Saat Ini
          </h3>
          <div className="space-y-4 mt-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">O₂</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {generateBoilerData().o2Level.toFixed(2)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(generateBoilerData().o2Level / 5) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">CO</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {generateBoilerData().coLevel.toFixed(0)} ppm
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${(generateBoilerData().coLevel / 100) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">NOₓ</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {generateBoilerData().noxLevel.toFixed(0)} mg/Nm³
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${(generateBoilerData().noxLevel / 300) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">CO₂</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {kpi.co2Emission.toFixed(0)} mg/Nm³
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${(kpi.co2Emission / 1000) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart,
  Area
} from 'recharts';
import { 
  Search, 
  Download, 
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar
} from 'lucide-react';
import { generateTimeSeriesData, type BoilerData } from '../utils/mockData';

export function DetailBoilerPage() {
  const [historicalData] = useState(generateTimeSeriesData(168)); // 7 days
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  const getFilteredData = () => {
    const hours = {
      '24h': 24,
      '7d': 168,
      '30d': 720,
    }[selectedTimeRange] || 24;
    
    return historicalData.slice(-Math.floor(hours / 1.68));
  };

  const filteredData = getFilteredData();

  // Calculate statistics
  const calculateStats = (key: keyof BoilerData) => {
    const values = filteredData.map(d => d[key] as number);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const latest = values[values.length - 1];
    const previous = values[values.length - 2];
    const trend = latest > previous ? 'up' : latest < previous ? 'down' : 'stable';
    
    return { avg, max, min, latest, trend };
  };

  const parameters = [
    { 
      key: 'steamTemp' as keyof BoilerData, 
      label: 'Suhu Steam', 
      unit: '°C', 
      target: '540-550',
      color: '#f97316' 
    },
    { 
      key: 'drumPressure' as keyof BoilerData, 
      label: 'Tekanan Drum', 
      unit: 'bar', 
      target: '160-170',
      color: '#3b82f6' 
    },
    { 
      key: 'coalFlow' as keyof BoilerData, 
      label: 'Flow Batubara', 
      unit: 'ton/hr', 
      target: '40-50',
      color: '#334155' 
    },
    { 
      key: 'biomassFlow' as keyof BoilerData, 
      label: 'Flow Biomassa', 
      unit: 'ton/hr', 
      target: '6-10',
      color: '#10b981' 
    },
    { 
      key: 'efficiency' as keyof BoilerData, 
      label: 'Efisiensi', 
      unit: '%', 
      target: '>85',
      color: '#8b5cf6' 
    },
    { 
      key: 'co2Emission' as keyof BoilerData, 
      label: 'Emisi CO₂', 
      unit: 'mg/Nm³', 
      target: '<800',
      color: '#ef4444' 
    },
    { 
      key: 'o2Level' as keyof BoilerData, 
      label: 'Level O₂', 
      unit: '%', 
      target: '3-4',
      color: '#06b6d4' 
    },
    { 
      key: 'coLevel' as keyof BoilerData, 
      label: 'Level CO', 
      unit: 'ppm', 
      target: '<50',
      color: '#f59e0b' 
    },
    { 
      key: 'noxLevel' as keyof BoilerData, 
      label: 'Level NOₓ', 
      unit: 'mg/Nm³', 
      target: '<200',
      color: '#ec4899' 
    },
  ];

  const filteredParameters = parameters.filter(p => 
    p.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Detail Boiler</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Analisis mendalam data historis dan real-time setiap parameter boiler
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Cari parameter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            {['24h', '7d', '30d'].map((range) => (
              <Button
                key={range}
                size="sm"
                variant={selectedTimeRange === range ? 'default' : 'ghost'}
                onClick={() => setSelectedTimeRange(range)}
                className={selectedTimeRange === range ? 'bg-orange-500 hover:bg-orange-600' : ''}
              >
                {range === '24h' ? '24 Jam' : range === '7d' ? '7 Hari' : '30 Hari'}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeseries">Time Series</TabsTrigger>
          <TabsTrigger value="table">Data Tabel</TabsTrigger>
          <TabsTrigger value="heatmap">Heat Map</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredParameters.map((param) => {
              const stats = calculateStats(param.key);
              const TrendIcon = stats.trend === 'up' ? TrendingUp : stats.trend === 'down' ? TrendingDown : Minus;
              const trendColor = stats.trend === 'up' ? 'text-green-500' : stats.trend === 'down' ? 'text-red-500' : 'text-slate-500';
              
              return (
                <Card key={param.key} className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{param.label}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Target: {param.target} {param.unit}</p>
                    </div>
                    <TrendIcon className={`w-5 h-5 ${trendColor}`} />
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Current</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {stats.latest.toFixed(1)} <span className="text-sm font-normal text-slate-500">{param.unit}</span>
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Avg</p>
                        <p className="font-semibold text-slate-700 dark:text-slate-300">{stats.avg.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Max</p>
                        <p className="font-semibold text-slate-700 dark:text-slate-300">{stats.max.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Min</p>
                        <p className="font-semibold text-slate-700 dark:text-slate-300">{stats.min.toFixed(1)}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                      <ResponsiveContainer width="100%" height={60}>
                        <LineChart data={filteredData.slice(-20)}>
                          <Line 
                            type="monotone" 
                            dataKey={param.key} 
                            stroke={param.color} 
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Time Series Tab */}
        <TabsContent value="timeseries" className="space-y-4">
          {filteredParameters.map((param) => (
            <Card key={param.key} className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                {param.label} ({param.unit})
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <ComposedChart data={filteredData}>
                  <defs>
                    <linearGradient id={`gradient-${param.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={param.color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={param.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(ts) => new Date(ts).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', hour: '2-digit' })}
                    stroke="#64748b"
                    fontSize={11}
                  />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    labelFormatter={(ts) => new Date(ts).toLocaleString('id-ID')}
                    formatter={(value: number) => [value.toFixed(2) + ' ' + param.unit, param.label]}
                  />
                  <Area
                    type="monotone"
                    dataKey={param.key}
                    stroke={param.color}
                    fill={`url(#gradient-${param.key})`}
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={param.key} 
                    stroke={param.color} 
                    strokeWidth={2}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Card>
          ))}
        </TabsContent>

        {/* Table Tab */}
        <TabsContent value="table">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    {filteredParameters.slice(0, 6).map(param => (
                      <TableHead key={param.key}>{param.label} ({param.unit})</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.slice(-20).reverse().map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        {new Date(row.timestamp).toLocaleString('id-ID')}
                      </TableCell>
                      {filteredParameters.slice(0, 6).map(param => (
                        <TableCell key={param.key}>
                          {(row[param.key] as number).toFixed(2)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Heat Map Tab */}
        <TabsContent value="heatmap">
          <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Correlation Heat Map
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {parameters.slice(0, 9).map((paramY, i) => (
                parameters.slice(0, 9).map((paramX, j) => {
                  const correlation = Math.cos((i - j) * 0.5) * 0.8 + Math.random() * 0.2;
                  const intensity = Math.abs(correlation);
                  const bgColor = correlation > 0 
                    ? `rgba(16, 185, 129, ${intensity})` 
                    : `rgba(239, 68, 68, ${intensity})`;
                  
                  return (
                    <div
                      key={`${i}-${j}`}
                      className="aspect-square flex items-center justify-center text-xs font-semibold text-white rounded"
                      style={{ backgroundColor: bgColor }}
                      title={`${paramY.label} vs ${paramX.label}: ${correlation.toFixed(2)}`}
                    >
                      {i === j ? '1.0' : correlation.toFixed(1)}
                    </div>
                  );
                })
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded" />
                <span className="text-slate-600 dark:text-slate-400">Negative</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span className="text-slate-600 dark:text-slate-400">Positive</span>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

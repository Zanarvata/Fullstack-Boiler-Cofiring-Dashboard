import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { 
  Settings, 
  Power,
  AlertTriangle,
  CheckCircle,
  Clock,
  Save,
  RotateCcw,
  Bell,
  BellOff,
  Activity,
  TrendingUp,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  generateOperatorLogs, 
  generateAlarms, 
  getCurrentKPI,
  type OperatorLog,
  type Alarm 
} from '../utils/mockData';

export function OperatorPage() {
  const [logs, setLogs] = useState<OperatorLog[]>(generateOperatorLogs());
  const [alarms, setAlarms] = useState<Alarm[]>(generateAlarms());
  const [controlValues, setControlValues] = useState({
    coalFlow: 360,
    biomassFlow: 18,
    o2Level: 3.45,
    steamTemp: 538.5,
    primaryAir: 211,
  });
  const [autoMode, setAutoMode] = useState(true);
  const [systemEnabled, setSystemEnabled] = useState(true);

  useEffect(() => {
    // Simulate new logs
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const actions = [
          'Auto adjustment applied',
          'Setpoint updated',
          'Parameter optimized',
          'Alarm acknowledged'
        ];
        const newLog: OperatorLog = {
          id: `log-${Date.now()}`,
          timestamp: Date.now(),
          user: autoMode ? 'System (Auto)' : 'Operator',
          action: actions[Math.floor(Math.random() * actions.length)],
          status: 'success',
        };
        setLogs(prev => [newLog, ...prev].slice(0, 50));
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [autoMode]);

  const handleControlChange = (key: keyof typeof controlValues, value: number) => {
    setControlValues(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyChanges = () => {
    const newLog: OperatorLog = {
      id: `log-${Date.now()}`,
      timestamp: Date.now(),
      user: 'Current Operator',
      action: 'Manual parameter adjustment',
      status: 'success',
    };
    setLogs(prev => [newLog, ...prev]);
    toast.success('Perubahan parameter berhasil diterapkan');
  };

  const handleReset = () => {
    setControlValues({
      coalFlow: 360,
      biomassFlow: 18,
      o2Level: 3.45,
      steamTemp: 538.5,
      primaryAir: 211,
    });
    toast.info('Parameter direset ke nilai default');
  };

  const acknowledgeAlarm = (id: string) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === id ? { ...alarm, acknowledged: true } : alarm
    ));
    const newLog: OperatorLog = {
      id: `log-${Date.now()}`,
      timestamp: Date.now(),
      user: 'Current Operator',
      action: 'Alarm acknowledged',
      parameter: 'Alarm System',
      status: 'warning',
    };
    setLogs(prev => [newLog, ...prev]);
    toast.success('Alarm telah di-acknowledge');
  };

  const activeAlarms = alarms.filter(a => !a.acknowledged);
  const kpi = getCurrentKPI();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Panel Operator</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Kontrol manual dan monitoring aktivitas operasional
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="auto-mode">Mode Auto</Label>
            <Switch
              id="auto-mode"
              checked={autoMode}
              onCheckedChange={setAutoMode}
            />
          </div>
          <div className="flex items-center gap-2">
            <Power className={`w-5 h-5 ${systemEnabled ? 'text-green-500' : 'text-red-500'}`} />
            <Switch
              checked={systemEnabled}
              onCheckedChange={setSystemEnabled}
            />
          </div>
        </div>
      </div>

      {/* Active Alarms */}
      {activeAlarms.length > 0 && (
        <Card className="p-4 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 dark:text-red-400 mb-2">
                {activeAlarms.length} Alarm Aktif
              </h3>
              <div className="space-y-2">
                {activeAlarms.map(alarm => (
                  <div key={alarm.id} className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={alarm.severity === 'critical' ? 'destructive' : 'secondary'}
                        className={alarm.severity === 'critical' ? 'bg-red-500' : 'bg-yellow-500'}
                      >
                        {alarm.severity.toUpperCase()}
                      </Badge>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{alarm.message}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {alarm.parameter}: {alarm.value}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => acknowledgeAlarm(alarm.id)}
                    >
                      Acknowledge
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="controls" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="controls">Manual Control</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          <TabsTrigger value="alarms">Alarm History</TabsTrigger>
          <TabsTrigger value="input">Data Input</TabsTrigger>
        </TabsList>

        {/* Manual Controls */}
        <TabsContent value="controls" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Control Panel */}
            <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Parameter Control
                </h3>
                <Badge variant={autoMode ? 'secondary' : 'default'} className={autoMode ? 'bg-blue-500' : 'bg-orange-500'}>
                  {autoMode ? 'AUTO' : 'MANUAL'}
                </Badge>
              </div>

              <div className="space-y-6">
                {/* Coal Flow */}
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Coal Flow Rate</Label>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {controlValues.coalFlow.toFixed(1)} ton/hr
                    </span>
                  </div>
                  <Slider
                    value={[controlValues.coalFlow]}
                    onValueChange={([value]) => handleControlChange('coalFlow', value)}
                    min={30}
                    max={60}
                    step={0.5}
                    disabled={autoMode}
                    className={autoMode ? 'opacity-50' : ''}
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>30</span>
                    <span>60 ton/hr</span>
                  </div>
                </div>

                {/* Biomass Flow */}
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Biomass Flow Rate</Label>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {controlValues.biomassFlow.toFixed(1)} ton/hr
                    </span>
                  </div>
                  <Slider
                    value={[controlValues.biomassFlow]}
                    onValueChange={([value]) => handleControlChange('biomassFlow', value)}
                    min={0}
                    max={15}
                    step={0.1}
                    disabled={autoMode}
                    className={autoMode ? 'opacity-50' : ''}
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>0</span>
                    <span>15 ton/hr</span>
                  </div>
                </div>

                {/* O2 Level */}
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>O₂ Level Setpoint</Label>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {controlValues.o2Level.toFixed(1)}%
                    </span>
                  </div>
                  <Slider
                    value={[controlValues.o2Level]}
                    onValueChange={([value]) => handleControlChange('o2Level', value)}
                    min={2}
                    max={6}
                    step={0.1}
                    disabled={autoMode}
                    className={autoMode ? 'opacity-50' : ''}
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>2</span>
                    <span>6%</span>
                  </div>
                </div>

                {/* Steam Temp */}
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Steam Temp</Label>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {controlValues.steamTemp.toFixed(1)}°C
                    </span>
                  </div>
                  <Slider
                    value={[controlValues.steamTemp]}
                    onValueChange={([value]) => handleControlChange('steamTemp', value)}
                    min={500}
                    max={560}
                    step={0.5}
                    disabled={autoMode}
                    className={autoMode ? 'opacity-50' : ''}
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>500</span>
                    <span>560°C</span>
                  </div>
                </div>

                {/* Primary Air */}
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Primary Air</Label>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {controlValues.primaryAir.toFixed(1)} m³/min
                    </span>
                  </div>
                  <Slider
                    value={[controlValues.primaryAir]}
                    onValueChange={([value]) => handleControlChange('primaryAir', value)}
                    min={150}
                    max={250}
                    step={1}
                    disabled={autoMode}
                    className={autoMode ? 'opacity-50' : ''}
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>150</span>
                    <span>250 m³/min</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleApplyChanges}
                  disabled={autoMode}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Apply Changes
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  disabled={autoMode}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </Card>

            {/* Current Status */}
            <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                Current Status
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">System Status</span>
                    <Badge variant={systemEnabled ? 'default' : 'destructive'} className={systemEnabled ? 'bg-green-500' : ''}>
                      {systemEnabled ? 'RUNNING' : 'STOPPED'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Uptime: 127h 45m
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Efficiency</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {kpi.efficiency.toFixed(1)}%
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600 dark:text-green-400">+2.3%</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">CO₂ Emission</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {kpi.co2Emission.toFixed(0)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">mg/Nm³</p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Steam Temp</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {kpi.steamTemp.toFixed(0)}°C
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Target: 540-550</p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Drum Press</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {kpi.drumPressure.toFixed(0)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">bar</p>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <p className="text-sm font-medium text-orange-900 dark:text-orange-400 mb-2">
                    Cofiring Ratio
                  </p>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-500">
                      {kpi.cofringRatio.toFixed(1)}%
                    </p>
                    <p className="text-sm text-orange-700 dark:text-orange-400 mb-1">biomassa</p>
                  </div>
                  <div className="w-full bg-orange-200 dark:bg-orange-900/30 rounded-full h-2 mt-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${kpi.cofringRatio}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Activity Logs */}
        <TabsContent value="logs">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-semibold text-slate-900 dark:text-white">Activity Logs</h3>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Parameter</TableHead>
                    <TableHead>Old Value</TableHead>
                    <TableHead>New Value</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.slice(0, 20).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        {new Date(log.timestamp).toLocaleString('id-ID')}
                      </TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.parameter || '-'}</TableCell>
                      <TableCell>{log.oldValue || '-'}</TableCell>
                      <TableCell>{log.newValue || '-'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={log.status === 'success' ? 'default' : log.status === 'warning' ? 'secondary' : 'destructive'}
                          className={
                            log.status === 'success' ? 'bg-green-500' : 
                            log.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Alarm History */}
        <TabsContent value="alarms">
          <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Alarm History</h3>
            <div className="space-y-3">
              {alarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className={`p-4 border rounded-lg ${
                    alarm.acknowledged 
                      ? 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600' 
                      : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {alarm.acknowledged ? (
                        <BellOff className="w-5 h-5 text-slate-400 mt-0.5" />
                      ) : (
                        <Bell className="w-5 h-5 text-red-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant={alarm.severity === 'critical' ? 'destructive' : alarm.severity === 'warning' ? 'secondary' : 'default'}
                            className={
                              alarm.severity === 'critical' ? 'bg-red-500' : 
                              alarm.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                            }
                          >
                            {alarm.severity.toUpperCase()}
                          </Badge>
                          {alarm.acknowledged && (
                            <Badge variant="outline" className="text-xs">Acknowledged</Badge>
                          )}
                        </div>
                        <p className="font-medium text-slate-900 dark:text-white">{alarm.message}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                          <span>{alarm.parameter}: {alarm.value}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(alarm.timestamp).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </div>
                    {!alarm.acknowledged && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => acknowledgeAlarm(alarm.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Manual Data Input */}
        <TabsContent value="input">
          <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
              Manual Data Entry
            </h3>
            <form className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="manualCoal">Coal Flow (ton/hr)</Label>
                  <Input id="manualCoal" type="number" step="0.1" placeholder="45.0" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="manualBiomass">Biomass Flow (ton/hr)</Label>
                  <Input id="manualBiomass" type="number" step="0.1" placeholder="8.0" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="manualTemp">Steam Temp (°C)</Label>
                  <Input id="manualTemp" type="number" step="0.1" placeholder="545.0" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="manualPressure">Drum Pressure (bar)</Label>
                  <Input id="manualPressure" type="number" step="0.1" placeholder="165.0" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="manualO2">O₂ Level (%)</Label>
                  <Input id="manualO2" type="number" step="0.1" placeholder="3.5" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="manualCO">CO Level (ppm)</Label>
                  <Input id="manualCO" type="number" step="1" placeholder="45" className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes / Remarks</Label>
                <Input id="notes" type="text" placeholder="Catatan tambahan..." className="mt-1" />
              </div>
              <Button type="button" className="bg-orange-500 hover:bg-orange-600">
                <Save className="w-4 h-4 mr-2" />
                Submit Data
              </Button>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
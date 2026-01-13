// Mock data generator for Boiler Cofiring monitoring system
// Updated with realistic parameters based on actual boiler operation

export interface BoilerData {
  timestamp: number;
  steamTemp: number;          // T. Steam Utama (°C)
  drumPressure: number;        // P. Steam Utama (bar)
  coalFlow: number;            // Coal Flow (t/jam)
  biomassFlow: number;         // Biomass Flow (t/jam)
  loadUnit: number;            // Beban Unit (MW)
  primaryAir: number;          // Primary Air (t/jam)
  secondaryAir: number;        // Secondary Air (t/jam)
  excessAir: number;           // Excess Air (%)
  efficiency: number;
  co2Emission: number;
  o2Level: number;             // O2 Flue Gas (%)
  coLevel: number;
  noxLevel: number;
  cofringRatio: number;        // Rasio Cofiring (%) - MAX 5%
}

export interface KPIData {
  steamTemp: number;
  drumPressure: number;
  efficiency: number;
  co2Emission: number;
  cofringRatio: number;
  loadUnit: number;
  status: 'optimal' | 'warning' | 'critical';
}

// Generate realistic boiler data based on actual operation parameters
export function generateBoilerData(): BoilerData {
  const baseTime = Date.now();
  
  // Base values from actual data
  const loadUnit = 400 + Math.random() * 0.9 - 0.5;          // 399.6 - 400.5 MW
  const coalFlow = 360 + Math.random() * 0.9 - 0.5;          // 359.7 - 360.7 t/jam
  const cofiringRatio = 5.0;                                  // Fixed at 5% MAX
  const biomassFlow = (coalFlow * cofiringRatio) / 100;      // Calculate from coal and ratio
  
  const primaryAir = 211 + Math.random() * 1.1 - 0.5;        // 210.7 - 211.8 t/jam
  const secondaryAir = 451 + Math.random() * 1.2 - 0.5;      // 450.9 - 452.1 t/jam
  const excessAir = 22.2 + Math.random() * 0.8;              // 22.2 - 23.0 %
  const steamTemp = 538.1 + Math.random() * 0.9;             // 538.1 - 539.0 °C
  const drumPressure = 248.3 + Math.random() * 0.8;          // 248.3 - 249.1 bar
  const o2Level = 3.42 + Math.random() * 0.06;               // 3.42 - 3.48 %
  
  // Calculate efficiency based on parameters (realistic formula)
  const efficiencyBase = 87 + 
    (cofiringRatio * 0.3) +                                  // Biomass contribution
    ((steamTemp - 538) * 0.2) +                              // Temperature effect
    ((3.45 - o2Level) * 0.5);                                // O2 optimization
  const efficiency = efficiencyBase + Math.random() * 1.5 - 0.75;
  
  // Calculate CO2 emission (lower with biomass)
  const co2Base = 800 - (cofiringRatio * 10) + (o2Level - 3.45) * 15;
  const co2Emission = co2Base + Math.random() * 20 - 10;
  
  // NOx calculation
  const noxLevel = 180 + (steamTemp - 538) * 2 + Math.random() * 15;
  
  // CO level
  const coLevel = 40 + Math.random() * 15;
  
  return {
    timestamp: baseTime,
    loadUnit,
    steamTemp,
    drumPressure,
    coalFlow,
    biomassFlow,
    primaryAir,
    secondaryAir,
    excessAir,
    efficiency: Math.max(82, Math.min(92, efficiency)),
    co2Emission: Math.max(700, Math.min(900, co2Emission)),
    o2Level,
    coLevel: Math.max(25, Math.min(70, coLevel)),
    noxLevel: Math.max(150, Math.min(220, noxLevel)),
    cofringRatio: cofiringRatio,
  };
}

// Generate time series data for charts
export function generateTimeSeriesData(hours: number = 24): BoilerData[] {
  const data: BoilerData[] = [];
  const now = Date.now();
  const interval = (hours * 60 * 60 * 1000) / 100; // 100 points
  
  for (let i = 0; i < 100; i++) {
    const timestamp = now - (100 - i) * interval;
    
    // Realistic variations with sine waves for natural patterns
    const loadUnit = 400 + Math.sin(i / 20) * 0.3 + Math.random() * 0.5 - 0.25;
    const coalFlow = 360 + Math.sin(i / 15) * 0.4 + Math.random() * 0.6 - 0.3;
    const cofiringRatio = 5.0; // Fixed at 5%
    const biomassFlow = (coalFlow * cofiringRatio) / 100;
    
    const primaryAir = 211 + Math.sin(i / 18) * 0.5 + Math.random() * 0.8 - 0.4;
    const secondaryAir = 451 + Math.cos(i / 22) * 0.6 + Math.random() * 0.9 - 0.45;
    const excessAir = 22.5 + Math.sin(i / 25) * 0.4 + Math.random() * 0.5;
    const steamTemp = 538.5 + Math.sin(i / 12) * 0.4 + Math.random() * 0.6 - 0.3;
    const drumPressure = 248.7 + Math.cos(i / 16) * 0.35 + Math.random() * 0.5 - 0.25;
    const o2Level = 3.45 + Math.sin(i / 14) * 0.02 + Math.random() * 0.04 - 0.02;
    
    const efficiencyBase = 87.5 + Math.sin(i / 20) * 1.5 + (cofiringRatio * 0.3);
    const efficiency = efficiencyBase + Math.random() * 1.2 - 0.6;
    
    const co2Base = 800 - (cofiringRatio * 10) + Math.sin(i / 18) * 15;
    const co2Emission = co2Base + Math.random() * 18 - 9;
    
    const noxLevel = 185 + Math.sin(i / 16) * 12 + Math.random() * 10;
    const coLevel = 42 + Math.random() * 12;
    
    data.push({
      timestamp,
      loadUnit,
      coalFlow,
      biomassFlow,
      primaryAir,
      secondaryAir,
      excessAir,
      steamTemp,
      drumPressure,
      o2Level,
      efficiency: Math.max(83, Math.min(92, efficiency)),
      co2Emission: Math.max(720, Math.min(880, co2Emission)),
      coLevel: Math.max(28, Math.min(65, coLevel)),
      noxLevel: Math.max(155, Math.min(215, noxLevel)),
      cofringRatio: cofiringRatio,
    });
  }
  
  return data;
}

// Get current KPI status
export function getCurrentKPI(): KPIData {
  const data = generateBoilerData();
  
  // Determine status based on efficiency and emissions
  let status: 'optimal' | 'warning' | 'critical' = 'optimal';
  if (data.efficiency < 86 || data.co2Emission > 820) {
    status = 'warning';
  }
  if (data.efficiency < 84 || data.co2Emission > 860) {
    status = 'critical';
  }
  
  return {
    steamTemp: data.steamTemp,
    drumPressure: data.drumPressure,
    efficiency: data.efficiency,
    co2Emission: data.co2Emission,
    cofringRatio: data.cofringRatio,
    loadUnit: data.loadUnit,
    status,
  };
}

// ML Model predictions mock data (updated for 5% cofiring)
export interface MLPrediction {
  model: 'ANN' | 'RSM' | 'LightGBM';
  accuracy: number;
  predictedEfficiency: number;
  optimalCofiringRatio: number;
  predictedCO2: number;
  recommendedSteamTemp: number;
  recommendedO2Level: number;
  confidence: number;
}

export function getMLPredictions(): MLPrediction[] {
  return [
    {
      model: 'ANN',
      accuracy: 94.5,
      predictedEfficiency: 88.8,
      optimalCofiringRatio: 5.0,  // Max 5%
      predictedCO2: 752,
      recommendedSteamTemp: 538.7,
      recommendedO2Level: 3.44,
      confidence: 0.92,
    },
    {
      model: 'RSM',
      accuracy: 91.8,
      predictedEfficiency: 88.3,
      optimalCofiringRatio: 4.8,  // Max 5%
      predictedCO2: 765,
      recommendedSteamTemp: 538.4,
      recommendedO2Level: 3.46,
      confidence: 0.89,
    },
    {
      model: 'LightGBM',
      accuracy: 95.2,
      predictedEfficiency: 89.2,
      optimalCofiringRatio: 5.0,  // Max 5%
      predictedCO2: 745,
      recommendedSteamTemp: 538.9,
      recommendedO2Level: 3.43,
      confidence: 0.94,
    },
  ];
}

// Operator logs
export interface OperatorLog {
  id: string;
  timestamp: number;
  user: string;
  action: string;
  parameter?: string;
  oldValue?: string;
  newValue?: string;
  status: 'success' | 'warning' | 'error';
}

export function generateOperatorLogs(): OperatorLog[] {
  const actions = [
    { action: 'Adjusted coal flow', parameter: 'coalFlow', oldValue: '360.2', newValue: '360.5', status: 'success' as const },
    { action: 'Optimized O2 level', parameter: 'o2Level', oldValue: '3.48', newValue: '3.45', status: 'success' as const },
    { action: 'Updated excess air', parameter: 'excessAir', oldValue: '22.3', newValue: '22.6', status: 'success' as const },
    { action: 'Reset alarm', parameter: 'alarm', status: 'warning' as const },
    { action: 'Adjusted primary air', parameter: 'primaryAir', oldValue: '210.9', newValue: '211.5', status: 'success' as const },
    { action: 'Steam temp stabilization', parameter: 'steamTemp', oldValue: '538.2', newValue: '538.6', status: 'success' as const },
  ];
  
  return actions.map((log, index) => ({
    id: `log-${index}`,
    timestamp: Date.now() - index * 1000 * 60 * Math.random() * 120,
    user: Math.random() > 0.5 ? 'Operator A' : 'Operator B',
    ...log,
  }));
}

// Alarms
export interface Alarm {
  id: string;
  timestamp: number;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  parameter: string;
  value: string;
  acknowledged: boolean;
}

export function generateAlarms(): Alarm[] {
  return [
    {
      id: 'alarm-1',
      timestamp: Date.now() - 1000 * 60 * 5,
      severity: 'warning',
      message: 'CO2 emission approaching upper limit',
      parameter: 'CO2',
      value: '825 mg/Nm3',
      acknowledged: false,
    },
    {
      id: 'alarm-2',
      timestamp: Date.now() - 1000 * 60 * 15,
      severity: 'info',
      message: 'Cofiring ratio optimized at 5%',
      parameter: 'Cofiring Ratio',
      value: '5.0%',
      acknowledged: true,
    },
    {
      id: 'alarm-3',
      timestamp: Date.now() - 1000 * 60 * 45,
      severity: 'warning',
      message: 'O2 level slightly high',
      parameter: 'O2 Flue Gas',
      value: '3.48%',
      acknowledged: true,
    },
    {
      id: 'alarm-4',
      timestamp: Date.now() - 1000 * 60 * 90,
      severity: 'info',
      message: 'Load unit stable at 400 MW',
      parameter: 'Beban Unit',
      value: '400.1 MW',
      acknowledged: true,
    },
  ];
}

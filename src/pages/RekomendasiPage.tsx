import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  Brain, 
  TrendingUp, 
  Award, 
  Zap,
  Target,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  BarChart3
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { getMLPredictions, type MLPrediction } from '../utils/mockData';

export function RekomendasiPage() {
  const predictions = getMLPredictions();
  const [selectedModel, setSelectedModel] = useState<MLPrediction>(predictions[2]); // LightGBM default

  const accuracyData = predictions.map(p => ({
    model: p.model,
    accuracy: p.accuracy,
    confidence: p.confidence * 100,
  }));

  const performanceComparison = [
    {
      metric: 'Efisiensi',
      ANN: predictions[0].predictedEfficiency,
      RSM: predictions[1].predictedEfficiency,
      LightGBM: predictions[2].predictedEfficiency,
    },
    {
      metric: 'CO₂',
      ANN: 1000 - predictions[0].predictedCO2,
      RSM: 1000 - predictions[1].predictedCO2,
      LightGBM: 1000 - predictions[2].predictedCO2,
    },
    {
      metric: 'Rasio Biomassa',
      ANN: predictions[0].optimalCofiringRatio,
      RSM: predictions[1].optimalCofiringRatio,
      LightGBM: predictions[2].optimalCofiringRatio,
    },
  ];

  const radarData = [
    {
      metric: 'Akurasi',
      ANN: predictions[0].accuracy,
      RSM: predictions[1].accuracy,
      LightGBM: predictions[2].accuracy,
      fullMark: 100,
    },
    {
      metric: 'Confidence',
      ANN: predictions[0].confidence * 100,
      RSM: predictions[1].confidence * 100,
      LightGBM: predictions[2].confidence * 100,
      fullMark: 100,
    },
    {
      metric: 'Efisiensi Prediksi',
      ANN: predictions[0].predictedEfficiency,
      RSM: predictions[1].predictedEfficiency,
      LightGBM: predictions[2].predictedEfficiency,
      fullMark: 100,
    },
    {
      metric: 'Optimasi Emisi',
      ANN: ((1000 - predictions[0].predictedCO2) / 10),
      RSM: ((1000 - predictions[1].predictedCO2) / 10),
      LightGBM: ((1000 - predictions[2].predictedCO2) / 10),
      fullMark: 100,
    },
  ];

  const recommendations = [
    {
      id: 1,
      title: 'Tingkatkan Rasio Biomassa',
      description: `Berdasarkan model ${selectedModel.model}, tingkatkan rasio cofiring biomassa ke ${selectedModel.optimalCofiringRatio.toFixed(1)}% untuk hasil optimal`,
      impact: `+${(selectedModel.predictedEfficiency - 87).toFixed(1)}% efisiensi`,
      priority: 'high',
      icon: TrendingUp,
    },
    {
      id: 2,
      title: 'Optimasi Suhu Steam',
      description: `Atur suhu steam target ke ${selectedModel.recommendedSteamTemp}°C untuk performa maksimal`,
      impact: `-${(800 - selectedModel.predictedCO2).toFixed(0)} mg/Nm³ emisi CO₂`,
      priority: 'high',
      icon: Target,
    },
    {
      id: 3,
      title: 'Penyesuaian Level O₂',
      description: `Pertahankan level O₂ pada ${selectedModel.recommendedO2Level.toFixed(1)}% untuk pembakaran optimal`,
      impact: 'Mengurangi emisi NOₓ hingga 12%',
      priority: 'medium',
      icon: Zap,
    },
    {
      id: 4,
      title: 'Monitoring Kontinyu',
      description: 'Lakukan monitoring real-time parameter kunci setiap 5 menit untuk deteksi dini anomali',
      impact: 'Mencegah downtime tak terduga',
      priority: 'medium',
      icon: BarChart3,
    },
  ];

  const modelColors = {
    ANN: '#3b82f6',
    RSM: '#f59e0b',
    LightGBM: '#10b981',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Rekomendasi AI</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Analisis prediksi dari 3 model machine learning untuk optimasi operasional
        </p>
      </div>

      {/* Model Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {predictions.map((model) => (
          <Card
            key={model.model}
            className={`p-6 cursor-pointer transition-all ${
              selectedModel.model === model.model
                ? 'border-2 border-orange-500 bg-orange-50 dark:bg-orange-900/10'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-orange-300'
            }`}
            onClick={() => setSelectedModel(model)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-lg">
                <Brain className="w-6 h-6 text-orange-500" />
              </div>
              {selectedModel.model === model.model && (
                <CheckCircle className="w-5 h-5 text-orange-500" />
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {model.model}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              {model.model === 'ANN' && 'Artificial Neural Network dengan Keras'}
              {model.model === 'RSM' && 'Response Surface Methodology'}
              {model.model === 'LightGBM' && 'Gradient Boosting Machine'}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Akurasi</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {model.accuracy.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all"
                  style={{ width: `${model.accuracy}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Confidence</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {(model.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Model Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy Comparison */}
        <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Perbandingan Akurasi Model
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={accuracyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="model" stroke="#64748b" />
              <YAxis stroke="#64748b" domain={[85, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="accuracy" fill="#f97316" name="Akurasi (%)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="confidence" fill="#3b82f6" name="Confidence (%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Radar Chart */}
        <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Analisis Multi-Dimensi
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="metric" stroke="#64748b" fontSize={12} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#64748b" fontSize={11} />
              <Radar name="ANN" dataKey="ANN" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              <Radar name="RSM" dataKey="RSM" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
              <Radar name="LightGBM" dataKey="LightGBM" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              <Legend />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Performance Metrics Comparison */}
      <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Prediksi Performa Operasional
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceComparison} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
            <XAxis type="number" stroke="#64748b" />
            <YAxis dataKey="metric" type="category" stroke="#64748b" width={120} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
            />
            <Legend />
            <Bar dataKey="ANN" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            <Bar dataKey="RSM" fill="#f59e0b" radius={[0, 4, 4, 0]} />
            <Bar dataKey="LightGBM" fill="#10b981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Best Model Recommendation */}
      <Card className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <Award className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Model Terbaik: LightGBM</h3>
            <p className="text-white/90 mb-4">
              Berdasarkan analisis komprehensif, model LightGBM menunjukkan performa terbaik dengan akurasi{' '}
              <span className="font-bold">95.2%</span> dan confidence{' '}
              <span className="font-bold">94%</span>. Model ini memprediksi peningkatan efisiensi hingga{' '}
              <span className="font-bold">89.2%</span> dengan emisi CO₂ yang lebih rendah pada rasio cofiring optimal <span className="font-bold">5%</span>.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-xs text-white/70">Efisiensi Target</p>
                <p className="text-xl font-bold">{selectedModel.predictedEfficiency.toFixed(1)}%</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-xs text-white/70">CO₂ Prediksi</p>
                <p className="text-xl font-bold">{selectedModel.predictedCO2} mg/Nm³</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-xs text-white/70">Rasio Optimal</p>
                <p className="text-xl font-bold">{selectedModel.optimalCofiringRatio.toFixed(1)}%</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-xs text-white/70">Suhu Target</p>
                <p className="text-xl font-bold">{selectedModel.recommendedSteamTemp}°C</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recommendations List */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-6 h-6 text-orange-500" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Rekomendasi Operasional
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec) => {
            const Icon = rec.icon;
            return (
              <Card
                key={rec.id}
                className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-orange-300 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-lg">
                    <Icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{rec.title}</h3>
                      <Badge
                        variant={rec.priority === 'high' ? 'destructive' : 'secondary'}
                        className={rec.priority === 'high' ? 'bg-red-500' : 'bg-blue-500'}
                      >
                        {rec.priority === 'high' ? 'Prioritas Tinggi' : 'Prioritas Sedang'}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      {rec.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {rec.impact}
                        </span>
                      </div>
                      <Button size="sm" variant="ghost" className="text-orange-500 hover:text-orange-600">
                        Terapkan <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Additional Info */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
              Tentang Model Machine Learning
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Ketiga model ML ini dilatih menggunakan data historis operasional boiler cofiring selama 12 bulan terakhir
              (lebih dari 1 juta data points). Model di-retrain setiap minggu untuk meningkatkan akurasi prediksi.
            </p>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <li>• <strong>ANN (Keras/TensorFlow):</strong> 3 hidden layers, 128-64-32 neurons, ReLU activation</li>
              <li>• <strong>RSM (statsmodels):</strong> Response surface dengan second-order polynomial model</li>
              <li>• <strong>LightGBM:</strong> 500 trees, max depth 8, learning rate 0.05</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Loader2
} from 'lucide-react';
import { getCurrentKPI, getMLPredictions } from '../utils/mockData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  suggestions?: string[];
}

export function AICopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Halo! Saya AI Copilot untuk sistem monitoring Boiler Cofiring. Saya dapat membantu Anda menganalisis data, memberikan rekomendasi operasional, dan menjawab pertanyaan tentang performa boiler. Ada yang bisa saya bantu?',
      timestamp: Date.now() - 60000,
      suggestions: [
        'Apa penyebab efisiensi turun kemarin?',
        'Rekomendasi untuk mengurangi emisi CO₂',
        'Analisis trend suhu steam 24 jam terakhir',
        'Setting optimal untuk rasio cofiring'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    const kpi = getCurrentKPI();
    const predictions = getMLPredictions();
    const bestModel = predictions.find(p => p.model === 'LightGBM')!;

    // Context-aware responses
    if (lowerMessage.includes('efisiensi') && (lowerMessage.includes('turun') || lowerMessage.includes('rendah'))) {
      return `Berdasarkan analisis data historis, penurunan efisiensi kemarin disebabkan oleh beberapa faktor:\n\n1. **Rasio cofiring biomassa** yang lebih rendah (${(kpi.cofringRatio - 2).toFixed(1)}% vs target 15-17%)\n2. **Level O₂** yang tidak optimal (4.2% - seharusnya 3-4%)\n3. **Variasi suhu steam** yang cukup tinggi (±15°C)\n\n**Rekomendasi:**\n- Tingkatkan rasio biomassa ke ${bestModel.optimalCofiringRatio.toFixed(1)}%\n- Sesuaikan damper untuk menurunkan O₂ ke range 3-4%\n- Lakukan tuning PID controller untuk stabilitas suhu\n\nDengan perbaikan ini, efisiensi diperkirakan naik ke ${bestModel.predictedEfficiency.toFixed(1)}% (prediksi model LightGBM dengan akurasi 95.2%).`;
    }
    
    if (lowerMessage.includes('emisi') || lowerMessage.includes('co2') || lowerMessage.includes('co₂')) {
      return `Untuk mengurangi emisi CO₂ dari level saat ini (${kpi.co2Emission.toFixed(0)} mg/Nm³), berikut strategi yang direkomendasikan:\n\n**Optimasi Jangka Pendek:**\n1. Tingkatkan rasio biomassa ke ${bestModel.optimalCofiringRatio.toFixed(1)}% → Reduksi ~${(kpi.co2Emission - bestModel.predictedCO2).toFixed(0)} mg/Nm³\n2. Optimalkan pembakaran dengan O₂ level ${bestModel.recommendedO2Level.toFixed(1)}%\n3. Maintain suhu steam di ${bestModel.recommendedSteamTemp}°C\n\n**Proyeksi:**\nDengan setting optimal, emisi CO₂ dapat diturunkan ke **${bestModel.predictedCO2} mg/Nm³** (confidence 94%). Ini berarti pengurangan **${((1 - bestModel.predictedCO2/kpi.co2Emission) * 100).toFixed(1)}%** dari kondisi saat ini.\n\n**Manfaat tambahan:** Efisiensi meningkat ${(bestModel.predictedEfficiency - kpi.efficiency).toFixed(1)}%, menghemat biaya bahan bakar.`;
    }
    
    if (lowerMessage.includes('suhu') && lowerMessage.includes('trend')) {
      return `Analisis trend suhu steam 24 jam terakhir:\n\n📊 **Statistik:**\n- Rata-rata: ${kpi.steamTemp.toFixed(1)}°C\n- Maksimum: ${(kpi.steamTemp + 8).toFixed(1)}°C (pukul 14:30)\n- Minimum: ${(kpi.steamTemp - 5).toFixed(1)}°C (pukul 03:15)\n- Standar deviasi: 4.2°C\n\n**Observasi:**\n1. Terjadi fluktuasi yang cukup signifikan (range 13°C)\n2. Pola siklik terlihat jelas - suhu lebih tinggi siang hari\n3. Korelasi kuat dengan variasi beban (r = 0.87)\n\n**Rekomendasi:**\n- Perbaiki response time control system\n- Pertimbangkan feedforward control berdasarkan prediksi beban\n- Target suhu optimal: ${bestModel.recommendedSteamTemp}°C ±3°C\n\nTrend saat ini: ${kpi.steamTemp > 545 ? '📈 Naik' : '📉 Turun'} - Status ${kpi.status === 'optimal' ? '✅ Normal' : '⚠️ Perlu perhatian'}`;
    }
    
    if (lowerMessage.includes('setting') || lowerMessage.includes('rasio') || lowerMessage.includes('cofiring')) {
      return `Setting optimal untuk rasio cofiring berdasarkan analisis 3 model ML:\n\n**Rekomendasi Model:**\n🥇 **LightGBM** (Akurasi 95.2%):\n- Rasio biomassa: **${bestModel.optimalCofiringRatio.toFixed(1)}%** (Maksimal 5%)\n- Efisiensi prediksi: ${bestModel.predictedEfficiency.toFixed(1)}%\n- CO₂ prediksi: ${bestModel.predictedCO2} mg/Nm³\n\n🥈 ANN: ${predictions[0].optimalCofiringRatio.toFixed(1)}% biomassa\n🥉 RSM: ${predictions[1].optimalCofiringRatio.toFixed(1)}% biomassa\n\n**Parameter Operasional:**\n1. Rasio cofiring maksimal: 5%\n2. Coal flow: ~360 ton/jam\n3. Biomass flow: ~18 ton/jam (5% dari total)\n4. O₂ level target: ${bestModel.recommendedO2Level.toFixed(1)}%\n5. Steam temp target: ${bestModel.recommendedSteamTemp}°C\n6. Drum pressure: 248-249 bar\n\n**Expected Result:**\n✅ Efisiensi naik ${(bestModel.predictedEfficiency - kpi.efficiency).toFixed(1)}%\n✅ Emisi turun ${(kpi.co2Emission - bestModel.predictedCO2).toFixed(0)} mg/Nm³\n✅ Operasi stabil pada beban 400 MW`;
    }

    // Default response
    return `Saya telah menganalisis pertanyaan Anda. Saat ini status boiler:\n\n📊 **KPI Real-time:**\n- Efisiensi: ${kpi.efficiency.toFixed(1)}%\n- Emisi CO₂: ${kpi.co2Emission.toFixed(0)} mg/Nm³\n- Rasio Biomassa: ${kpi.cofringRatio.toFixed(1)}%\n- Status: ${kpi.status === 'optimal' ? '✅ Optimal' : '⚠️ Warning'}\n\n**Model ML Active:**\nLightGBM (Akurasi 95.2%) merekomendasikan efisiensi dapat ditingkatkan ke ${bestModel.predictedEfficiency.toFixed(1)}% dengan menyesuaikan parameter operasional.\n\nApakah ada aspek spesifik yang ingin Anda ketahui lebih detail?`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI thinking
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(input),
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="p-6 h-[calc(100vh-2rem)] flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Copilot</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Assistant AI untuk analisis dan optimasi boiler
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Online
          </Badge>
          <Badge variant="secondary">LightGBM Model Active</Badge>
          <Badge variant="secondary">Context: Last 24h data</Badge>
        </div>
      </div>

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-2 rounded-lg h-fit">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div className={`flex flex-col max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                </div>
                
                <span className="text-xs text-slate-400 mt-1 px-2">
                  {new Date(message.timestamp).toLocaleTimeString('id-ID')}
                </span>

                {/* Suggestions */}
                {message.suggestions && (
                  <div className="mt-3 space-y-2 w-full">
                    <p className="text-xs text-slate-500 dark:text-slate-400 px-2">Pertanyaan yang sering diajukan:</p>
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {message.role === 'user' && (
                <div className="bg-slate-700 dark:bg-slate-600 p-2 rounded-lg h-fit">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-2 rounded-lg h-fit">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">AI sedang menganalisis...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Tanyakan sesuatu tentang boiler... (Enter untuk kirim, Shift+Enter untuk baris baru)"
              className="flex-1 min-h-[60px] max-h-[120px] resize-none"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-orange-500 hover:bg-orange-600 h-[60px] px-6"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex gap-2 mt-3 flex-wrap">
            <button
              onClick={() => setInput('Analisis performa boiler saat ini')}
              className="px-3 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full text-xs hover:border-orange-500 transition-colors"
            >
              <BarChart3 className="w-3 h-3 inline mr-1" />
              Analisis Performa
            </button>
            <button
              onClick={() => setInput('Apa yang menyebabkan alarm terakhir?')}
              className="px-3 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full text-xs hover:border-orange-500 transition-colors"
            >
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              Diagnosa Alarm
            </button>
            <button
              onClick={() => setInput('Rekomendasi peningkatan efisiensi')}
              className="px-3 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full text-xs hover:border-orange-500 transition-colors"
            >
              <Lightbulb className="w-3 h-3 inline mr-1" />
              Optimasi
            </button>
            <button
              onClick={() => setInput('Prediksi trend 24 jam ke depan')}
              className="px-3 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full text-xs hover:border-orange-500 transition-colors"
            >
              <TrendingUp className="w-3 h-3 inline mr-1" />
              Prediksi
            </button>
          </div>
        </div>
      </Card>

      {/* Info Footer */}
      <div className="mt-4 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          💡 AI Copilot menggunakan data real-time dan model ML (ANN, RSM, LightGBM) untuk memberikan rekomendasi.
          Dalam produksi, terhubung dengan LLM API atau model lokal.
        </p>
      </div>
    </div>
  );
}
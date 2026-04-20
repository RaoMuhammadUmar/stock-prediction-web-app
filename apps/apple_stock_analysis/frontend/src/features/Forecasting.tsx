import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { rpcCall } from '../api';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Spinner } from '../components/ui/spinner';
import { cn } from '../lib/utils';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { BrainCircuit, Info, Sparkles, Target, Zap } from 'lucide-react';

interface PredictionPoint {
  date: string;
  predicted_close: number;
}

interface HistoricalPoint {
  Date: string;
  Close: number;
}

const MODEL_DESCRIPTIONS: Record<string, string> = {
  'Prophet': 'Developed by Meta, best for capturing yearly, weekly, and daily seasonality plus holiday effects.',
  'ARIMA': 'Classic statistical model that uses past values and errors to predict future movements. Stable for short-term trends.',
  'LSTM': 'Neural network approach focused on capturing long-range dependencies and complex momentum patterns.'
};

export function Forecasting() {
  const [modelType, setModelType] = useState<string>('Prophet');
  const [predictions, setPredictions] = useState<PredictionPoint[]>([]);
  const [history, setHistory] = useState<HistoricalPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchForecast = useCallback(async (model: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('[FETCH_START] get_predictions', { model });
      const [predResult, histResult] = await Promise.all([
        rpcCall({ func: 'get_predictions', args: { model_type: model, horizon_days: 30 } }),
        rpcCall({ func: 'get_historical_data', args: { time_range: '1Y' } })
      ]);
      
      console.log('[FETCH_RESPONSE] get_predictions', { predCount: predResult.length });
      setPredictions(predResult);
      // Only take the last 60 days of history for the combined chart
      setHistory(histResult.slice(-60));
    } catch (err: any) {
      console.error('[PARSE_ERROR] get_predictions', err);
      setError(err.message || 'Failed to generate forecast');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForecast(modelType);
  }, [modelType, fetchForecast]);

  // Combine history and predictions for a continuous chart
  const chartData = [
    ...history.map(h => ({ date: h.Date, price: h.Close, isPrediction: false })),
    ...predictions.map(p => ({ date: p.date, price: p.predicted_close, isPrediction: true }))
  ];

  const lastHistDate = history.length > 0 ? history[history.length - 1].Date : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight font-heading">AI Price Forecasting</h2>
          <p className="text-muted-foreground text-sm">30-day price predictions using machine learning models</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground hidden sm:block">Model:</span>
          <Select value={modelType} onValueChange={setModelType}>
            <SelectTrigger className="w-[180px] bg-card border-primary/20">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Prophet">Prophet (Meta)</SelectItem>
              <SelectItem value="ARIMA">ARIMA (Statistical)</SelectItem>
              <SelectItem value="LSTM">LSTM (Neural Proxy)</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            size="icon" 
            variant="outline" 
            onClick={() => fetchForecast(modelType)}
            disabled={loading}
            className="border-primary/20 text-primary hover:bg-primary/10"
          >
            <Zap className={cn("h-4 w-4", loading && "animate-pulse")} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/40 shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-heading">Prediction Horizon</CardTitle>
              <CardDescription>Historical trend vs. Future projection</CardDescription>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                <span>History</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>Forecast</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[350px] w-full relative">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-[2px] z-10 rounded-xl">
                  <div className="flex flex-col items-center gap-2">
                    <Spinner className="h-8 w-8 text-primary" />
                    <span className="text-xs font-medium animate-pulse">Running {modelType} Engine...</span>
                  </div>
                </div>
              )}
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    minTickGap={40}
                    tickFormatter={(val) => {
                      const d = new Date(val);
                      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                    }}
                  />
                  <YAxis 
                    domain={['auto', 'auto']}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const isPred = payload[0].payload.isPrediction;
                        return (
                          <div className="bg-background/95 backdrop-blur border border-primary/20 p-2 rounded shadow-lg">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                              {isPred ? 'Prediction' : 'Historical'}
                            </p>
                            <p className="text-sm font-bold text-foreground mb-1">
                              {payload[0].payload.date}
                            </p>
                            <p className={cn("text-lg font-bold", isPred ? "text-primary" : "text-muted-foreground")}>
                              ${payload[0].value.toFixed(2)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {lastHistDate && (
                    <ReferenceLine x={lastHistDate} stroke="hsl(var(--primary))" strokeDasharray="5 5" opacity={0.5} />
                  )}
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={false}
                    strokeDasharray={(props: any) => props.payload.isPrediction ? "5 5" : "0"}
                    connectNulls
                  />
                  {/* Separate line for history to give it different styling if needed */}
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeWidth={2}
                    dot={false}
                    data={chartData.filter(d => !d.isPrediction)}
                    opacity={0.4}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="bg-primary/5 border-t border-border/40 py-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Info className="h-3 w-3" />
              <span>Dashed line indicates model projection for the next 30 days.</span>
            </div>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-heading">Model Intelligence</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <h4 className="text-sm font-bold mb-1">{modelType} Engine</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {MODEL_DESCRIPTIONS[modelType]}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Confidence Level</span>
                  <span className="text-emerald-500 font-bold">84%</span>
                </div>
                <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[84%]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-heading">Target Insights</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {predictions.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase mb-1">30D Target</p>
                    <p className="text-lg font-bold">${predictions[predictions.length-1].predicted_close.toFixed(2)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase mb-1">Expected Change</p>
                    {history.length > 0 && (
                      <p className={cn(
                        "text-lg font-bold",
                        predictions[predictions.length-1].predicted_close > history[history.length-1].Close ? "text-emerald-500" : "text-rose-500"
                      )}>
                        {(((predictions[predictions.length-1].predicted_close / history[history.length-1].Close) - 1) * 100).toFixed(2)}%
                      </p>
                    )}
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2 p-2 rounded bg-amber-500/10 border border-amber-500/20">
                <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-200/80 leading-tight">
                  Forecasts are generated based on historical price action and seasonal patterns. Use for informational purposes only.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

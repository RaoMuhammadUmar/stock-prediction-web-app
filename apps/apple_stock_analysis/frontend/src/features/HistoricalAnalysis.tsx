import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { rpcCall } from '../api';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { Spinner } from '../components/ui/spinner';
import { cn } from '../lib/utils';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Calendar, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface HistoricalData {
  Date: string;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  Volume: number;
}

export function HistoricalAnalysis() {
  const [data, setData] = useState<HistoricalData[]>([]);
  const [range, setRange] = useState<'1Y' | '5Y' | 'Max'>('5Y');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (selectedRange: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('[FETCH_START] get_historical_data', { range: selectedRange });
      const result = await rpcCall({ func: 'get_historical_data', args: { time_range: selectedRange } });
      console.log('[FETCH_RESPONSE] get_historical_data', { count: result.length });
      setData(result);
    } catch (err: any) {
      console.error('[PARSE_ERROR] get_historical_data', err);
      setError(err.message || 'Failed to load historical data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(range);
  }, [range, fetchData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur shadow-xl rounded-lg border p-3 border-primary/20">
          <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
          <div className="space-y-1">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-foreground">Price:</span>
              <span className="font-bold text-primary">${payload[0].value.toFixed(2)}</span>
            </div>
            {payload[1] && (
              <div className="flex justify-between gap-4 text-xs">
                <span className="text-muted-foreground">Volume:</span>
                <span className="font-mono">{(payload[1].value / 1000000).toFixed(2)}M</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight font-heading">Price Performance</h2>
          <p className="text-muted-foreground text-sm">Historical price and volume trends for AAPL</p>
        </div>
        <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border/50">
          {(['1Y', '5Y', 'Max'] as const).map((r) => (
            <Button
              key={r}
              variant={range === r ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setRange(r)}
              className={cn(
                "h-8 px-4 rounded-md transition-all",
                range === r ? "shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {r}
            </Button>
          ))}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="overflow-hidden border-border/40 shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-0">
          <div className="flex items-center gap-2 text-sm text-primary font-medium">
            <TrendingUp className="h-4 w-4" />
            <span>Market History</span>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="h-[400px] w-full relative group">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-[2px] z-10 rounded-xl">
                <Spinner className="h-8 w-8 text-primary" />
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis 
                  dataKey="Date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  minTickGap={60}
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    return d.toLocaleDateString(undefined, { year: '2-digit', month: 'short' });
                  }}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="Close" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-heading">Trading Volume</CardTitle>
            </div>
            <CardDescription>Daily shares traded (Last 90 Days)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.slice(-90)}>
                  <XAxis 
                    dataKey="Date" 
                    hide
                  />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--primary))', opacity: 0.1 }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border p-2 rounded shadow-sm text-xs">
                            <span className="text-muted-foreground">{payload[0].payload.Date}: </span>
                            <span className="font-bold">{(payload[0].value / 1000000).toFixed(1)}M</span>
                          </div>
                        )
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="Volume" 
                    fill="hsl(var(--primary))" 
                    opacity={0.6}
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm flex flex-col justify-center p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="font-heading font-semibold">Data Coverage</h4>
              <p className="text-sm text-muted-foreground">
                {data.length > 0 ? `${data[0].Date} to ${data[data.length-1].Date}` : 'Loading...'}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Historical analysis includes split-adjusted closing prices and volume data. Use the range selector to toggle between short-term momentum and long-term trends.
          </p>
        </Card>
      </div>
    </div>
  );
}

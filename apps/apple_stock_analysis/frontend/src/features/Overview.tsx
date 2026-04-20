import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { rpcCall } from '../api';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock,
  ShieldCheck,
  Zap,
  Globe,
  Smartphone
} from 'lucide-react';
import { SiApple } from 'react-icons/si';
import { Globe as SiNasdaq } from 'lucide-react';
import { Spinner } from '../components/ui/spinner';
import { cn } from '../lib/utils';

interface StockMetrics {
  current_price: number;
  "52w_high": number;
  "52w_low": number;
  rsi: number;
  sma_50: number;
  sma_200: number;
  last_updated: string;
}

export function Overview() {
  const [metrics, setMetrics] = useState<StockMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        console.log('[FETCH_START] get_stock_metrics');
        const data = await rpcCall({ func: 'get_stock_metrics' });
        console.log('[FETCH_RESPONSE] get_stock_metrics', data);
        setMetrics(data);
      } catch (err) {
        console.error('[PARSE_ERROR] get_stock_metrics', err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  const priceDiff = metrics.current_price - metrics.sma_50;
  const isAboveSma = priceDiff > 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden h-[300px] md:h-[350px] shadow-2xl group border border-border/50">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
          style={{ 
            backgroundImage: "url('./assets/hero-trading-desk-1.jpg')",
            backgroundColor: "#767A7C"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-6 md:p-10 space-y-3">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl shadow-lg">
              <SiApple className="h-6 w-6 text-black" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tight text-white drop-shadow-md">
                Apple Inc.
              </h1>
              <div className="flex items-center gap-2 text-white/80 font-medium">
                <SiNasdaq className="h-4 w-4" />
                <span>AAPL • NASDAQ</span>
              </div>
            </div>
          </div>
          <p className="text-white/70 max-w-2xl text-sm md:text-base leading-relaxed drop-shadow-sm font-medium">
            Professional-grade technical analysis and predictive modeling for global equity markets. Harnessing AI to decode AAPL market trends.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/40 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Market Price</p>
              <div className="bg-primary/10 p-2 rounded-lg">
                <Zap className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold font-heading">${metrics.current_price.toFixed(2)}</h3>
              <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5">
                Live
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Clock className="h-3 w-3" /> Updated {metrics.last_updated}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Relative Strength (RSI)</p>
              <div className="bg-primary/10 p-2 rounded-lg">
                <Activity className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold font-heading">{metrics.rsi}</h3>
              <Badge 
                variant={metrics.rsi > 70 ? 'destructive' : metrics.rsi < 30 ? 'secondary' : 'default'}
                className="text-xs"
              >
                {metrics.rsi > 70 ? 'Overbought' : metrics.rsi < 30 ? 'Oversold' : 'Neutral'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">14-day technical oscillator</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">MA Analysis</p>
              <div className="bg-primary/10 p-2 rounded-lg">
                {isAboveSma ? <TrendingUp className="h-4 w-4 text-emerald-500" /> : <TrendingDown className="h-4 w-4 text-rose-500" />}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">SMA 50:</span>
                <span className="text-sm font-mono font-bold">${metrics.sma_50}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">SMA 200:</span>
                <span className="text-sm font-mono font-bold">${metrics.sma_200}</span>
              </div>
            </div>
            <div className={cn(
              "text-[10px] font-bold mt-2 flex items-center gap-1",
              isAboveSma ? "text-emerald-500" : "text-rose-500"
            )}>
              {isAboveSma ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {isAboveSma ? 'Bullish' : 'Bearish'} Trend Signal
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">52-Week Range</p>
              <div className="bg-primary/10 p-2 rounded-lg">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] text-muted-foreground font-bold">
                <span>LO: ${metrics["52w_low"]}</span>
                <span>HI: ${metrics["52w_high"]}</span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden relative">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${((metrics.current_price - metrics["52w_low"]) / (metrics["52w_high"] - metrics["52w_low"])) * 100}%` 
                  }}
                />
              </div>
              <p className="text-[10px] text-center text-muted-foreground font-medium">Position within yearly channel</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Media Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden border-border/40 group cursor-pointer hover:shadow-primary/5 transition-all">
          <div className="grid grid-cols-1 sm:grid-cols-2 h-full">
            <div 
              className="h-48 sm:h-auto bg-cover bg-center" 
              style={{ backgroundImage: "url('./assets/card-mobile-app-1.jpg')" }}
            />
            <div className="p-6 flex flex-col justify-center bg-card/50 backdrop-blur">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Globe className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Platform</span>
              </div>
              <h4 className="text-xl font-bold font-heading mb-2">Ecosystem Intelligence</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connect your portfolios and track cross-sector correlation between tech giants globally.
              </p>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden border-border/40 group cursor-pointer hover:shadow-primary/5 transition-all">
          <div className="grid grid-cols-1 sm:grid-cols-2 h-full">
            <div className="p-6 flex flex-col justify-center bg-card/50 backdrop-blur order-2 sm:order-1">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Smartphone className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Mobile</span>
              </div>
              <h4 className="text-xl font-bold font-heading mb-2">Analysis on the Go</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our responsive dashboard ensures you never miss a market shift, whether at your desk or in transit.
              </p>
            </div>
            <div 
              className="h-48 sm:h-auto bg-cover bg-center order-1 sm:order-2" 
              style={{ backgroundImage: "url('./assets/card-mobile-app-2.jpg')" }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

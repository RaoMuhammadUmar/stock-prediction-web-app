import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  History, 
  LineChart, 
  Settings, 
  Menu,
  ChevronRight,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { SiApple } from 'react-icons/si';
import { cn } from './lib/utils';
import { Separator } from './components/ui/separator';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Overview } from './features/Overview';
import { HistoricalAnalysis } from './features/HistoricalAnalysis';
import { Forecasting } from './features/Forecasting';

export default function App() {
  const [activeView, setActiveView] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    console.log("RENDER_SUCCESS");
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'historical', label: 'Historical Analysis', icon: History },
    { id: 'forecasting', label: 'Forecasting', icon: LineChart },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'overview': return <Overview />;
      case 'historical': return <HistoricalAnalysis />;
      case 'forecasting': return <Forecasting />;
      default: return <Overview />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/20">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[100px]" />
        <div 
          className="absolute inset-0 opacity-[0.03] bg-repeat pointer-events-none" 
          style={{ backgroundImage: "url('./assets/bg-abstract-gradient-1.jpg')", backgroundSize: 'cover' }}
        />
      </div>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col border-r border-border/40 bg-card/30 backdrop-blur-xl transition-all duration-300 relative z-20",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl border border-primary/20">
            <SiApple className="h-6 w-6 text-primary" />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="font-heading font-black text-lg tracking-tight">AAPL.ai</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Stock Intelligence</span>
            </div>
          )}
        </div>

        <Separator className="mx-6 w-auto opacity-40" />

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                console.log(`[ACTION_START] Navigating to ${item.id}`);
                setActiveView(item.id);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                activeView === item.id 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
                activeView === item.id ? "text-white" : "text-muted-foreground"
              )} />
              {isSidebarOpen && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
              {isSidebarOpen && activeView === item.id && (
                <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          {isSidebarOpen ? (
            <Card className="bg-primary/5 border-primary/20 p-4 space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Pro Verified</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                You are currently using the professional tier analysis tools.
              </p>
              <Button size="sm" variant="outline" className="w-full h-8 text-xs border-primary/30 text-primary hover:bg-primary/10">
                Manage Billing
              </Button>
            </Card>
          ) : (
            <div className="flex justify-center">
              <ShieldCheck className="h-5 w-5 text-primary opacity-50" />
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="mt-4 w-full h-10 text-muted-foreground hover:text-foreground"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden border-b border-border/40 bg-card/50 backdrop-blur px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SiApple className="h-5 w-5 text-primary" />
            <span className="font-heading font-bold text-sm tracking-tight">AAPL.ai</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500">
               <TrendingUp className="h-3 w-3" />
               LIVE
             </div>
          </div>
        </header>

        {/* View Scroll Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 pb-24 md:pb-12">
            {renderView()}
          </div>
        </div>

        {/* Mobile Bottom Tabs */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border/40 bg-card/80 backdrop-blur flex justify-around py-3 pb-safe z-30 shadow-[0_-8px_30px_rgb(0,0,0,0.12)]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all",
                activeView === item.id ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-bold uppercase tracking-tight">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}

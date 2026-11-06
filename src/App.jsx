import React, { useState, useEffect } from 'react';
import { 
  RadioTower, Wifi, Zap, ChevronLeft, Activity, Shield, Layers, Target, Maximize2
} from 'lucide-react';

// --- Reusable Image Component with Fallback ---
const ProductImage = ({ src, alt, fallbackIcon, className }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
      {!imgError ? (
        <img 
          src={src} 
          alt={alt} 
          onError={() => setImgError(true)}
          className="object-cover w-full h-full transition-transform duration-[2s] hover:scale-110 ease-out opacity-90"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-zinc-600 z-20">
          {fallbackIcon}
          <span className="text-xs mt-2 font-medium tracking-widest uppercase opacity-50 text-center px-4">Image Unavailable</span>
        </div>
      )}
    </div>
  );
};

// --- Expanded Data with Cinematic Abstract Tech Images ---
const products = [
  {
    id: 'siklu-8010fx',
    brand: 'Siklu',
    name: 'EtherHaul 8010 FX',
    subtitle: '10Gbps E-Band Radio',
    frequency: '70/80GHz (E-Band)',
    throughput: '10 Gbps Full Duplex',
    range: 'Up to 7km',
    primaryUses: 'Ultra-high capacity macro-cell backhaul and premium enterprise connections.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    fallbackIcon: <Zap size={80} />,
    accent: 'bg-zinc-800 text-zinc-100',
    badge: 'Flagship',
    detailedSpecs: {
      "Frequency Band": "71-76 GHz & 81-86 GHz (E-Band)",
      "Max Throughput": "10 Gbps Full Duplex",
      "Typical Range": "Up to 7km (4.3 miles)",
      "Use Case": "Ultra-high capacity macro-cell backhaul",
      "Latency": "< 10 microseconds",
      "Antenna Options": "0.5ft, 1ft, 2ft integrated/external",
      "Modulation": "Up to 256 QAM"
    }
  },
  {
    id: 'siklu-1200fx',
    brand: 'Siklu',
    name: 'EtherHaul 1200 FX',
    subtitle: '1Gbps E-Band Metro Radio',
    frequency: '70/80GHz (E-Band)',
    throughput: '1 Gbps Full Duplex',
    range: 'Up to 7km',
    primaryUses: 'Business broadband, safe city networks, and CCTV backhaul.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200&auto=format&fit=crop',
    fallbackIcon: <Layers size={80} />,
    accent: 'bg-zinc-800 text-zinc-100',
    detailedSpecs: {
      "Frequency Band": "71-76 GHz & 81-86 GHz",
      "Max Throughput": "1 Gbps Full Duplex",
      "Typical Range": "Up to 7km (4.3 miles)",
      "Use Case": "Business broadband, CCTV backhaul",
      "Channel Bandwidth": "250, 500 MHz",
      "Power Options": "PoE+, 36-57V DC",
      "Encryption": "AES 128-bit & 256-bit"
    }
  },
  {
    id: 'siklu-t280',
    brand: 'Siklu',
    name: 'MultiHaul TG T280',
    subtitle: 'Terragraph V-Band PtMP',
    frequency: '60GHz (V-Band)',
    throughput: '1 Gbps+',
    range: 'Short-haul (PtMP)',
    primaryUses: 'Urban PtMP gigabit access and high-density smart city deployments.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop',
    fallbackIcon: <RadioTower size={80} />,
    accent: 'bg-zinc-800 text-zinc-100',
    detailedSpecs: {
      "Frequency Band": "57-66 GHz (V-Band Terragraph)",
      "Max Throughput": "1 Gbps+ Aggregate",
      "Topology": "Point-to-Multipoint (PtMP)",
      "Use Case": "Urban PtMP gigabit access",
      "Beamforming": "3D Active Phased Array",
      "Scanning Range": "Horizontal 90°, Vertical 50°",
      "Certification": "Facebook Terragraph Certified"
    }
  },
  {
    id: 'ubnt-5xhd',
    brand: 'Ubiquiti',
    name: 'airFiber 5XHD',
    subtitle: 'High-Performance 5GHz Backhaul',
    frequency: '5GHz',
    throughput: '1.34 Gbps',
    range: '100+ km',
    primaryUses: 'The undisputed champion of long-range WISP backhaul. Custom LTU silicon.',
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=1200&auto=format&fit=crop',
    fallbackIcon: <Wifi size={80} />,
    accent: 'bg-blue-600 text-white',
    badge: 'Legendary',
    detailedSpecs: {
      "Frequency Band": "5.1 - 5.9 GHz",
      "Max Throughput": "1.34 Gbps Aggregate",
      "Typical Range": "100+ km",
      "Use Case": "Long-range WISP backhaul",
      "Core Technology": "Custom LTU Silicon",
      "Durability": "IP67 Weather Resistance",
      "Spectral Efficiency": "Up to 21.2 bps/Hz",
      "Modulation": "Up to 4096 QAM (with update)"
    }
  },
  {
    id: 'ubnt-af60xr',
    brand: 'Ubiquiti',
    name: 'airFiber 60 XR',
    subtitle: 'Extreme Range 60GHz',
    frequency: '60GHz with 5GHz Backup',
    throughput: '2.5+ Gbps',
    range: '15+ km',
    primaryUses: 'Long-range multi-gigabit PtP with built-in 5GHz redundancy for extreme weather.',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200&auto=format&fit=crop',
    fallbackIcon: <Maximize2 size={80} />,
    accent: 'bg-blue-600 text-white',
    detailedSpecs: {
      "Frequency Band": "60 GHz (Primary) + 5 GHz (Backup)",
      "Max Throughput": "2.5+ Gbps",
      "Typical Range": "15+ km",
      "Use Case": "Long-range multi-gigabit PtP",
      "Antenna": "Integrated High-Gain Dish",
      "GPS": "Built-in GPS Sync",
      "Management": "Bluetooth via UISP App"
    }
  },
  {
    id: 'ubnt-af24',
    brand: 'Ubiquiti',
    name: 'airFiber 24',
    subtitle: '24GHz Low-Latency Backhaul',
    frequency: '24GHz',
    throughput: '1.4 Gbps',
    range: '13+ km',
    primaryUses: 'Interference-free high capacity backhaul for carrier and enterprise networks.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    fallbackIcon: <Activity size={80} />,
    accent: 'bg-blue-600 text-white',
    detailedSpecs: {
      "Frequency Band": "24.05 - 24.25 GHz",
      "Max Throughput": "1.4 Gbps Aggregate",
      "Typical Range": "13+ km",
      "Use Case": "Interference-free high capacity backhaul",
      "Operation Mode": "FDD and HDD",
      "Latency": "< 1 ms",
      "Design": "Dual-Independent Antenna Design"
    }
  },
  {
    id: 'ubnt-2x',
    brand: 'Ubiquiti',
    name: 'airFiber 2X',
    subtitle: '2.4GHz NLOS Backhaul',
    frequency: '2.4GHz',
    throughput: '500+ Mbps',
    range: '100+ km',
    primaryUses: 'Designed specifically for links where perfect line-of-sight is impossible (NLOS).',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
    fallbackIcon: <Target size={80} />,
    accent: 'bg-blue-600 text-white',
    detailedSpecs: {
      "Frequency Band": "2.4 GHz",
      "Max Throughput": "500+ Mbps",
      "Typical Range": "100+ km",
      "Use Case": "NLOS capable rural backhaul",
      "Key Features": "Slant 45 Antenna Design",
      "Spectral Efficiency": "Up to 17.1 Mbps/MHz",
      "Synchronization": "GPS Clock Synchronization"
    }
  },
  {
    id: 'mimosa-b24',
    brand: 'Mimosa',
    name: 'B24',
    subtitle: 'Urban 24GHz Backhaul',
    frequency: '24GHz',
    throughput: '1.5 Gbps Aggregate',
    range: 'Up to 3km',
    primaryUses: 'Urban micro-pop and lightweight gigabit PtP deployments.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    fallbackIcon: <RadioTower size={80} />,
    accent: 'bg-orange-500 text-white',
    detailedSpecs: {
      "Frequency Band": "24.00 - 24.25 GHz",
      "Max Throughput": "1.5 Gbps Aggregate",
      "Typical Range": "Up to 3km (1.8 miles)",
      "Use Case": "Urban micro-pop, lightweight gigabit PtP",
      "Weight": "Ultra-lightweight design (6 lbs)",
      "Latency": "< 1 ms",
      "Power Consumption": "19.5W Max"
    }
  },
  {
    id: 'mimosa-b5',
    brand: 'Mimosa',
    name: 'B5',
    subtitle: 'Flexible 5GHz Backhaul',
    frequency: '5GHz',
    throughput: '1.5 Gbps Aggregate',
    range: 'Medium to Long-range',
    primaryUses: 'Colocation-friendly backhaul with advanced spectrum reuse technologies.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
    fallbackIcon: <Shield size={80} />,
    accent: 'bg-orange-500 text-white',
    detailedSpecs: {
      "Frequency Band": "4.9 - 6.2 GHz",
      "Max Throughput": "1.5 Gbps Aggregate",
      "Key Feature": "4x4:4 MIMO",
      "Use Case": "Colocation-friendly backhaul",
      "Synchronization": "High-precision GPS Sync",
      "Interference Mitigation": "Dual Link with Auto-Channel",
      "Antenna": "Integrated 25 dBi"
    }
  },
  {
    id: 'ignitenet-metro',
    brand: 'IgniteNet',
    name: 'MetroLinq',
    subtitle: '60GHz PtP/PtMP Hybrid',
    frequency: '60GHz + 5GHz Backup',
    throughput: '1 - 2.5 Gbps',
    range: '1-1.5km',
    primaryUses: 'Cost-effective urban gigabit distribution and short-haul fiber extension.',
    image: 'https://images.unsplash.com/photo-1480694313141-fce5e697ee25?q=80&w=1200&auto=format&fit=crop',
    fallbackIcon: <Zap size={80} />,
    accent: 'bg-emerald-600 text-white',
    detailedSpecs: {
      "Frequency Band": "60 GHz (Primary) + 5 GHz (Backup)",
      "Max Throughput": "1 - 2.5 Gbps",
      "Typical Range": "1 - 1.5km",
      "Use Case": "Cost-effective urban gigabit distribution",
      "Topology Support": "PtP and PtMP compatible",
      "Management": "Cloud Controller ready",
      "Interfaces": "SFP port & Gigabit Ethernet"
    }
  }
];

const brands = ['All', 'Siklu', 'Ubiquiti', 'Mimosa', 'IgniteNet'];

export default function App() {
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const filteredProducts = selectedBrand === 'All' 
    ? products 
    : products.filter(p => p.brand === selectedBrand);

  const handleProductSelect = (product) => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedProduct(product);
      setIsAnimating(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  };

  const handleBack = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedProduct(null);
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f7] font-sans antialiased overflow-x-hidden selection:bg-white selection:text-black">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@300;400;500;600;700&display=swap');
        body { font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #050505; color: #f5f5f7; }
        
        .fade-enter { opacity: 0; transform: translateY(30px) scale(0.97); }
        .fade-enter-active { opacity: 1; transform: translateY(0) scale(1); transition: opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1); }
        
        .glass-panel {
          background: rgba(30, 30, 30, 0.4);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
        }
        
        .premium-shadow {
          box-shadow: 0 30px 60px -10px rgba(0,0,0,0.8), 0 20px 30px -10px rgba(0,0,0,0.5);
        }
        
        .card-3d-hover {
          transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.7s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.7s ease;
        }
        .card-3d-hover:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 40px 80px -15px rgba(0,0,0,1), 0 20px 40px -10px rgba(0,0,0,0.8);
          border-color: rgba(255, 255, 255, 0.2);
        }
          
        .spec-row:not(:last-child) {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}} />

      {/* Sleek Top Navigation */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 rounded-b-[2rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div 
              className="flex items-center cursor-pointer transition-opacity hover:opacity-70"
              onClick={() => selectedProduct && handleBack()}
            >
              <span className="font-bold tracking-tight text-xl md:text-2xl text-white flex items-center gap-2">
                <RadioTower className="text-zinc-400" size={24} />
                NewConnect Radio Use
              </span>
            </div>
            {/* Desktop Brand Navigation */}
            {!selectedProduct && (
              <div className="hidden md:flex space-x-1 bg-white/5 p-1 rounded-full backdrop-blur-md border border-white/10">
                {brands.map(brand => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`px-6 py-1.5 rounded-full text-sm font-medium transition-all duration-500 ${
                      selectedBrand === brand 
                        ? 'bg-white text-black shadow-lg shadow-white/20' 
                        : 'text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isAnimating ? 'opacity-0 scale-[0.96] blur-md' : 'opacity-100 scale-100 blur-0'}`}>
        {!selectedProduct ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            
            {/* Hero Section */}
            <div className="text-center mb-20 md:mb-32 fade-enter fade-enter-active relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>
              <h1 className="text-5xl md:text-[5.5rem] leading-none font-bold tracking-tighter mb-6 text-white relative z-10">
                Pro-Grade Radios.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-700">Unmatched Performance.</span>
              </h1>
              <p className="text-xl md:text-2xl text-zinc-400 font-light max-w-3xl mx-auto tracking-wide relative z-10">
                Discover our curated selection of millimeter-wave and microwave systems. Precision engineered for elite backhaul.
              </p>
            </div>

            {/* Mobile Filter Navigation */}
            <div className="md:hidden flex justify-start overflow-x-auto pb-6 mb-8 -mx-4 px-4 snap-x fade-enter fade-enter-active" style={{transitionDelay: '100ms'}}>
              <div className="flex space-x-2 bg-white/5 p-1 rounded-full backdrop-blur-xl border border-white/10 w-max snap-center">
                {brands.map(brand => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedBrand === brand 
                        ? 'bg-white text-black' 
                        : 'text-zinc-400'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12 pb-24">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  className="glass-panel rounded-[2rem] p-6 cursor-pointer card-3d-hover flex flex-col h-full fade-enter fade-enter-active group relative overflow-hidden"
                  style={{transitionDelay: `${150 + (index * 50)}ms`}}
                >
                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-10 left-10 z-20 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wider text-white border border-white/20 shadow-xl">
                      {product.badge}
                    </span>
                  )}

                  <div className="w-full h-64 rounded-[1.5rem] bg-black flex items-center justify-center mb-8 premium-shadow relative overflow-hidden group-hover:shadow-2xl transition-shadow">
                    <ProductImage 
                      src={product.image} 
                      alt={product.name} 
                      fallbackIcon={product.fallbackIcon}
                      className="w-full h-full"
                    />
                  </div>
                  
                  <div className="flex-grow flex flex-col px-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 w-max ${product.accent}`}>
                      {product.brand}
                    </span>
                    <h3 className="text-3xl font-bold tracking-tight mb-2 text-white group-hover:text-zinc-300 transition-colors">{product.name}</h3>
                    <p className="text-zinc-400 font-light text-lg mb-6">{product.subtitle}</p>
                    
                    <div className="mt-auto w-full pt-6 border-t border-white/5 flex justify-between items-center text-sm font-medium text-zinc-500">
                      <span>{product.frequency.split(' ')[0]}</span>
                      <span className="text-zinc-300">{product.throughput.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Product Detail View - Cinematic Apple Style */
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
            <button 
              onClick={handleBack}
              className="group flex items-center text-sm font-semibold tracking-wide text-zinc-500 hover:text-white transition-colors mb-12 uppercase bg-white/5 px-4 py-2 rounded-full backdrop-blur-md w-max border border-white/10"
            >
              <ChevronLeft className="w-5 h-5 mr-1 transition-transform group-hover:-translate-x-1" />
              Back to Lineup
            </button>

            {/* Cinematic Header Image */}
            <div className="w-full h-[40vh] md:h-[60vh] rounded-[3rem] overflow-hidden mb-16 relative premium-shadow group">
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent z-10"></div>
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name}
                className="w-full h-full object-cover transition-transform duration-[3s] ease-out group-hover:scale-105"
              />
              <div className="absolute bottom-12 left-12 z-20">
                <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 shadow-lg ${selectedProduct.accent}`}>
                    {selectedProduct.brand}
                </span>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white drop-shadow-2xl">
                  {selectedProduct.name}
                </h1>
              </div>
            </div>

            <div className="glass-panel rounded-[3rem] p-8 md:p-16 premium-shadow relative overflow-hidden border-white/10">
              
              {/* Abstract Background Element */}
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-[80px] pointer-events-none"></div>

              {/* Top Level Summary */}
              <div className="mb-20 relative z-10 max-w-4xl">
                 <p className="text-2xl md:text-4xl text-zinc-300 font-light leading-snug tracking-tight">
                    {selectedProduct.subtitle}. <span className="text-zinc-500">{selectedProduct.primaryUses}</span>
                 </p>
              </div>

              {/* Quick Highlight Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-24 relative z-10">
                <div className="bg-black/50 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 border border-white/5 hover:border-white/20 transition-colors">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Throughput</h3>
                  <p className="text-2xl md:text-3xl font-semibold text-white tracking-tight">{selectedProduct.throughput.split(' ')[0]}</p>
                  <p className="text-sm text-zinc-600 mt-1">{selectedProduct.throughput.split(' ').slice(1).join(' ')}</p>
                </div>
                <div className="bg-black/50 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 border border-white/5 hover:border-white/20 transition-colors">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Frequency</h3>
                  <p className="text-2xl md:text-3xl font-semibold text-white tracking-tight">{selectedProduct.frequency.split(' ')[0]}</p>
                  <p className="text-sm text-zinc-600 mt-1">{selectedProduct.frequency.split(' ').slice(1).join(' ')}</p>
                </div>
                <div className="bg-black/50 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 border border-white/5 hover:border-white/20 transition-colors">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Range</h3>
                  <p className="text-2xl md:text-3xl font-semibold text-white tracking-tight">{selectedProduct.range.split('(')[0]}</p>
                  <p className="text-sm text-zinc-600 mt-1">Maximum theoretical</p>
                </div>
                <div className="bg-black/50 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 border border-white/5 hover:border-white/20 transition-colors">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Class</h3>
                  <p className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Enterprise</p>
                  <p className="text-sm text-zinc-600 mt-1">Carrier-grade</p>
                </div>
              </div>

              {/* Comprehensive Tech Specs Grid */}
              <div className="relative z-10">
                <h2 className="text-3xl font-bold tracking-tight mb-10 text-white flex items-center gap-3">
                  <Layers className="text-zinc-500" /> Technical Specifications
                </h2>
                
                <div className="bg-black/40 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-xl">
                  {Object.entries(selectedProduct.detailedSpecs).map(([key, value]) => (
                    <div key={key} className="spec-row flex flex-col md:flex-row md:items-center p-6 md:px-10 md:py-6 hover:bg-white/5 transition-colors">
                       <div className="md:w-1/3 text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2 md:mb-0">
                          {key}
                       </div>
                       <div className="md:w-2/3 text-lg md:text-xl font-medium text-zinc-100">
                          {value}
                       </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}
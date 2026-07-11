import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { GlassCard } from '../components/GlassCard';
import { 
  Utensils, Clock, MapPin, Search, ChevronRight, 
  Heart, Check, Info, ShieldAlert, ShoppingBag
} from 'lucide-react';

interface FoodStall {
  id: string;
  name: string;
  stall: string;
  price: number;
  category: 'halal' | 'vegetarian' | 'kids' | 'healthy' | 'general';
  queueTime: number;
  occupancy: number;
  walkingDistance: number;
  available: boolean;
}

export const Food: React.FC = () => {
  const { liveData, addAlert } = useSocket();
  const [stalls, setStalls] = useState<FoodStall[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<'queue' | 'distance' | 'price'>('queue');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderStall, setOrderStall] = useState<FoodStall | null>(null);
  const [orderedItem, setOrderedItem] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Sync / fetch food list
  const fetchFood = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/food');
      if (res.ok) {
        const data = await res.json();
        setStalls(data);
      }
    } catch (err) {
      console.warn('REST API unavailable, loading offline mock food register.');
      const mockList: FoodStall[] = [
        { id: 'f-1', name: 'Copa Grill', stall: 'Gate B East', price: 14.50, category: 'halal', queueTime: 4, occupancy: 35, walkingDistance: 2, available: true },
        { id: 'f-2', name: 'Green Field Bistro', stall: 'Gate D West', price: 12.00, category: 'vegetarian', queueTime: 2, occupancy: 15, walkingDistance: 4, available: true },
        { id: 'f-3', name: 'Lil Kicker Meals', stall: 'Section 210 Lobby', price: 9.00, category: 'kids', queueTime: 8, occupancy: 65, walkingDistance: 5, available: true },
        { id: 'f-4', name: 'Fit Athlete Salads', stall: 'Section 105 Outer Loop', price: 13.00, category: 'healthy', queueTime: 3, occupancy: 20, walkingDistance: 3, available: true },
        { id: 'f-5', name: 'Stadium Dogs & Brews', stall: 'Gate A North', price: 11.50, category: 'general', queueTime: 12, occupancy: 85, walkingDistance: 1, available: true }
      ];
      setStalls(mockList);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFood();
  }, []);

  // Update wait times from real-time socket ticks when available
  useEffect(() => {
    if (liveData.queues.food && stalls.length > 0) {
      setStalls(prev => prev.map((item, idx) => {
        const updated = liveData.queues.food[idx];
        if (updated) {
          return { ...item, queueTime: updated.waitTime };
        }
        return item;
      }));
    }
  }, [liveData]);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderedItem) return;

    setOrderPlaced(true);
    addAlert(`🛍️ ORDER PLACED: "${orderedItem}" at "${orderStall?.name}". Estimated collection in ${orderStall?.queueTime} mins.`);
    setTimeout(() => {
      setOrderPlaced(false);
      setOrderStall(null);
      setOrderedItem('');
    }, 4000);
  };

  // Filter and sort
  const filteredStalls = stalls
    .filter(stall => categoryFilter === 'all' || (stall.category || 'general') === categoryFilter)
    .filter(stall => (stall.name || '').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === 'queue') return (a.queueTime ?? 0) - (b.queueTime ?? 0);
      if (sortKey === 'distance') return (a.walkingDistance ?? 0) - (b.walkingDistance ?? 0);
      return (a.price ?? 0) - (b.price ?? 0);
    });

  const getOccupancyColor = (density: number) => {
    if (density < 30) return 'text-emeraldGreen';
    if (density < 70) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Utensils className="w-8 h-8 text-neonBlue" />
            <span>Food Concourse & Queue Tracker</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Search nearby menus. Filter meals by dietary requirements and view live wait-time updates.
          </p>
        </div>

        {/* DIETARY FILTERS */}
        <div className="flex flex-wrap items-center gap-2 bg-white/5 border border-white/5 p-2 rounded-xl text-xs">
          {['all', 'halal', 'vegetarian', 'kids', 'healthy'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-all
                ${categoryFilter === cat 
                  ? 'bg-neonBlue/10 text-neonBlue border border-neonBlue/20' 
                  : 'text-gray-400 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: FILTER CONTROLS & LISTINGS */}
        <div className="lg:col-span-8 space-y-6">
          <GlassCard className="py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              {/* SEARCH */}
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search stalls..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-neonBlue transition-all"
                />
              </div>

              {/* SORT OPTIONS */}
              <div className="flex items-center gap-2 text-[11px] self-end sm:self-auto">
                <span className="text-gray-500 font-bold uppercase tracking-wider">Sort by:</span>
                <div className="flex bg-white/5 rounded-lg p-1 border border-white/5">
                  <button 
                    onClick={() => setSortKey('queue')}
                    className={`px-3 py-1 rounded-md font-semibold transition-all ${sortKey === 'queue' ? 'bg-[#0D0D13] text-neonBlue' : 'text-gray-400 hover:text-white'}`}
                  >
                    Queue Time
                  </button>
                  <button 
                    onClick={() => setSortKey('distance')}
                    className={`px-3 py-1 rounded-md font-semibold transition-all ${sortKey === 'distance' ? 'bg-[#0D0D13] text-neonBlue' : 'text-gray-400 hover:text-white'}`}
                  >
                    Distance
                  </button>
                  <button 
                    onClick={() => setSortKey('price')}
                    className={`px-3 py-1 rounded-md font-semibold transition-all ${sortKey === 'price' ? 'bg-[#0D0D13] text-neonBlue' : 'text-gray-400 hover:text-white'}`}
                  >
                    Price
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* STALLS CARDS LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <p className="text-xs text-gray-500 font-mono animate-pulse">Syncing concessions data...</p>
            ) : filteredStalls.length === 0 ? (
              <p className="text-xs text-gray-500">No stalls found matching criteria.</p>
            ) : (
              filteredStalls.map((stall) => (
                <GlassCard key={stall.id} hoverEffect className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-white">{stall.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-neonBlue" />
                        <span>Stall: {stall.stall || 'Unknown'}</span>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-emeraldGreen bg-emeraldGreen/10 border border-emeraldGreen/20 px-2 py-0.5 rounded uppercase">
                      {stall.category}
                    </span>
                  </div>

                  {/* TELEMETRIC VALUES */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs border-y border-white/5 py-3">
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Wait Queue</p>
                      <p className="font-extrabold text-white font-mono mt-0.5">{stall.queueTime ?? 0} mins</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Walking</p>
                      <p className="font-extrabold text-white font-mono mt-0.5">{stall.walkingDistance ?? 0} mins</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Stall Density</p>
                      <p className={`font-extrabold font-mono mt-0.5 ${getOccupancyColor(stall.occupancy ?? 0)}`}>{stall.occupancy ?? 0}%</p>
                    </div>
                  </div>

                  {/* ACTION: PRE-ORDER */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-bold text-white font-mono">${(stall.price ?? 0).toFixed(2)} average</span>
                    <button 
                      onClick={() => setOrderStall(stall)}
                      className="bg-neonBlue/10 hover:bg-neonBlue/20 text-neonBlue border border-neonBlue/20 hover:border-neonBlue/40 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                    >
                      Pre-Order Menu
                    </button>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: PRE-ORDER PANEL OR DETAILS */}
        <div className="lg:col-span-4">
          {orderStall ? (
            <GlassCard glowColor="blue" className="space-y-6">
              <div className="flex items-start justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Pre-Order Ticket</h3>
                  <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-wider">{orderStall.name}</p>
                </div>
                <button 
                  onClick={() => setOrderStall(null)}
                  className="text-xs text-gray-500 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              {orderPlaced ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emeraldGreen/10 border border-emeraldGreen/20 flex items-center justify-center text-emeraldGreen mx-auto animate-bounce">
                    <Check className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-white">Order Received!</p>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto">
                    Prepare to collect item in {orderStall.queueTime ?? 0} mins at {orderStall.stall || 'Unknown Stall'}. A receipt has been issued.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-gray-400 font-bold uppercase tracking-wider mb-1.5">Select Food Item</label>
                    <select
                      value={orderedItem}
                      onChange={(e) => setOrderedItem(e.target.value)}
                      className="w-full bg-[#0D0D13] border border-white/10 rounded-xl py-2.5 px-3.5 text-white"
                      required
                    >
                      <option value="">-- Choose Item --</option>
                      {(orderStall.category || 'general') === 'halal' && (
                        <>
                          <option value="Halal Double Burger">Halal Double Cheeseburger - $14.50</option>
                          <option value="Spicy Chicken Fillet">Spicy Halal Chicken Burger - $13.00</option>
                          <option value="Sweet Potato Wedges">Sweet Potato Wedges - $5.50</option>
                        </>
                      )}
                      {(orderStall.category || 'general') === 'vegetarian' && (
                        <>
                          <option value="Green Field Falafel Wrap">Falafel Avocado Wrap - $12.00</option>
                          <option value="Vegan Quinoa Bowl">Vegan Quinoa Crunch Bowl - $11.00</option>
                        </>
                      )}
                      {(orderStall.category || 'general') === 'kids' && (
                        <>
                          <option value="Lil Soccer Slider Meal">Lil Soccer Slider Meal - $9.00</option>
                          <option value="Mini Hot Dog Combo">Mini Hot Dog Combo - $8.00</option>
                        </>
                      )}
                      {(orderStall.category || 'general') === 'healthy' && (
                        <>
                          <option value="Athlete Grain Salad">Athlete Energy Grain Salad - $13.00</option>
                          <option value="High-Protein Shake">High-Protein Berry Shake - $7.50</option>
                        </>
                      )}
                      {(orderStall.category || 'general') === 'general' && (
                        <>
                          <option value="Stadium Dog & Fries">Stadium Hot Dog & Fries - $11.50</option>
                          <option value="Pretzel with Cheese">Warm Pretzel with Cheese - $6.00</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="bg-white/5 border border-white/5 p-3 rounded-xl space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-mono font-bold">${(orderStall.price ?? 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-neonBlue">
                      <span>Queue Skip Offset:</span>
                      <span className="font-mono font-bold">Included</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-neonBlue to-emeraldGreen text-[#07070A] font-bold py-3 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Purchase Voucher</span>
                  </button>
                </form>
              )}
            </GlassCard>
          ) : (
            <GlassCard className="flex flex-col items-center justify-center text-center p-12 min-h-[300px]">
              <Info className="w-10 h-10 text-gray-500 mb-3" />
              <p className="text-sm text-gray-400 font-bold">No Menu Pre-Order Active</p>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">Select any food stall card menu option on the left pane to pre-order and bypass queues.</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};
export default Food;

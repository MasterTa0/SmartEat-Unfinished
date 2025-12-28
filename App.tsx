
import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import CameraModal from './components/CameraModal';
import { Meal, AppTab, NutritionTask, UserProfile } from './types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
// Added Utensils to the imports from lucide-react
import { Flame, Droplets, Salad, Activity, ChevronRight, Award, Utensils } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [showCamera, setShowCamera] = useState(false);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [tasks, setTasks] = useState<NutritionTask[]>([
    { id: '1', title: '周蔬菜摄入', targetValue: 3500, currentValue: 1200, unit: 'g', deadline: Date.now() + 86400000 * 3, type: 'weekly', category: 'veg' },
    { id: '2', title: '每日蛋白质', targetValue: 80, currentValue: 45, unit: 'g', deadline: Date.now() + 3600000 * 12, type: 'weekly', category: 'protein' },
    { id: '3', title: '控制糖分摄入', targetValue: 200, currentValue: 180, unit: 'g', deadline: Date.now() + 86400000 * 5, type: 'weekly', category: 'sugar' },
  ]);

  const [profile] = useState<UserProfile>({
    name: '李同学',
    weight: 68,
    height: 175,
    goal: '减脂塑形',
    dailyCalorieTarget: 1800
  });

  // Calculate today's total
  const todayMeals = meals.filter(m => new Date(m.timestamp).toDateString() === new Date().toDateString());
  const todayTotal = useMemo(() => {
    return todayMeals.reduce((acc, curr) => ({
      calories: acc.calories + curr.nutrients.calories,
      protein: acc.protein + curr.nutrients.protein,
      fat: acc.fat + curr.nutrients.fat,
      carbs: acc.carbs + curr.nutrients.carbs,
    }), { calories: 0, protein: 0, fat: 0, carbs: 0 });
  }, [todayMeals]);

  const chartData = [
    { name: '蛋白质', value: todayTotal.protein, color: '#10b981' },
    { name: '脂肪', value: todayTotal.fat, color: '#f59e0b' },
    { name: '碳水', value: todayTotal.carbs, color: '#3b82f6' },
  ];

  const handleSaveMeal = (mealData: any) => {
    const newMeal: Meal = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      type: 'lunch',
      image: mealData.image,
      foodName: mealData.foodName,
      nutrients: mealData.nutrients,
      description: mealData.textInfo
    };
    setMeals([newMeal, ...meals]);
    setShowCamera(false);
    
    // Update tasks logic (simple simulation)
    setTasks(prev => prev.map(t => {
      if (t.category === 'protein') return { ...t, currentValue: t.currentValue + mealData.nutrients.protein };
      if (t.category === 'calories') return { ...t, currentValue: t.currentValue + mealData.nutrients.calories };
      return t;
    }));
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onAddClick={() => setShowCamera(true)}>
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Calorie Card */}
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center gap-2">
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{todayTotal.calories}</span>
                <span className="text-xs text-gray-400">/ {profile.dailyCalorieTarget} kcal</span>
              </div>
            </div>
            
            <div className="w-full flex justify-between px-4 mt-2">
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400">蛋白质</span>
                <span className="font-bold text-emerald-500">{todayTotal.protein.toFixed(1)}g</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400">脂肪</span>
                <span className="font-bold text-amber-500">{todayTotal.fat.toFixed(1)}g</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400">碳水</span>
                <span className="font-bold text-blue-500">{todayTotal.carbs.toFixed(1)}g</span>
              </div>
            </div>
          </div>

          {/* Featured Task */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-5 rounded-3xl text-white shadow-lg shadow-emerald-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-20"><Award size={80} /></div>
             <div className="relative z-10">
                <h3 className="text-sm font-medium opacity-80 mb-1">本周重点任务</h3>
                <p className="text-xl font-bold mb-4">{tasks[0].title}</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-1000" 
                      style={{ width: `${Math.min(100, (tasks[0].currentValue / tasks[0].targetValue) * 100)}%` }} 
                    />
                  </div>
                  <span className="text-xs font-bold">{Math.round((tasks[0].currentValue / tasks[0].targetValue) * 100)}%</span>
                </div>
             </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-orange-50 text-orange-500 rounded-2xl"><Flame size={20} /></div>
              <div>
                <p className="text-[10px] text-gray-400">已消耗</p>
                <p className="text-sm font-bold">420 kcal</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-500 rounded-2xl"><Droplets size={20} /></div>
              <div>
                <p className="text-[10px] text-gray-400">水分摄入</p>
                <p className="text-sm font-bold">1800 ml</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'meals' && (
        <div className="space-y-4 pb-10">
          {meals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-300">
              <Utensils size={64} className="mb-4 opacity-20" />
              <p>还没有饮食记录，快去拍照吧</p>
            </div>
          ) : (
            meals.map(meal => (
              <div key={meal.id} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm flex h-32 animate-in slide-in-from-right-4">
                {meal.image && <img src={meal.image} className="w-32 h-full object-cover" />}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800">{meal.foodName}</h3>
                    <p className="text-[10px] text-gray-400">{new Date(meal.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })} · {meal.description || '无补充描述'}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-[10px] text-gray-400">热量</p>
                      <p className="text-xs font-bold text-emerald-500">{meal.nutrients.calories}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-gray-400">蛋白质</p>
                      <p className="text-xs font-bold">{meal.nutrients.protein}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-gray-400">重量</p>
                      <p className="text-xs font-bold">{meal.nutrients.weight}g</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 p-4 rounded-3xl flex items-center gap-4 border border-emerald-100">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-emerald-500"><Activity size={24} /></div>
            <div>
              <p className="text-sm font-bold text-emerald-900">AI 任务引擎已就绪</p>
              <p className="text-[10px] text-emerald-700">基于您的饮食习惯，每周一将自动为您生成新目标</p>
            </div>
          </div>

          {tasks.map(task => (
            <div key={task.id} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-800">{task.title}</h4>
                  <p className="text-[10px] text-gray-400">截止日期：{new Date(task.deadline).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-50 px-2 py-1 rounded-lg text-[10px] font-bold text-gray-500 uppercase">{task.type === 'weekly' ? '本周' : '本月'}</div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-700" 
                    style={{ width: `${Math.min(100, (task.currentValue / task.targetValue) * 100)}%` }} 
                  />
                </div>
                <span className="text-xs font-bold text-gray-700">{task.currentValue}/{task.targetValue}{task.unit}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="flex flex-col items-center py-6 gap-3">
            <div className="w-24 h-24 rounded-full bg-emerald-100 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
              <img src="https://picsum.photos/200" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <div className="flex gap-4">
              <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 text-center">
                <p className="text-[10px] text-gray-400">体重</p>
                <p className="font-bold">{profile.weight} kg</p>
              </div>
              <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 text-center">
                <p className="text-[10px] text-gray-400">身高</p>
                <p className="font-bold">{profile.height} cm</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 divide-y divide-gray-50 overflow-hidden shadow-sm">
            {[
              { label: '个人目标', value: profile.goal },
              { label: '每日卡路里预算', value: `${profile.dailyCalorieTarget} kcal` },
              { label: '饮食禁忌', value: '无' },
              { label: '数据导出', value: '' },
              { label: '关于慧食', value: 'v1.0.0' },
            ].map((item, idx) => (
              <div key={idx} className="p-5 flex justify-between items-center active:bg-gray-50 transition-colors">
                <span className="text-sm font-medium text-gray-600">{item.label}</span>
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-xs">{item.value}</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showCamera && (
        <CameraModal onClose={() => setShowCamera(false)} onSave={handleSaveMeal} />
      )}
    </Layout>
  );
};

export default App;

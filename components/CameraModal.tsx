
import React, { useState, useRef } from 'react';
import { Camera, X, Loader2, Check, ChevronRight } from 'lucide-react';
import { analyzeMealImage } from '../geminiService';
import { NutrientInfo } from '../types';

interface CameraModalProps {
  onClose: () => void;
  onSave: (mealData: { foodName: string; nutrients: NutrientInfo; image: string; textInfo: string }) => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ onClose, onSave }) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ foodName: string; nutrients: NutrientInfo } | null>(null);
  const [extraText, setExtraText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        setCapturedImage(event.target?.result as string);
        setIsAnalyzing(true);
        try {
          const result = await analyzeMealImage(base64);
          setAnalysisResult(result);
        } catch (error) {
          console.error("AI Analysis failed", error);
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full h-full max-w-md bg-white flex flex-col relative overflow-hidden rounded-t-3xl md:h-5/6">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
          <span className="font-semibold">记录这餐</span>
          <div className="w-10"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Photo Area */}
          <div className="relative aspect-square bg-gray-100 rounded-3xl overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-200">
            {capturedImage ? (
              <img src={capturedImage} className="w-full h-full object-cover" />
            ) : (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-3 text-gray-400"
              >
                <div className="p-5 bg-white rounded-full shadow-sm">
                  <Camera size={40} className="text-emerald-500" />
                </div>
                <span className="text-sm font-medium">点击拍摄或上传照片</span>
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              capture="environment" 
              onChange={handleCapture}
            />
          </div>

          {/* Analysis Result */}
          {isAnalyzing && (
            <div className="flex flex-col items-center py-8 gap-4 animate-pulse">
              <Loader2 className="animate-spin text-emerald-500" size={32} />
              <p className="text-sm text-gray-500 font-medium">AI 正在计算体积与成分...</p>
            </div>
          )}

          {analysisResult && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <h3 className="text-lg font-bold text-emerald-900 mb-1">{analysisResult.foodName}</h3>
                <p className="text-xs text-emerald-700">估计重量: {analysisResult.nutrients.weight}g</p>
                
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {[
                    { label: '热量', value: analysisResult.nutrients.calories, unit: 'kcal' },
                    { label: '蛋白质', value: analysisResult.nutrients.protein, unit: 'g' },
                    { label: '脂肪', value: analysisResult.nutrients.fat, unit: 'g' },
                    { label: '碳水', value: analysisResult.nutrients.carbs, unit: 'g' },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/50 p-2 rounded-xl flex flex-col items-center">
                      <span className="text-[10px] text-gray-500">{item.label}</span>
                      <span className="font-bold text-sm">{item.value}</span>
                      <span className="text-[8px] text-gray-400">{item.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manual Info Supplement */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 ml-1">补充信息 (如酱料、配料或具体重量)</label>
                <textarea 
                  value={extraText}
                  onChange={(e) => setExtraText(e.target.value)}
                  placeholder="例如：加了少许沙拉酱，大约200克左右..."
                  className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none text-sm min-h-[100px] transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-6 border-t border-gray-100">
          <button 
            disabled={!analysisResult}
            onClick={() => analysisResult && onSave({ ...analysisResult, image: capturedImage!, textInfo: extraText })}
            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
              analysisResult 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100 active:scale-95' 
                : 'bg-gray-100 text-gray-300'
            }`}
          >
            {analysisResult ? <><Check size={20} /> 完成记录</> : '待分析'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraModal;

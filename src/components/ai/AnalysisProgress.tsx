import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, FileSearch, Code2, Sparkles, GitBranch } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface AnalysisStep {
  id: string;
  label: string;
  icon: React.ElementType;
  status: 'pending' | 'loading' | 'completed';
}

interface AnalysisProgressProps {
  isAnalyzing: boolean;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  isAnalyzing,
}) => {
  const [steps, setSteps] = useState<AnalysisStep[]>([
    { id: 'structure', label: 'Analisando estrutura', icon: FileSearch, status: 'pending' },
    { id: 'tech', label: 'Identificando tecnologia', icon: Code2, status: 'pending' },
    { id: 'files', label: 'Localizando arquivos relevantes', icon: GitBranch, status: 'pending' },
    { id: 'context', label: 'Analisando contexto', icon: Sparkles, status: 'pending' },
    { id: 'changes', label: 'Preparando alterações', icon: CheckCircle2, status: 'pending' },
  ]);

  useEffect(() => {
    if (!isAnalyzing) {
      setSteps(steps.map(step => ({ ...step, status: 'pending' })));
      return;
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < steps.length) {
        setSteps(prev => 
          prev.map((step, index) => ({
            ...step,
            status: index < currentIndex ? 'completed' : index === currentIndex ? 'loading' : 'pending',
          }))
        );
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  if (!isAnalyzing) return null;

  return (
    <Card className="p-4 mb-4 bg-lore-purple/5 border-lore-purple/20">
      <div className="space-y-3">
        {steps.map((step) => {
          const StepIcon = step.icon;
          return (
            <div key={step.id} className="flex items-center space-x-3">
              {step.status === 'completed' ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : step.status === 'loading' ? (
                <Loader2 className="w-5 h-5 text-lore-purple animate-spin" />
              ) : (
                <StepIcon className="w-5 h-5 text-gray-500" />
              )}
              <span
                className={`text-sm ${
                  step.status === 'completed'
                    ? 'text-green-400'
                    : step.status === 'loading'
                    ? 'text-lore-purple'
                    : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

import { AIContext, AIResponse, FileModification } from '@/types/ai';
import { ProjectInfo } from '@/types/project';

interface AIProvider {
  generateModification(
    prompt: string,
    context: AIContext
  ): Promise<AIResponse>;
}

class AIEngine {
  private provider: AIProvider | null = null;

  setProvider(provider: AIProvider) {
    this.provider = provider;
  }

  async generateModification(
    prompt: string,
    context: AIContext
  ): Promise<AIResponse> {
    if (!this.provider) {
      throw new Error('Nenhum provedor de IA configurado');
    }

    return this.provider.generateModification(prompt, context);
  }

  async analyzePrompt(prompt: string, projectInfo: ProjectInfo): Promise<{
    intent: 'create' | 'modify' | 'delete' | 'analyze';
    targetFiles: string[];
    confidence: number;
  }> {
    // Análise básica do prompt para determinar intenção
    const intent = this.detectIntent(prompt);
    const targetFiles = await this.findRelevantFiles(prompt, projectInfo);
    
    return {
      intent,
      targetFiles,
      confidence: 0.8,
    };
  }

  private detectIntent(prompt: string): 'create' | 'modify' | 'delete' | 'analyze' {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('criar') || lowerPrompt.includes('cria') || lowerPrompt.includes('adiciona')) {
      return 'create';
    }
    if (lowerPrompt.includes('deletar') || lowerPrompt.includes('remover') || lowerPrompt.includes('excluir')) {
      return 'delete';
    }
    if (lowerPrompt.includes('analisar') || lowerPrompt.includes('verificar') || lowerPrompt.includes('checar')) {
      return 'analyze';
    }
    return 'modify';
  }

  private async findRelevantFiles(prompt: string, projectInfo: ProjectInfo): Promise<string[]> {
    // Implementação básica - será melhorada com IA real
    const relevantFiles: string[] = [];
    const keywords = this.extractKeywords(prompt);
    
    projectInfo.structure.files.forEach(file => {
      const content = file.path.toLowerCase();
      if (keywords.some(keyword => content.includes(keyword))) {
        relevantFiles.push(file.path);
      }
    });

    return relevantFiles;
  }

  private extractKeywords(prompt: string): string[] {
    const stopWords = ['o', 'a', 'os', 'as', 'um', 'uma', 'de', 'do', 'da', 'em', 'no', 'na'];
    return prompt
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.includes(word));
  }
}

export const aiEngine = new AIEngine();

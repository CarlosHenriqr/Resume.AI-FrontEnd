import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Download, 
  LogOut, 
  User,
  Clock,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { summarizeText } from '../services/api';
import { useAuth } from '../hooks/useAuth.jsx';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import '../App.css';

export default function Dashboard() {
  const { logout } = useAuth();
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      toast.error('Por favor, insira um texto para resumir');
      return;
    }

    if (inputText.length < 50) {
      toast.error('O texto deve ter pelo menos 50 caracteres');
      return;
    }

    setLoading(true);
    setSummary('');

    try {
      const response = await summarizeText(inputText);
      const newSummary = response.resumo;
      setSummary(newSummary);
      
      // Adicionar ao histórico
      const historyItem = {
        id: Date.now(),
        originalText: inputText.substring(0, 100) + '...',
        summary: newSummary,
        timestamp: new Date().toLocaleString('pt-BR'),
      };
      setHistory(prev => [historyItem, ...prev.slice(0, 4)]); // Manter apenas os 5 mais recentes
      
      toast.success('Resumo gerado com sucesso!');
    } catch (error) {
      toast.error(error.message || 'Erro ao gerar resumo');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Texto copiado para a área de transferência!');
    } catch (error) {
      toast.error('Erro ao copiar texto');
    }
  };

  const handleDownload = (text, filename = 'resumo.txt') => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Arquivo baixado com sucesso!');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Sparkles className="w-8 h-8 text-purple-600 mr-2" />
              <h1 className="text-2xl font-bold gradient-text">Resume.ia</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600">
                <User className="w-4 h-4 mr-2" />
                <span className="text-sm">Usuário</span>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Área principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card de entrada de texto */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    Texto para Resumir
                  </CardTitle>
                  <CardDescription>
                    Cole ou digite o texto que você deseja resumir
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Cole seu texto aqui... (mínimo 50 caracteres)"
                    className="min-h-[200px] resize-none"
                    maxLength={2000} 
                  />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {inputText.length}/2000 caracteres
                    </span>
                    
                    <Button
                      onClick={handleSummarize}
                      disabled={loading || !inputText.trim()}
                      className="gradient-bg hover:opacity-90 transition-opacity"
                    >
                      {loading ? (
                        <>
                          <LoadingSpinner size="small" className="mr-2" />
                          Resumindo...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Gerar Resumo
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card de resultado */}
            {(summary || loading) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-green-600" />
                      Resumo Gerado
                    </CardTitle>
                    <CardDescription>
                      Resultado do processamento de IA
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <LoadingSpinner size="large" className="text-purple-600 mb-4" />
                          <p className="text-gray-600">Processando seu texto...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4 min-h-[100px]">
                          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {summary}
                          </p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleCopy(summary)}
                            variant="outline"
                            size="sm"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copiar
                          </Button>
                          <Button
                            onClick={() => handleDownload(summary)}
                            variant="outline"
                            size="sm"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Baixar
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Estatísticas */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Estatísticas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Resumos gerados</span>
                    <span className="font-semibold text-purple-600">{history.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Caracteres processados</span>
                    <span className="font-semibold text-purple-600">
                      {history.reduce((acc, item) => acc + item.originalText.length, 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Histórico */}
            {history.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Clock className="w-5 h-5 mr-2" />
                      Histórico Recente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="border-l-4 border-purple-200 pl-3 py-2"
                      >
                        <p className="text-sm text-gray-600 mb-1">
                          {item.originalText}
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.timestamp}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Dicas */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="shadow-lg bg-gradient-to-br from-purple-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-800">
                    💡 Dicas para melhores resumos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-purple-700">
                  <p>• Use textos com pelo menos 50 caracteres</p>
                  <p>• Textos mais longos geram resumos mais precisos</p>
                  <p>• Evite textos com muitas abreviações</p>
                  <p>• Prefira textos em português</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}


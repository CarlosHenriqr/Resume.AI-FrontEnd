const API_BASE_URL = "http://localhost:8080/api";

// Funções para gerenciar o token JWT
export const getToken = () => localStorage.getItem("jwt_token");
export const setToken = (token) => localStorage.setItem("jwt_token", token);
export const clearToken = () => localStorage.removeItem("jwt_token");

// Função genérica para fazer requisições
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Adicionar token de autorização se necessário
  if (options.requireAuth) {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, config);
    
    // Se não autorizado, limpar token e redirecionar
    if (response.status === 401 || response.status === 403) {
      clearToken();
      throw new Error("Sessão expirada. Faça login novamente.");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Erro ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error("Erro de conexão. Verifique se o servidor está rodando.");
    }
    throw error;
  }
}

// Funções de autenticação
export const signup = async (userData) => {
  return apiRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const login = async (credentials) => {
  const response = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  // Extrair token da resposta
  const token = response.token || response.jwt || response.accessToken;
  if (token) {
    setToken(token);
  }

  return response;
};

// Função para resumir texto
export const summarizeText = async (text) => {
  return apiRequest("/resumo", {
    method: "POST",
    body: JSON.stringify({ texto: text }),
    requireAuth: true,
  });
};

// Função para verificar se o usuário está logado
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

// Função para logout
export const logout = () => {
  clearToken();
};


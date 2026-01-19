import os
import json
import requests
from typing import List, Dict, Any, Tuple

class PrimeIAPromptsLibrary:
    """
    Nodo de ComfyUI para acceder a la librería de prompts de PrimeIA.
    Muestra una interfaz visual con cards de prompts para seleccionar.
    
    IMPORTANTE: Solo disponible para miembros de Skool (skool_standard, skool_premium).
    """
    
    # URL de la Edge Function de PrimeIA
    API_URL = "https://juriolrfbcebhpkfaqws.supabase.co/functions/v1/prompts-api"
    
    def __init__(self):
        self.prompts_cache = []
        self.last_fetch_params = None
        self.cached_api_key = None
    
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "api_key": ("STRING", {
                    "default": "",
                    "multiline": False,
                    "placeholder": "Tu API Key de PrimeIA (primeia_xxxxx)"
                }),
            },
            "optional": {
                "prompt_index": ("INT", {
                    "default": 0,
                    "min": 0,
                    "max": 999,
                    "step": 1,
                    "display": "number"
                }),
                "safety_filter": (["all", "sfw", "nsfw", "suggestive"], {
                    "default": "all"
                }),
                "search_query": ("STRING", {
                    "default": "",
                    "multiline": False,
                    "placeholder": "Buscar por texto o tags"
                }),
                "sort_by": (["score", "created_at"], {
                    "default": "score"
                }),
                "limit": ("INT", {
                    "default": 200,
                    "min": 50,
                    "max": 500,
                    "step": 50
                }),
                "refresh_cache": ("BOOLEAN", {
                    "default": False
                }),
            }
        }
    
    RETURN_TYPES = ("STRING", "STRING", "STRING", "STRING", "INT", "STRING")
    RETURN_NAMES = ("positive_prompt", "negative_prompt", "tags", "safety_level", "score", "prompt_id")
    FUNCTION = "get_prompt"
    CATEGORY = "PrimeIA/Prompts"
    
    def fetch_prompts(self, api_key: str, safety_filter: str = "all", 
                      search_query: str = "", sort_by: str = "score", 
                      limit: int = 200, refresh: bool = False) -> Tuple[List[Dict], str]:
        """
        Obtiene los prompts de la librería de PrimeIA usando la Edge Function.
        """
        current_params = (api_key, safety_filter, search_query, sort_by, limit)
        if not refresh and self.last_fetch_params == current_params and self.prompts_cache:
            return (self.prompts_cache, "")
        
        try:
            if not api_key.strip():
                return ([], "ERROR: API Key de PrimeIA es requerida")
            
            if not api_key.startswith('primeia_'):
                return ([], "ERROR: API Key inválida. Debe comenzar con 'primeia_'")
            
            params = {
                "safety_filter": safety_filter,
                "search": search_query,
                "sort_by": sort_by,
                "limit": str(limit),
                "offset": "0"
            }
            
            headers = {
                "Content-Type": "application/json",
                "x-api-key": api_key
            }
            
            response = requests.get(
                self.API_URL,
                params=params,
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 401:
                error_data = response.json()
                return ([], f"ERROR: {error_data.get('message', 'API Key inválida o no encontrada')}")
            
            if response.status_code == 403:
                error_data = response.json()
                return ([], f"ERROR: {error_data.get('message', 'Acceso denegado. Solo para miembros de Skool.')}")
            
            if response.status_code != 200:
                return ([], f"ERROR: Error del servidor ({response.status_code})")
            
            data = response.json()
            
            if not data.get('success'):
                return ([], f"ERROR: {data.get('error', 'Error desconocido')}")
            
            prompts = data.get('prompts', [])
            
            self.prompts_cache = prompts
            self.last_fetch_params = current_params
            self.cached_api_key = api_key
            
            return (prompts, "")
            
        except requests.exceptions.Timeout:
            return ([], "ERROR: Tiempo de espera agotado. Intenta de nuevo.")
        except requests.exceptions.RequestException as e:
            return ([], f"ERROR: Error de conexión: {str(e)}")
        except Exception as e:
            print(f"[PrimeIA] Error fetching prompts: {e}")
            return ([], f"ERROR: {str(e)}")
    
    def get_prompt(self, api_key: str, prompt_index: int = 0,
                   safety_filter: str = "all", search_query: str = "",
                   sort_by: str = "score", limit: int = 200,
                   refresh_cache: bool = False):
        """
        Obtiene el prompt seleccionado y retorna sus componentes.
        """
        prompts, error = self.fetch_prompts(
            api_key, safety_filter, search_query, sort_by, limit, refresh_cache
        )
        
        if error:
            print(f"[PrimeIA] {error}")
            return ("", "", "", "error", 0, "")
        
        if not prompts:
            return ("", "", "", "unknown", 0, "")
        
        prompt_index = max(0, min(prompt_index, len(prompts) - 1))
        selected_prompt = prompts[prompt_index]
        
        positive = selected_prompt.get('prompt_positive', '')
        negative = selected_prompt.get('prompt_negative', '') or ''
        tags = ', '.join(selected_prompt.get('tags', []) or [])
        safety = selected_prompt.get('safety_level', 'unknown') or 'unknown'
        score = selected_prompt.get('score', 0) or 0
        prompt_id = selected_prompt.get('id', '')
        
        return (positive, negative, tags, safety, score, prompt_id)


class PrimeIAPromptsList:
    """
    Nodo para ver todos los prompts disponibles en una interfaz visual de cards.
    Solo disponible para miembros de Skool.
    Devuelve SOLO el prompt seleccionado.
    """
    
    API_URL = "https://juriolrfbcebhpkfaqws.supabase.co/functions/v1/prompts-api"
    
    def __init__(self):
        self.prompts_cache = []
    
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "api_key": ("STRING", {
                    "default": "",
                    "multiline": False,
                    "placeholder": "Tu API Key de PrimeIA (primeia_xxxxx)"
                }),
                "selected_index": ("INT", {
                    "default": 0,
                    "min": 0,
                    "max": 999,
                    "step": 1,
                    "display": "number"
                }),
            },
            "optional": {
                "safety_filter": (["all", "sfw", "nsfw", "suggestive"], {
                    "default": "all"
                }),
                "limit": ("INT", {
                    "default": 500,
                    "min": 100,
                    "max": 7500,
                    "step": 100
                }),
            }
        }
    
    RETURN_TYPES = ("STRING", "STRING", "STRING", "STRING", "INT")
    RETURN_NAMES = ("positive_prompt", "negative_prompt", "tags", "safety_level", "score")
    FUNCTION = "get_selected_prompt"
    CATEGORY = "PrimeIA/Prompts"
    
    def get_selected_prompt(self, api_key: str, selected_index: int = 0, 
                            safety_filter: str = "all", limit: int = 100):
        """
        Obtiene los prompts y devuelve SOLO el prompt seleccionado.
        """
        try:
            if not api_key.strip():
                print("[PrimeIA] Error: API Key de PrimeIA es requerida")
                return ("", "", "", "error", 0)
            
            if not api_key.startswith('primeia_'):
                print("[PrimeIA] Error: API Key inválida. Debe comenzar con 'primeia_'")
                return ("", "", "", "error", 0)
            
            headers = {
                "Content-Type": "application/json",
                "x-api-key": api_key
            }
            
            params = {
                "safety_filter": safety_filter,
                "limit": str(limit),
                "sort_by": "score"
            }
            
            response = requests.get(
                self.API_URL,
                params=params,
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 401:
                error_data = response.json()
                print(f"[PrimeIA] Error 401: {error_data.get('message', 'API Key inválida')}")
                return ("", "", "", "error", 0)
            
            if response.status_code == 403:
                error_data = response.json()
                print(f"[PrimeIA] Error 403: {error_data.get('message', 'Solo para miembros de Skool')}")
                return ("", "", "", "error", 0)
            
            if response.status_code != 200:
                print(f"[PrimeIA] Error del servidor ({response.status_code})")
                return ("", "", "", "error", 0)
            
            data = response.json()
            
            if not data.get('success'):
                print(f"[PrimeIA] Error: {data.get('error', 'Error desconocido')}")
                return ("", "", "", "error", 0)
            
            prompts = data.get('prompts', [])
            self.prompts_cache = prompts
            
            if not prompts:
                print("[PrimeIA] No hay prompts disponibles")
                return ("", "", "", "unknown", 0)
            
            # Asegurarse de que el índice esté dentro del rango
            selected_index = max(0, min(selected_index, len(prompts) - 1))
            selected_prompt = prompts[selected_index]
            
            positive = selected_prompt.get('prompt_positive', '')
            negative = selected_prompt.get('prompt_negative', '') or ''
            tags = ', '.join(selected_prompt.get('tags', []) or [])
            safety = selected_prompt.get('safety_level', 'unknown') or 'unknown'
            score = selected_prompt.get('score', 0) or 0
            
            print(f"[PrimeIA] ✅ Prompt #{selected_index + 1} seleccionado ({safety})")
            
            return (positive, negative, tags, safety, score)
            
        except requests.exceptions.Timeout:
            print("[PrimeIA] Error: Tiempo de espera agotado")
            return ("", "", "", "error", 0)
        except Exception as e:
            print(f"[PrimeIA] Error: {str(e)}")
            return ("", "", "", "error", 0)


class PrimeIAPromptSelector:
    """
    Nodo selector para elegir un prompt de la lista cargada.
    Recibe el JSON de prompts y permite seleccionar uno específico.
    """
    
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "prompts_json": ("STRING", {
                    "forceInput": True,
                    "multiline": True
                }),
                "selected_index": ("INT", {
                    "default": 0,
                    "min": 0,
                    "max": 999,
                    "step": 1
                }),
            }
        }
    
    RETURN_TYPES = ("STRING", "STRING", "STRING", "STRING", "INT")
    RETURN_NAMES = ("positive_prompt", "negative_prompt", "tags", "safety_level", "score")
    FUNCTION = "select_prompt"
    CATEGORY = "PrimeIA/Prompts"
    
    def select_prompt(self, prompts_json: str, selected_index: int):
        """
        Selecciona un prompt del JSON y retorna sus datos.
        """
        try:
            prompts = json.loads(prompts_json) if prompts_json else []
            
            if not prompts:
                return ("", "", "", "unknown", 0)
            
            selected_index = max(0, min(selected_index, len(prompts) - 1))
            prompt = prompts[selected_index]
            
            positive = prompt.get('prompt_positive', '')
            negative = prompt.get('prompt_negative', '') or ''
            tags = ', '.join(prompt.get('tags', []) or [])
            safety = prompt.get('safety_level', 'unknown') or 'unknown'
            score = prompt.get('score', 0) or 0
            
            return (positive, negative, tags, safety, score)
            
        except json.JSONDecodeError:
            return ("", "", "", "error", 0)
        except Exception as e:
            print(f"[PrimeIA] Error selecting prompt: {e}")
            return ("", "", "", "error", 0)


class PrimeIARandomPrompt:
    """
    Nodo para seleccionar un prompt aleatorio de la librería.
    """
    
    API_URL = "https://juriolrfbcebhpkfaqws.supabase.co/functions/v1/prompts-api"
    
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "api_key": ("STRING", {
                    "default": "",
                    "multiline": False
                }),
            },
            "optional": {
                "safety_filter": (["all", "sfw", "nsfw", "suggestive"], {
                    "default": "all"
                }),
                "seed": ("INT", {
                    "default": 0,
                    "min": 0,
                    "max": 0xffffffffffffffff
                }),
            }
        }
    
    RETURN_TYPES = ("STRING", "STRING", "STRING")
    RETURN_NAMES = ("positive_prompt", "negative_prompt", "prompt_info")
    FUNCTION = "get_random_prompt"
    CATEGORY = "PrimeIA/Prompts"
    
    def get_random_prompt(self, api_key: str, safety_filter: str = "all", seed: int = 0):
        """
        Obtiene un prompt aleatorio de la librería.
        """
        import random
        
        try:
            if not api_key.strip() or not api_key.startswith('primeia_'):
                return ("", "", "Error: API Key inválida")
            
            headers = {
                "Content-Type": "application/json",
                "x-api-key": api_key
            }
            
            params = {
                "safety_filter": safety_filter,
                "limit": "100",
                "sort_by": "score"
            }
            
            response = requests.get(self.API_URL, params=params, headers=headers, timeout=30)
            
            if response.status_code != 200:
                return ("", "", f"Error: {response.status_code}")
            
            data = response.json()
            prompts = data.get('prompts', [])
            
            if not prompts:
                return ("", "", "No hay prompts disponibles")
            
            # Seleccionar aleatorio basado en seed
            random.seed(seed)
            prompt = random.choice(prompts)
            
            positive = prompt.get('prompt_positive', '')
            negative = prompt.get('prompt_negative', '') or ''
            
            info = f"ID: {prompt.get('id', 'N/A')[:8]}... | Safety: {prompt.get('safety_level', 'N/A')} | Score: {prompt.get('score', 0)}"
            
            return (positive, negative, info)
            
        except Exception as e:
            return ("", "", f"Error: {str(e)}")


# Registro de nodos para ComfyUI
NODE_CLASS_MAPPINGS = {
    "PrimeIAPromptsLibrary": PrimeIAPromptsLibrary,
    "PrimeIAPromptsList": PrimeIAPromptsList,
    "PrimeIAPromptSelector": PrimeIAPromptSelector,
    "PrimeIARandomPrompt": PrimeIARandomPrompt,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "PrimeIAPromptsLibrary": "🎨 PrimeIA Prompts Library (Skool)",
    "PrimeIAPromptsList": "📚 PrimeIA List Prompts (Visual)",
    "PrimeIAPromptSelector": "🎯 PrimeIA Prompt Selector",
    "PrimeIARandomPrompt": "🎲 PrimeIA Random Prompt",
}

# Directorio web para los archivos JavaScript
WEB_DIRECTORY = "./js"

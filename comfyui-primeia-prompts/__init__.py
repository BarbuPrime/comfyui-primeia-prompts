"""
PrimeIA Prompts Library para ComfyUI

Proporciona una interfaz visual completa con cards para explorar y seleccionar
prompts de la librería de PrimeIA directamente desde ComfyUI.

⚠️ IMPORTANTE: Solo disponible para miembros de Skool (skool_standard, skool_premium).

Nodos incluidos:
- 🎨 PrimeIA Prompts Library: Interfaz visual completa con cards, filtros y búsqueda
- 📚 PrimeIA List Prompts: Lista todos los prompts con visualización en cards
- 🎯 PrimeIA Prompt Selector: Selecciona un prompt del JSON de la lista
- 🎲 PrimeIA Random Prompt: Obtiene un prompt aleatorio

Para obtener tu API Key:
1. Inicia sesión en https://primeia.app
2. Ve a tu perfil de usuario
3. En la sección "API Key Personal", genera tu API Key
4. Tu API Key tendrá el formato: primeia_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
"""

from .primeia_prompts_node import NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS, WEB_DIRECTORY

__all__ = ['NODE_CLASS_MAPPINGS', 'NODE_DISPLAY_NAME_MAPPINGS', 'WEB_DIRECTORY']

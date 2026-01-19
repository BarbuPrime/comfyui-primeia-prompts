import { app } from "../../scripts/app.js";
import { api } from "../../scripts/api.js";

console.log("[PrimeIA] 🎨 Cargando extensión PrimeIA Prompts Library...");

// Estilos CSS para la interfaz
const PRIMEIA_STYLES = `
    .primeia-prompts-container {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 12px;
        padding: 16px;
        margin: 8px 0;
        max-height: 500px;
        overflow-y: auto;
        border: 1px solid #3a3a5a;
    }
    
    .primeia-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #3a3a5a;
    }
    
    .primeia-title {
        font-size: 16px;
        font-weight: 700;
        color: #fff;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .primeia-badge {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
    }
    
    .primeia-load-btn {
        width: 100%;
        padding: 12px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        margin-bottom: 16px;
        transition: all 0.2s ease;
    }
    
    .primeia-load-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    
    .primeia-load-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }
    
    .primeia-filters {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
        flex-wrap: wrap;
    }
    
    .primeia-filter-btn {
        padding: 6px 14px;
        border-radius: 20px;
        border: 1px solid #4a4a6a;
        background: #2a2a4a;
        color: #aaa;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s ease;
    }
    
    .primeia-filter-btn:hover {
        background: #3a3a5a;
        color: #fff;
    }
    
    .primeia-filter-btn.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-color: #667eea;
        color: #fff;
    }
    
    .primeia-filter-btn.sfw.active { background: #22c55e; border-color: #22c55e; }
    .primeia-filter-btn.nsfw.active { background: #ef4444; border-color: #ef4444; }
    .primeia-filter-btn.suggestive.active { background: #eab308; border-color: #eab308; }
    
    .primeia-search {
        width: 100%;
        padding: 10px 14px;
        border-radius: 8px;
        border: 1px solid #4a4a6a;
        background: #2a2a4a;
        color: #fff;
        font-size: 14px;
        margin-bottom: 12px;
        box-sizing: border-box;
    }
    
    .primeia-search::placeholder { color: #666; }
    .primeia-search:focus { outline: none; border-color: #667eea; }
    
    .primeia-stats {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        color: #888;
        font-size: 12px;
    }
    
    .primeia-cards-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        max-height: 250px;
        overflow-y: auto;
        padding-right: 4px;
    }
    
    .primeia-card {
        background: #2a2a4a;
        border-radius: 8px;
        padding: 10px;
        border: 2px solid transparent;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .primeia-card:hover { border-color: #667eea; }
    .primeia-card.selected { border-color: #22c55e; background: #1a3a2a; }
    
    .primeia-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 6px;
    }
    
    .primeia-card-badges {
        display: flex;
        gap: 6px;
        align-items: center;
    }
    
    .primeia-safety-badge {
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .primeia-safety-badge.sfw { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
    .primeia-safety-badge.nsfw { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
    .primeia-safety-badge.suggestive { background: rgba(234, 179, 8, 0.2); color: #eab308; }
    
    .primeia-score {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #fbbf24;
        font-size: 11px;
        font-weight: 600;
    }
    
    .primeia-card-content {
        color: #ccc;
        font-size: 11px;
        line-height: 1.4;
        max-height: 40px;
        overflow: hidden;
    }
    
    .primeia-card-index {
        background: #3a3a5a;
        color: #aaa;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 600;
    }
    
    .primeia-pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid #3a3a5a;
    }
    
    .primeia-page-btn {
        padding: 6px 12px;
        border-radius: 6px;
        border: 1px solid #4a4a6a;
        background: #2a2a4a;
        color: #aaa;
        cursor: pointer;
        font-size: 12px;
    }
    
    .primeia-page-btn:hover:not(:disabled) { background: #3a3a5a; color: #fff; }
    .primeia-page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .primeia-loading {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 30px;
        color: #888;
        gap: 10px;
    }
    
    .primeia-spinner {
        width: 24px;
        height: 24px;
        border: 3px solid #3a3a5a;
        border-top-color: #667eea;
        border-radius: 50%;
        animation: primeia-spin 1s linear infinite;
    }
    
    @keyframes primeia-spin {
        to { transform: rotate(360deg); }
    }
    
    .primeia-error {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #ef4444;
        padding: 12px;
        border-radius: 8px;
        text-align: center;
        font-size: 12px;
    }
    
    .primeia-selected-display {
        background: #1a3a2a;
        border: 1px solid #22c55e;
        border-radius: 8px;
        padding: 10px;
        margin-top: 12px;
    }
    
    .primeia-selected-title {
        color: #22c55e;
        font-size: 11px;
        font-weight: 600;
        margin-bottom: 6px;
    }
    
    .primeia-selected-text {
        background: #0a2a1a;
        padding: 8px;
        border-radius: 6px;
        font-size: 10px;
        color: #aaa;
        max-height: 60px;
        overflow-y: auto;
        line-height: 1.4;
        font-family: monospace;
    }
    
    .primeia-log {
        background: #1a1a2e;
        border: 1px solid #3a3a5a;
        border-radius: 6px;
        padding: 8px;
        margin-top: 8px;
        font-size: 10px;
        color: #888;
        max-height: 60px;
        overflow-y: auto;
        font-family: monospace;
    }
`;

// Inyectar estilos
if (!document.getElementById('primeia-prompts-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'primeia-prompts-styles';
    styleSheet.textContent = PRIMEIA_STYLES;
    document.head.appendChild(styleSheet);
    console.log("[PrimeIA] ✅ Estilos CSS inyectados");
}

// Almacén global de prompts por nodo
const nodePromptsStore = new Map();

// Función para hacer fetch de prompts
async function fetchPromptsFromAPI(apiKey, safetyFilter = 'all', limit = 100) {
    console.log("[PrimeIA] 🔄 Iniciando fetch de prompts...");
    console.log("[PrimeIA] API Key:", apiKey ? apiKey.substring(0, 15) + "..." : "NO PROPORCIONADA");
    console.log("[PrimeIA] Safety Filter:", safetyFilter);
    console.log("[PrimeIA] Limit:", limit);
    
    if (!apiKey || !apiKey.startsWith('primeia_')) {
        console.error("[PrimeIA] ❌ API Key inválida o no proporcionada");
        throw new Error("API Key inválida. Debe comenzar con 'primeia_'");
    }
    
    const url = new URL("https://juriolrfbcebhpkfaqws.supabase.co/functions/v1/prompts-api");
    url.searchParams.set('safety_filter', safetyFilter);
    url.searchParams.set('limit', limit.toString());
    url.searchParams.set('sort_by', 'score');
    
    console.log("[PrimeIA] 🌐 URL:", url.toString());
    
    try {
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            }
        });
        
        console.log("[PrimeIA] 📥 Response status:", response.status);
        
        const data = await response.json();
        console.log("[PrimeIA] 📦 Response data:", data);
        
        if (response.status === 401) {
            throw new Error(data.message || "API Key inválida o no encontrada");
        }
        
        if (response.status === 403) {
            throw new Error(data.message || "Acceso denegado. Solo para miembros de Skool.");
        }
        
        if (!response.ok) {
            throw new Error(data.error || `Error del servidor (${response.status})`);
        }
        
        if (!data.success) {
            throw new Error(data.error || "Error desconocido");
        }
        
        console.log("[PrimeIA] ✅ Prompts cargados:", data.prompts?.length || 0);
        return data.prompts || [];
        
    } catch (error) {
        console.error("[PrimeIA] ❌ Error en fetch:", error);
        throw error;
    }
}

// Registrar extensión
app.registerExtension({
    name: "PrimeIA.PromptsLibrary",
    
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name === "PrimeIAPromptsLibrary" || nodeData.name === "PrimeIAPromptsList") {
            console.log("[PrimeIA] 📝 Registrando nodo:", nodeData.name);
            
            const origOnNodeCreated = nodeType.prototype.onNodeCreated;
            
            nodeType.prototype.onNodeCreated = function() {
                const result = origOnNodeCreated?.apply(this, arguments);
                const node = this;
                
                console.log("[PrimeIA] 🆕 Nodo creado:", node.id);
                
                // Inicializar estado
                node.primeiaState = {
                    prompts: [],
                    filteredPrompts: [],
                    selectedIndex: -1,
                    selectedPrompt: null,
                    currentPage: 0,
                    itemsPerPage: 6,
                    safetyFilter: 'all',
                    searchQuery: '',
                    isLoading: false,
                    error: null,
                    logs: []
                };
                
                // Crear contenedor DOM
                const container = document.createElement('div');
                container.className = 'primeia-prompts-container';
                container.innerHTML = createUIHTML();
                
                // Guardar referencia
                node.primeiaContainer = container;
                
                // Bind eventos
                bindEvents(node, container);
                
                // Añadir widget DOM - NO guardar valores para evitar corromper el workflow
                const widget = node.addDOMWidget("primeia_ui", "customtext", container, {
                    getValue() { return ""; },
                    setValue(v) { },
                    // No serializar este widget
                    serialize: false
                });
                
                // Ajustar tamaño
                node.setSize([420, 700]);
                
                return result;
            };
        }
    }
});

function createUIHTML() {
    return `
        <div class="primeia-header">
            <div class="primeia-title">🎨 PrimeIA Prompts Library</div>
            <span class="primeia-badge">Skool Only</span>
        </div>
        
        <button class="primeia-load-btn">🔄 Cargar Prompts</button>
        
        <input type="text" class="primeia-search" placeholder="🔍 Buscar prompts por texto o tags...">
        
        <div class="primeia-filters">
            <button class="primeia-filter-btn active" data-filter="all">Todos</button>
            <button class="primeia-filter-btn sfw" data-filter="sfw">SFW</button>
            <button class="primeia-filter-btn nsfw" data-filter="nsfw">NSFW</button>
            <button class="primeia-filter-btn suggestive" data-filter="suggestive">Suggestive</button>
        </div>
        
        <div class="primeia-stats">
            <span class="primeia-count">0 prompts encontrados</span>
            <span class="primeia-page-indicator">Página 1 de 1</span>
        </div>
        
        <div class="primeia-cards-grid"></div>
        
        <div class="primeia-pagination">
            <button class="primeia-page-btn prev" disabled>← Anterior</button>
            <span class="primeia-page-info">1 / 1</span>
            <button class="primeia-page-btn next" disabled>Siguiente →</button>
        </div>
        
        <div class="primeia-selected-display" style="display: none;">
            <div class="primeia-selected-title">✅ Prompt Seleccionado (#<span class="selected-index">0</span>)</div>
            <div class="primeia-selected-text"></div>
        </div>
        
        <div class="primeia-log"></div>
    `;
}

function bindEvents(node, container) {
    const state = node.primeiaState;
    const logEl = container.querySelector('.primeia-log');
    
    function addLog(msg) {
        const time = new Date().toLocaleTimeString();
        state.logs.push(`[${time}] ${msg}`);
        if (state.logs.length > 10) state.logs.shift();
        logEl.innerHTML = state.logs.join('<br>');
        logEl.scrollTop = logEl.scrollHeight;
        console.log("[PrimeIA]", msg);
    }
    
    // Botón cargar
    const loadBtn = container.querySelector('.primeia-load-btn');
    loadBtn.addEventListener('click', async () => {
        addLog("🔄 Iniciando carga de prompts...");
        
        // Obtener valores de los widgets por nombre
        let apiKey = '';
        let safetyFilter = 'all';
        let limit = 100;
        
        if (node.widgets) {
            for (const widget of node.widgets) {
                if (widget.name === 'api_key' && typeof widget.value === 'string') {
                    apiKey = widget.value;
                } else if (widget.name === 'safety_filter' && typeof widget.value === 'string') {
                    // Validar que sea un valor permitido
                    if (['all', 'sfw', 'nsfw', 'suggestive'].includes(widget.value)) {
                        safetyFilter = widget.value;
                    }
                } else if (widget.name === 'limit') {
                    // Asegurar que limit sea un número válido
                    const numLimit = parseInt(widget.value, 10);
                    if (!isNaN(numLimit) && numLimit > 0) {
                        limit = numLimit;
                    }
                }
            }
        }
        
        addLog(`API Key: ${apiKey ? apiKey.substring(0, 15) + '...' : 'NO ENCONTRADA'}`);
        addLog(`Safety: ${safetyFilter}, Limit: ${limit}`);
        
        if (!apiKey) {
            addLog("❌ Error: Ingresa tu API Key primero");
            showError(container, "Ingresa tu API Key en el campo 'api_key'");
            return;
        }
        
        loadBtn.disabled = true;
        loadBtn.textContent = "⏳ Cargando...";
        showLoading(container);
        
        try {
            const prompts = await fetchPromptsFromAPI(apiKey, safetyFilter, limit);
            state.prompts = prompts;
            state.filteredPrompts = prompts;
            state.currentPage = 0;
            state.selectedIndex = -1;
            
            addLog(`✅ ${prompts.length} prompts cargados`);
            renderCards(node, container);
            
        } catch (error) {
            addLog(`❌ Error: ${error.message}`);
            showError(container, error.message);
        } finally {
            loadBtn.disabled = false;
            loadBtn.textContent = "🔄 Cargar Prompts";
        }
    });
    
    // Filtros
    container.querySelectorAll('.primeia-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.primeia-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.safetyFilter = btn.dataset.filter;
            state.currentPage = 0;
            filterAndRender(node, container);
            addLog(`Filtro: ${state.safetyFilter}`);
        });
    });
    
    // Búsqueda
    const searchInput = container.querySelector('.primeia-search');
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            state.searchQuery = searchInput.value.toLowerCase();
            state.currentPage = 0;
            filterAndRender(node, container);
        }, 300);
    });
    
    // Paginación
    container.querySelector('.primeia-page-btn.prev').addEventListener('click', () => {
        if (state.currentPage > 0) {
            state.currentPage--;
            renderCards(node, container);
        }
    });
    
    container.querySelector('.primeia-page-btn.next').addEventListener('click', () => {
        const totalPages = Math.ceil(state.filteredPrompts.length / state.itemsPerPage);
        if (state.currentPage < totalPages - 1) {
            state.currentPage++;
            renderCards(node, container);
        }
    });
}

function showLoading(container) {
    const grid = container.querySelector('.primeia-cards-grid');
    grid.innerHTML = `
        <div class="primeia-loading">
            <div class="primeia-spinner"></div>
            <span>Cargando prompts...</span>
        </div>
    `;
}

function showError(container, message) {
    const grid = container.querySelector('.primeia-cards-grid');
    grid.innerHTML = `<div class="primeia-error">❌ ${message}</div>`;
}

function filterAndRender(node, container) {
    const state = node.primeiaState;
    let filtered = [...state.prompts];
    
    if (state.safetyFilter !== 'all') {
        filtered = filtered.filter(p => 
            p.safety_level?.toLowerCase() === state.safetyFilter
        );
    }
    
    if (state.searchQuery) {
        filtered = filtered.filter(p => 
            p.prompt_positive?.toLowerCase().includes(state.searchQuery) ||
            p.tags?.some(t => t.toLowerCase().includes(state.searchQuery))
        );
    }
    
    state.filteredPrompts = filtered;
    renderCards(node, container);
}

function renderCards(node, container) {
    const state = node.primeiaState;
    const grid = container.querySelector('.primeia-cards-grid');
    const countEl = container.querySelector('.primeia-count');
    const pageInfo = container.querySelector('.primeia-page-info');
    const pageIndicator = container.querySelector('.primeia-page-indicator');
    const prevBtn = container.querySelector('.primeia-page-btn.prev');
    const nextBtn = container.querySelector('.primeia-page-btn.next');
    
    const totalPages = Math.max(1, Math.ceil(state.filteredPrompts.length / state.itemsPerPage));
    const start = state.currentPage * state.itemsPerPage;
    const end = start + state.itemsPerPage;
    const pagePrompts = state.filteredPrompts.slice(start, end);
    
    countEl.textContent = `${state.filteredPrompts.length} prompts encontrados`;
    pageInfo.textContent = `${state.currentPage + 1} / ${totalPages}`;
    pageIndicator.textContent = `Página ${state.currentPage + 1} de ${totalPages}`;
    
    prevBtn.disabled = state.currentPage === 0;
    nextBtn.disabled = state.currentPage >= totalPages - 1;
    
    if (state.filteredPrompts.length === 0) {
        grid.innerHTML = `<div class="primeia-error">No hay prompts. Haz clic en "Cargar Prompts"</div>`;
        return;
    }
    
    grid.innerHTML = pagePrompts.map((prompt, idx) => {
        const globalIdx = start + idx;
        const isSelected = globalIdx === state.selectedIndex;
        const safetyLevel = prompt.safety_level?.toLowerCase() || 'sfw';
        const score = prompt.score || 0;
        const preview = (prompt.prompt_positive || '').slice(0, 100);
        
        return `
            <div class="primeia-card ${isSelected ? 'selected' : ''}" data-index="${globalIdx}">
                <div class="primeia-card-header">
                    <div class="primeia-card-badges">
                        <span class="primeia-card-index">#${globalIdx + 1}</span>
                        <span class="primeia-safety-badge ${safetyLevel}">${safetyLevel}</span>
                    </div>
                    <div class="primeia-score">⭐ ${score}</div>
                </div>
                <div class="primeia-card-content">${preview}${prompt.prompt_positive?.length > 100 ? '...' : ''}</div>
            </div>
        `;
    }).join('');
    
    // Eventos de cards
    grid.querySelectorAll('.primeia-card').forEach(card => {
        card.addEventListener('click', () => {
            const idx = parseInt(card.dataset.index);
            selectPrompt(node, container, idx);
        });
    });
}

function selectPrompt(node, container, index) {
    const state = node.primeiaState;
    state.selectedIndex = index;
    state.selectedPrompt = state.filteredPrompts[index] || state.prompts[index];
    
    console.log("[PrimeIA] ✅ Prompt seleccionado:", index, state.selectedPrompt?.id);
    
    // Actualizar UI de cards
    container.querySelectorAll('.primeia-card').forEach(card => {
        const cardIdx = parseInt(card.dataset.index);
        card.classList.toggle('selected', cardIdx === index);
    });
    
    // Mostrar prompt seleccionado
    const displayPanel = container.querySelector('.primeia-selected-display');
    const selectedText = container.querySelector('.primeia-selected-text');
    const selectedIndexEl = container.querySelector('.selected-index');
    
    if (state.selectedPrompt) {
        displayPanel.style.display = 'block';
        selectedIndexEl.textContent = index + 1;
        selectedText.textContent = state.selectedPrompt.prompt_positive || '';
        
        // Actualizar widget selected_index o prompt_index (según el nodo)
        const indexWidget = node.widgets?.find(w => w.name === 'selected_index' || w.name === 'prompt_index');
        if (indexWidget) {
            indexWidget.value = index;
            console.log("[PrimeIA] ✅ Widget", indexWidget.name, "actualizado a:", index);
        }
    }
}

console.log("[PrimeIA] ✅ Extensión PrimeIA Prompts Library cargada correctamente");

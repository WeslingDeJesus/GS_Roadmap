export const PLATFORM_THEMES = {
    "ATLAS": {
        "background": "#7db2c3",
        "accent": "#af0f1b",
        "onBackground": "#FFFFFF",
        "onSurface": "#14404d",
        "buttonBg": "#af0f1b",
        "buttonText": "#FFFFFF",
        "logoBg": "#7db2c3",
        "logoText": "#FFFFFF"
    },
    "INSIDE": {
        "background": "#af0f1b",
        "accent": "#f27d39",
        "onBackground": "#FFFFFF",
        "onSurface": "#5a0810",
        "buttonBg": "#f27d39",
        "buttonText": "#FFFFFF",
        "logoBg": "#af0f1b",
        "logoText": "#FFFFFF"
    },
    "GSWEB": {
        "background": "#c1bfbe",
        "accent": "#f27d39",
        "onBackground": "#FFFFFF",
        "onSurface": "#ffffff",
        "buttonBg": "#f27d39",
        "buttonText": "#FFFFFF",
        "logoBg": "#af0f1b",
        "logoText": "#FFFFFF"
    },
    "GS": {
        "background": "#f27d39",
        "accent": "#af0f1b",
        "onBackground": "#FFFFFF",
        "onSurface": "#5a2414",
        "buttonBg": "#af0f1b",
        "buttonText": "#FFFFFF",
        "logoBg": "#f27d39",
        "logoText": "#FFFFFF"
    }
};

const DEFAULT_THEME = {
    "background": "#333333",
    "accent": "#555555",
    "onBackground": "#FFFFFF",
    "onSurface": "#111111",
    "buttonBg": "#555555",
    "buttonText": "#FFFFFF",
    "logoBg": "#333333",
    "logoText": "#FFFFFF"
};

export const getThemeForPlatform = (plataforma, apiColor, apiAccent) => {
    // Prioridad 1: Colores dinámicos del API
    if (apiColor && apiAccent) {
        return {
            "background": apiColor,
            "accent": apiAccent,
            "onBackground": "#FFFFFF",
            "onSurface": "#111111",
            "buttonBg": apiAccent,
            "buttonText": "#FFFFFF",
            "logoBg": apiColor,
            "logoText": "#FFFFFF"
        };
    }

    if (!plataforma) return DEFAULT_THEME;
    const normalized = plataforma.toString().toUpperCase().trim();
    
    // Prioridad 2: Temas predefinidos
    if (PLATFORM_THEMES[normalized]) return PLATFORM_THEMES[normalized];

    // Mapeos por ID o coincidencias parciales
    if (normalized === "1") return PLATFORM_THEMES["INSIDE"];
    if (normalized === "2") return PLATFORM_THEMES["ATLAS"];
    if (normalized === "3") return PLATFORM_THEMES["GSWEB"];
    if (normalized === "4") return PLATFORM_THEMES["GS"];

    if (normalized.includes("ATLAS")) return PLATFORM_THEMES["ATLAS"];
    if (normalized.includes("INSIDE")) return PLATFORM_THEMES["INSIDE"];
    if (normalized.includes("GSWEB") || normalized.includes("WEB")) return PLATFORM_THEMES["GSWEB"];
    if (normalized.includes("GS")) return PLATFORM_THEMES["GS"];

    return DEFAULT_THEME;
};

// Orden canónico de plataformas para el filtro
export const PLATFORM_ORDER = ["INSIDE", "ATLAS", "GS WEB", "General de Seguros"];

// Mapea cualquier valor de rmp_plataforma al nombre display correcto
export const getPlatformName = (plataforma, apiName) => {
    if (apiName) return apiName.toString().toUpperCase().trim();
    if (!plataforma) return null;
    const normalized = plataforma.toString().toUpperCase().trim();

    if (normalized === "1" || normalized === "INSIDE") return "INSIDE";
    if (normalized === "2" || normalized === "ATLAS") return "ATLAS";
    if (normalized === "3" || normalized === "GSWEB" || normalized.includes("WEB")) return "GS WEB";
    if (normalized === "4" || normalized.includes("GS")) return "General de Seguros";

    return plataforma.toString();
};


# FacturaPro - Sistema de Facturación y Cotizaciones

## 📋 Descripción del Proyecto

**FacturaPro** es un sistema completo de gestión de cotizaciones y facturas diseñado para profesionales independientes y pequeñas empresas. La aplicación permite crear, gestionar y hacer seguimiento de cotizaciones y facturas de manera profesional, con generación de PDFs personalizados y análisis de rendimiento.

## ✨ Características Principales

### 🏢 **Gestión de Empresa**
- Configuración completa de información empresarial
- Subida y gestión de logo corporativo
- Datos de contacto (dirección, teléfono, email)
- Personalización de términos de pago

### 📦 **Catálogo de Productos y Servicios**
- Gestión completa de productos con precios y descripciones
- Servicios con tarifas por hora
- Configuración de tasas de impuestos personalizables
- Búsqueda y filtrado avanzado
- Interfaz intuitiva con pestañas separadas

### 👥 **Base de Datos de Clientes**
- Registro completo de información de clientes
- Datos de contacto (email, teléfono, dirección)
- Historial de interacciones
- Interfaz tipo tarjetas moderna y responsive

### 📋 **Sistema de Cotizaciones**
- Creación de cotizaciones profesionales
- Selección múltiple de productos/servicios
- Cálculos automáticos de subtotales, impuestos y totales
- Estados de seguimiento: borrador, enviada, aceptada, rechazada
- Fechas de validez y términos de pago personalizables
- Notas adicionales para cada cotización

### 🧾 **Gestión de Facturas**
- Conversión automática de cotizaciones aceptadas a facturas
- Estados de factura: borrador, enviada, pagada, vencida
- Fechas de vencimiento automáticas (30 días por defecto)
- Seguimiento de pagos y estados

### 📄 **Generación de PDFs**
- PDFs profesionales con branding corporativo
- Inclusión automática de logo y datos de empresa
- Diseño limpio y profesional
- Descarga automática de documentos
- Formato optimizado para impresión

### 📊 **Dashboard y Análiticas**
- Panel de control con métricas clave
- Gráficos de ingresos mensuales (últimos 6 meses)
- Análisis de tasa de aceptación vs rechazo de cotizaciones
- Estadísticas de clientes frecuentes
- Indicadores de rendimiento visual
- Gráficos interactivos con Recharts

### 🎨 **Diseño y UX**
- Diseño moderno inspirado en Apple con atención al detalle
- Esquema de colores: blanco, azul claro, gris
- Completamente responsive (mobile-first)
- Animaciones suaves y micro-interacciones
- Sistema de espaciado consistente (8px)
- Iconografía profesional con Lucide React

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework de CSS utilitario
- **React Router DOM** - Navegación del lado del cliente
- **Lucide React** - Iconos modernos y consistentes

### **Gráficos y Visualización**
- **Recharts** - Biblioteca de gráficos para React
- **date-fns** - Manipulación y formateo de fechas

### **Generación de PDFs**
- **html2canvas** - Captura de elementos HTML como imágenes
- **jsPDF** - Generación de documentos PDF

### **Almacenamiento**
- **localStorage** - Persistencia de datos local en el navegador
- **Sistema de gestión de datos personalizado** - Manejo completo de CRUD

### **Herramientas de Desarrollo**
- **Vite** - Herramienta de construcción rápida
- **PostCSS** - Procesamiento de CSS
- **Autoprefixer** - Prefijos CSS automáticos

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── Layout.tsx       # Layout principal con navegación
│   ├── PDFGenerator.tsx # Generador de PDFs
│   └── ProtectedRoute.tsx # Rutas protegidas
├── contexts/            # Contextos de React
│   └── AuthContext.tsx  # Contexto de autenticación
├── lib/                 # Utilidades y servicios
│   └── localStorage.ts  # Gestor de datos locales
├── pages/               # Páginas principales
│   ├── Dashboard.tsx    # Panel de control
│   ├── Quotes.tsx       # Gestión de cotizaciones
│   ├── Invoices.tsx     # Gestión de facturas
│   ├── Products.tsx     # Catálogo de productos/servicios
│   ├── Customers.tsx    # Base de datos de clientes
│   ├── Settings.tsx     # Configuración de empresa
│   ├── Login.tsx        # Página de inicio de sesión
│   └── Register.tsx     # Página de registro
├── types/               # Definiciones de tipos TypeScript
│   └── index.ts         # Tipos principales del sistema
└── styles/              # Estilos globales
    └── index.css        # Estilos base y componentes
```

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Node.js (versión 16 o superior)
- npm o yarn

### **Pasos de Instalación**

1. **Clonar el repositorio**
```bash
git clone [url-del-repositorio]
cd facturapro
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:5173
```

## 💾 Gestión de Datos

### **Almacenamiento Local**
- Todos los datos se almacenan en `localStorage` del navegador
- No requiere configuración de base de datos externa
- Datos persistentes entre sesiones
- Funciona completamente offline

### **Estructura de Datos**
```typescript
// Usuarios
interface User {
  id: string;
  email: string;
  company_name: string;
  company_address?: string;
  company_phone?: string;
  company_email?: string;
  logo_url?: string;
  created_at: string;
}

// Productos
interface Product {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  price: number;
  tax_rate: number;
  created_at: string;
}

// Servicios
interface Service {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  hourly_rate: number;
  tax_rate: number;
  created_at: string;
}

// Clientes
interface Customer {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
}

// Cotizaciones
interface Quote {
  id: string;
  user_id: string;
  customer_id: string;
  customer_name: string;
  quote_number: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  items: QuoteItem[];
  subtotal: number;
  tax_amount: number;
  total: number;
  valid_until: string;
  payment_terms?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Facturas
interface Invoice {
  id: string;
  user_id: string;
  customer_id: string;
  customer_name: string;
  quote_id?: string;
  invoice_number: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  items: QuoteItem[];
  subtotal: number;
  tax_amount: number;
  total: number;
  due_date: string;
  payment_terms?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
```

## 🎯 Funcionalidades Detalladas

### **Dashboard**
- **Métricas principales**: Ingresos totales, número de cotizaciones, tasa de aceptación
- **Gráfico de ingresos mensuales**: Visualización de los últimos 6 meses
- **Distribución de estados**: Gráfico circular con cotizaciones por estado
- **Cotizaciones recientes**: Tabla con las últimas 5 cotizaciones
- **Indicadores visuales**: Iconos de estado y colores diferenciados

### **Gestión de Productos y Servicios**
- **Vista por pestañas**: Separación clara entre productos y servicios
- **Formulario modal**: Creación y edición en ventana modal
- **Validación de datos**: Campos requeridos y tipos de datos
- **Búsqueda en tiempo real**: Filtrado instantáneo por nombre o descripción
- **Acciones rápidas**: Editar y eliminar con confirmación

### **Sistema de Cotizaciones**
- **Selección de cliente**: Dropdown con opción de crear cliente nuevo
- **Agregado de items**: Interfaz intuitiva para productos y servicios
- **Cálculos automáticos**: Subtotales, impuestos y total en tiempo real
- **Gestión de estados**: Cambio de estado con dropdown integrado
- **Generación de números**: Numeración automática (Q2024-0001)

### **Generación de PDFs**
- **Diseño profesional**: Header con logo, información de empresa y cliente
- **Tabla de items**: Descripción, cantidad, precio unitario, impuestos y total
- **Totales destacados**: Subtotal, impuestos y total final
- **Términos y notas**: Sección para condiciones de pago y observaciones
- **Footer corporativo**: Mensaje de agradecimiento

## 🔧 Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Construcción
npm run build        # Construye para producción
npm run preview      # Vista previa de la construcción

# Linting y formato
npm run lint         # Ejecuta ESLint
npm run format       # Formatea código con Prettier
```

## 🎨 Guía de Estilos

### **Colores Principales**
```css
/* Azul primario */
--blue-50: #eff6ff
--blue-500: #3b82f6
--blue-600: #2563eb
--blue-700: #1d4ed8

/* Grises */
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-500: #6b7280
--gray-900: #111827

/* Estados */
--green-500: #10b981  /* Éxito/Aceptado */
--red-500: #ef4444    /* Error/Rechazado */
--yellow-500: #f59e0b /* Advertencia/Pendiente */
```

### **Tipografía**
- **Fuente principal**: Inter (Google Fonts)
- **Pesos disponibles**: 300, 400, 500, 600, 700
- **Jerarquía**: h1 (2xl), h2 (xl), h3 (lg), body (base), small (sm)

### **Espaciado**
- **Sistema base**: 8px (0.5rem)
- **Espacios comunes**: 4px, 8px, 16px, 24px, 32px, 48px
- **Contenedores**: padding de 24px (p-6)

## 🔒 Seguridad y Privacidad

- **Datos locales**: Toda la información se almacena localmente
- **Sin transmisión**: No se envían datos a servidores externos
- **Privacidad total**: Control completo sobre la información
- **Backup manual**: Posibilidad de exportar datos

## 🚀 Próximas Funcionalidades

### **Versión 2.0**
- [ ] Sistema de autenticación completo
- [ ] Sincronización en la nube
- [ ] Plantillas de cotización personalizables
- [ ] Integración con sistemas de pago
- [ ] Notificaciones por email
- [ ] Reportes avanzados
- [ ] API REST para integraciones
- [ ] Aplicación móvil

### **Mejoras Técnicas**
- [ ] Tests unitarios y de integración
- [ ] PWA (Progressive Web App)
- [ ] Modo offline completo
- [ ] Optimización de rendimiento
- [ ] Internacionalización (i18n)

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o consultas:
- **Email**: soporte@facturapro.com
- **Documentación**: [docs.facturapro.com]
- **Issues**: [GitHub Issues]

---

**FacturaPro** - Simplificando la gestión de cotizaciones y facturas para profesionales independientes.
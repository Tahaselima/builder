# Template Builder

Görsel sürükle-bırak canvas üzerinde heading, text, button, image ve divider elementleri ile şablon oluşturmanızı sağlayan bir web uygulaması. Şablonlar JSON olarak dışa/içe aktarılabilir, sunucuda saklanabilir veya AI ile üretilebilir.

## Kurulum & Çalıştırma

### Gereksinimler

- Node.js 18+
- npm 9+

### Adımlar

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme modunda başlat (client + server concurrently)
npm run dev
```

Uygulama otomatik olarak:

- **Vite dev server** → `http://localhost:5173`
- **Express API server** → `http://localhost:3001`

şeklinde açılır. Vite, `/api` isteklerini Express sunucusuna proxy olarak iletir.

### Diğer Komutlar

```bash
npm run build          # TypeScript tip kontrolü + production build
npm test               # Test süitini çalıştır (42 test)
npm run preview        # Production build'i önizle
npm run server         # Sadece backend sunucusunu başlat
```

### Pre-commit Hook

[Husky](https://typicode.github.io/husky/) kuruludur. Her `git commit` öncesinde testler otomatik çalışır. Testler geçmezse commit engellenir.

---

## Mimari Kararlar

### Monorepo Yapısı: Client + Server Tek Repo

Client (Vue 3 SPA) ve server (Express.js) aynı repoda tutulur. Ortak TypeScript tipleri `src/types/` altında tanımlıdır, her iki taraf da bunları kullanır. Ayrı repo yönetimi ve tip senkronizasyonu yükünden kaçınılır.

> **Not:** Server, `src/types/` dosyasına doğrudan import yapar. İleri aşamada `shared/types/` dizinine taşınması planlanmıştır.

### Tech Stack

| Katman | Teknoloji | Neden |
|--------|----------|-------|
| **Frontend** | Vue 3 (Composition API + `<script setup>`) | Hafif, reaktif, tek dosya bileşen modeli |
| **State** | Pinia | Vue 3'ün resmi store'u, TypeScript desteği güçlü |
| **Styling** | SCSS (BEM naming) | Değişkenler, partials, mixin desteği |
| **Build** | Vite | Hızlı HMR, Vue plugin desteği |
| **Backend** | Express.js | Basit REST API, minimal overhead |
| **Storage** | File-based JSON (`data/templates.json`) | Ek veritabanı bağımlılığı yok, küçük ölçek için yeterli |
| **AI** | OpenAI GPT-4o-mini | Doğal dil ile şablon üretimi |
| **Testing** | Jest + Vue Test Utils | Component ve store testleri |

### Bileşen Mimarisi

```
App.vue
  └─ BuilderLayout.vue
       ├─ AppHeader          → Undo/redo, grid, preview, settings, shortcuts
       ├─ ElementPalette     → Sürükle-bırak element listesi + kaydet/yükle
       ├─ CanvasArea         → Drop zone, element rendering
       │    └─ CanvasElement → Drag, resize, inline-edit, z-index kontrolleri
       │         └─ ElementRenderer → Paylaşımlı element render mantığı
       └─ PropertiesPanel   → Seçili elementin özellik düzenleyicisi
```

### Barrel Export Sistemi

Her klasörde `index.ts` barrel dosyası bulunur. Import'lar alt-path'ler yerine tek noktadan yapılır:

```ts
// Doğru
import { BaseModal, CanvasArea, BaseIcon } from '@/components'
import { useEditorStore, useTemplatesStore } from '@/stores'
import { clamp, generateId, DEFAULT_CANVAS } from '@/utils'

// Yanlış
import BaseModal from '@/components/base/BaseModal.vue'
import { useEditorStore } from '@/stores/editor'
```

### Undo/Redo: JSON Snapshot Stratejisi

Her state değişikliğinde `elements` dizisinin JSON snapshot'ı history dizisine eklenir (max 50). Undo/redo, snapshot index'i kaydırarak çalışır. Basit ama etkili; küçük-orta ölçekli canvas için yeterli.

### Element Tip Sistemi: Discriminated Union

Beş element tipi (`heading`, `text`, `button`, `image`, `divider`) TypeScript discriminated union ile modellenmiştir. Her tipin kendine özel alanları vardır, ortak alanlar `BaseElement`'den extend eder.

### Data-Driven Properties Panel

Element özellikleri `propertyConfig.ts` ile bildirimsel olarak tanımlanır. Yeni bir alan eklemek için sadece konfigürasyonu güncellemek yeterlidir — UI bileşenleri otomatik render edilir.

---

## Varsayımlar

1. **Kullanıcı sayısı:** Tek kullanıcı, local development aracı olarak tasarlanmıştır. Authentication yoktur.
2. **Canvas boyutu:** Sabit boyutlu canvas (varsayılan 400×500px). Responsive canvas davranışı beklenmez.
3. **Veri saklama:** Sunucu dosya tabanlı JSON storage kullanır. Concurrent yazma durumunda veri kaybı olabilir — küçük ölçekte kabul edilebilir.
4. **AI üretimi:** OpenAI API key localStorage'da saklanır. Tarayıcıdan doğrudan OpenAI API'ye istek atılır — production'da server-side proxy kullanılmalıdır.
5. **Element sayısı:** Canvas üzerinde makul sayıda element (10-50) beklenir. Performans optimizasyonu (virtual scroll, lazy rendering) yapılmamıştır.
6. **Tarayıcı desteği:** Modern evergreen tarayıcılar hedeflenmiştir (Chrome, Firefox, Safari, Edge).

---

## Daha Fazla Zaman Olsaydı

### Kısa Vadeli İyileştirmeler

- **TypeScript strict mode'da `elementDefaults.ts` overload signatures** — `createElementDefaults('heading')` çağrısının dönüş tipi `HeadingElement` olarak daraltılabilir.
- **Composable return type annotations** — `useDragMove`, `useResize` gibi composable'ların return tipleri açıkça annotate edilmeli.
- **Server tiplerinin ayrılması** — `src/types/` → `shared/types/` taşınarak server-client tip bağımlılığı azaltılmalı.
- **Test kapsamı** — Composable'lar (`useDragMove`, `useResize`, `useKeyboard`), server route'ları ve utility fonksiyonları için test eksik.
- **ElementRenderer accessibility** — Canvas elementleri için `tabindex`, ARIA attribute'ları ve klavye navigasyonu eklenmeli.

### Orta Vadeli İyileştirmeler

- **Undo/redo iyileştirmesi** — Immutable.js veya structural sharing ile tam JSON serialization yerine diff-based snapshot.
- **AI proxy endpoint** — API key client'ta değil, server-side environment variable olarak tutulmalı.
- **Canvas export** — PNG/PDF export desteği (html2canvas veya benzeri).
- **Daha fazla element tipi** — Container/group, input field, video gibi yeni elementler eklenebilir.
- **Multi-select** — Shift+click ile çoklu seçim ve toplu hareket/resize.
- **Auto-alignment** — Elementler arası snap-to-align (sol kenar, üst kenar, merkez hizalama).

### Uzun Vadeli İyileştirmeler

- **Veritabanı geçişi** — SQLite veya PostgreSQL ile concurrent-safe storage.
- **Real-time collaboration** — WebSocket ile çoklu kullanıcı düzenleme.
- **Plugin sistemi** — Üçüncü taraf element tipleri ve property widget'ları.
- **SSR/SSG desteği** — Template preview sayfaları için SEO ve sosyal medya paylaşımı.
- **Component codegen** — Tasarlanan şablondan Vue/React component kodu üretimi.

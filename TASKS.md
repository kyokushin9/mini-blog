# План разработки блога на Laravel + React

## 📋 Общее описание
Создание блога с системой новостей и категорий, с возможностью масштабирования на более глобальные цели.

## 🎯 Цели проекта
1. **Базовый функционал блога**:
   - Добавление, редактирование, удаление новостей
   - Вывод новостей с пагинацией
   - Система категорий для группировки новостей
   - Поиск по новостям

2. **Масштабируемость**:
   - Гибкая архитектура для будущего расширения
   - Возможность добавления тегов, комментариев, рейтингов
   - Поддержка мультисайтовости (multi-tenancy)

## 🏗️ Архитектура

### Backend (Laravel)
```
app/
├── Models/
│   ├── Post.php          # Модель новости
│   ├── Category.php      # Модель категории
│   └── User.php          # Модель пользователя (автор)
├── Http/
│   ├── Controllers/
│   │   ├── PostController.php
│   │   ├── CategoryController.php
│   │   └── HomeController.php
│   └── Requests/
│       ├── StorePostRequest.php
│       ├── UpdatePostRequest.php
│       └── ...
├── Policies/
│   ├── PostPolicy.php
│   └── CategoryPolicy.php
└── Resources/
    ├── PostResource.php
    └── CategoryResource.php
```

### Frontend (React)
```
resources/js/
├── Components/
│   ├── Layout/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── Sidebar.jsx
│   ├── Post/
│   │   ├── PostList.jsx
│   │   ├── PostCard.jsx
│   │   ├── PostForm.jsx
│   │   └── PostDetail.jsx
│   ├── Category/
│   │   ├── CategoryList.jsx
│   │   ├── CategoryCard.jsx
│   │   └── CategoryForm.jsx
│   └── UI/
│       ├── Button.jsx
│       ├── Input.jsx
│       └── Modal.jsx
├── Pages/
│   ├── Home.jsx
│   ├── Posts.jsx
│   ├── PostDetail.jsx

## 📝 Этапы разработки

### Этап 1: Подготовка и настройка (1-2 часа)
- [x] Настройка окружения (.env, база данных)
- [x] Установка необходимых пакетов Laravel
- [x] Настройка CORS для API
- [x] Создание базовой структуры проекта

### Этап 2: База данных и модели (2-3 часа)
- [x] Создание миграций:
  - [x] `posts` (id, title, slug, content, excerpt, image, category_id, user_id, published_at, created_at, updated_at)
  - [x] `categories` (id, name, slug, description, parent_id, created_at, updated_at)
  - [x] `post_tag` (для будущих тегов)
- [x] Создание моделей с отношениями:
  - [x] Post belongsTo Category, belongsTo User
  - [x] Category hasMany Post, hasMany children (самоотношение)
  - [x] User hasMany Post
- [x] Создание фабрик и сидеров для тестовых данных

### Этап 3: API бэкенд (3-4 часа) ✅ ВЫПОЛНЕН
- [x] Создание контроллеров:
  - [x] PostController (index, show, store, update, destroy)
  - [x] CategoryController (index, show, store, update, destroy)
- [x] Создание Form Request для валидации
  - [x] PostStoreRequest, PostUpdateRequest
  - [x] CategoryStoreRequest, CategoryUpdateRequest
- [x] Создание API Resources для форматирования ответов
  - [x] PostResource, PostCollection
  - [x] CategoryResource, CategoryCollection
  - [x] TagResource
- [x] Настройка маршрутов (API routes)
- [x] Реализация пагинации, фильтрации, поиска
- [x] Все тесты проходят (4 passed, 70 assertions)

### Этап 4: Политики и авторизация (1-2 часа) ✅ ВЫПОЛНЕН
- [x] Создание PostPolicy и CategoryPolicy
  - [x] PostPolicy: автор или админ могут создавать/редактировать/удалять посты
  - [x] CategoryPolicy: только админ может управлять категориями
- [x] Настройка авторизации через Sanctum
  - [x] Установлен Laravel Sanctum (токены доступа)
  - [x] AuthController с login/logout
  - [x] Защита маршрутов store/update/destroy через middleware auth:sanctum
  - [x] GET-маршруты остались публичными
- [x] Реализация ролей (админ, автор, пользователь)
  - [x] Миграция add_role_to_users_table
  - [x] Константы ролей и isAdmin()/isAuthor() в модели User
  - [x] HasApiTokens подключён к модели User
- [x] Настроен Git-репозиторий с удалённым remote

### Этап 5: Frontend настройка (2-3 часа) ✅ ВЫПОЛНЕН
- [x] Установка React и зависимостей
  - [x] react, react-dom, react-router-dom, @vitejs/plugin-react
  - [x] Исправлен конфликт версий (ERESOLVE): plugin-react 4.x + Vite 7.x + laravel-vite-plugin 2.x
- [x] Настройка Vite для React
  - [x] plugin-react в vite.config.js
  - [x] proxy `/api` → `http://localhost:8000`
- [x] Создание базового layout с Header/Footer
  - [x] Header.jsx, Footer.jsx (заглушки готовы к наполнению)
- [x] Настройка роутинга (React Router)
  - [x] Браузерный роутер + catch-all маршрут в web.php на app.blade.php
  - [x] Маршруты: /, /posts, /posts/:id, /login
- [x] Создание сервисного слоя для API
  - [x] api.jsx (axios + перехватчик токена), postService, categoryService, authService
  - [x] app.blade.php со скелетом `<div id="root">`
- [x] Сборка проходит (`npm run build`), фронтенд запускается

### Этап 6: React компоненты (4-6 часов)
- [ ] Компоненты для отображения новостей:
  - PostList, PostCard, PostDetail
- [ ] Компоненты для категорий:
  - CategoryList, CategoryCard, CategoryTree
- [ ] Формы для создания/редактирования:
  - PostForm, CategoryForm
- [ ] Компоненты UI (Button, Input, Modal, Pagination)

### Этап 7: Страницы и роутинг (2-3 часа)
- [ ] Главная страница (список последних новостей)
- [ ] Страница всех новостей с фильтрами
- [ ] Страница отдельной новости
- [ ] Страница категории с новостями
- [ ] Админ-панель (управление новостями и категориями)

### Этап 8: Интеграция и тестирование (2-3 часа)
- [ ] Подключение всех компонентов
- [ ] Тестирование CRUD операций
- [ ] Тестирование фильтрации и поиска
- [ ] Оптимизация производительности

### Этап 9: Дополнительные функции (по желанию)
- [ ] Загрузка изображений для новостей
- [ ] SEO-оптимизация (meta tags, sitemap)
- [ ] Кэширование
- [ ] RSS-лента
- [ ] Комментарии к новостям
- [ ] Теги
- [ ] Рейтинги/лайки
│   ├── Categories.jsx
│   └── Admin/
│       ├── Dashboard.jsx
│       ├── PostManager.jsx
│       └── CategoryManager.jsx
├── hooks/
│   ├── usePosts.js
│   ├── useCategories.js
│   └── useAuth.js

## 🔧 Технические требования

### Backend
- Laravel 12
- PHP 8.2+
- MySQL/PostgreSQL/SQLite
- RESTful API
- Валидация данных
- Авторизация и политики

### Frontend
- React 18+
- React Router v6
- Axios для API запросов
- Tailwind CSS для стилей
- Vite для сборки

### Дополнительные инструменты
- Git для контроля версий
- Laravel Sail (опционально, для Docker)
- PHPUnit для тестов

## 📊 Критерии готовности
1. ✅ Новости создаются, редактируются, удаляются
2. ✅ Новости отображаются с пагинацией
3. ✅ Категории работают (создание, редактирование, удаление)
4. ✅ Новости фильтруются по категориям
5. ✅ Поиск по новостям работает
6. ✅ Админ-панель функциональна
7. ✅ Код чистый и документирован
8. ✅ Тесты проходят

## 🚀 Развертывание
- [ ] Настройка production окружения
- [ ] Оптимизация для production
- [ ] Настройка кэширования
- [ ] Настройка очереди (если нужно)

## 📈 Масштабирование (будущие улучшения)
1. **Мультиязычность** - поддержка нескольких языков
2. **Мультисайтовость** - несколько блогов в одной установке
3. **API для мобильных приложений**
4. **WebSocket для реального времени**
5. **Аналитика и статистика**
6. **Интеграция с социальными сетями**
7. **Расширенная система тегов и категорий**
8. **Система комментариев с модерацией**
9. **Подписка на новости (email)**
10. **Экспорт/импорт новостей**

## 📝 Заметки
- Использовать slug для SEO-дружественных URL
- Реализовать soft deletes для возможности восстановления
- Добавить timestamps во все таблицы
- Использовать полиморфные отношения для будущих расширений
- Следовать принципам SOLID и DRY
- Писать тесты для критически важных функций

---
**Дата создания плана**: 2026-08-26  
**Статус**: Готов к реализации
├── services/
│   ├── api.js
│   ├── postService.js
│   └── categoryService.js
└── App.jsx
```
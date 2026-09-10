# OpenPetal Frontend API Routes Reference Manual

This document provides a comprehensive mapping of every HTTP API call in the OpenPetal Frontend application. For each route, it details the **Browser Page**, **API Endpoint**, **HTTP Method**, **Source File Location**, and **Purpose**.

---

## Master API Summary Table

| # | Browser Page Route | API Endpoint | Method | Code File Location | Description |
|---|---|---|---|---|---|
| 1 | `/login` | `/api/v1/auth/login` | `POST` | `src/app/core/services/auth.service.ts` | User login authentication |
| 2 | `/register` | `/api/v1/auth/register` | `POST` | `src/app/core/services/auth.service.ts` | New user registration |
| 3 | `/forgot-password` | `/api/v1/auth/forgot-password` | `POST` | `src/app/core/services/auth.service.ts` | Password reset request |
| 4 | `/user/home` | `/api/v1/skills` | `GET` | `src/app/core/services/user-skill.service.ts` | Get system skills dropdown list |
| 5 | `/user/home` | `/api/v1/user/skills` | `GET` | `src/app/core/services/user-skill.service.ts` | Get logged-in user's teaching skills |
| 6 | `/user/home` | `/api/v1/user/learning-goals` | `GET` | `src/app/core/services/user-skill.service.ts` | Get logged-in user's learning goals |
| 7 | `/user/home` | `/api/v1/user/availability` | `GET` | `src/app/core/services/user.service.ts` | Get user's weekly availability slots |
| 8 | `/user/home` | `/api/v1/user/skills/teach` | `POST` | `src/app/core/services/user-skill.service.ts` | Add new teaching skill |
| 9 | `/user/home` | `/api/v1/user/skills/learn` | `POST` | `src/app/core/services/user-skill.service.ts` | Add new learning goal |
| 10 | `/user/home` | `/api/v1/user/skills/teach/{id}` | `DELETE` | `src/app/core/services/user-skill.service.ts` | Delete a teaching skill |
| 11 | `/user/home` | `/api/v1/user/skills/learn/{id}` | `DELETE` | `src/app/core/services/user-skill.service.ts` | Delete a learning goal |
| 12 | `/user/home` | `/api/v1/user/skills/{skillId}/verify/questions` | `GET` | `src/app/core/services/user-skill.service.ts` | Get/Generate AI MCQ test questions |
| 13 | `/user/home` | `/api/v1/user/skills/{skillId}/verify/submit` | `POST` | `src/app/core/services/user-skill.service.ts` | Submit MCQ test answers for skill verification |
| 14 | `/user/home` | `/api/v1/learning-goals/{goalId}/roadplan/generate` | `POST` | `src/app/core/services/user-skill.service.ts` | Generate AI learning roadmap |
| 15 | `/user/home` | `/api/v1/learning-goals/{goalId}/roadplan` | `PATCH` | `src/app/core/services/user-skill.service.ts` | Update AI roadmap node completion status |
| 16 | `/user/home` | `/api/v1/connections/sent` | `GET` | `src/app/pages/user/user-home-page/user-home-page.ts` | Fetch sent connection requests |
| 17 | `/user/home` | `/api/v1/connections/received/pending` | `GET` | `src/app/pages/user/user-home-page/user-home-page.ts` | Fetch pending received connection requests |
| 18 | `/user/home` | `/api/v1/connections/accept/{requestId}` | `POST` | `src/app/pages/user/user-home-page/user-home-page.ts` | Accept pending connection request |
| 19 | `/user/profile`, `/admin/profile` | `/api/v1/user/profile` | `GET` | `src/app/core/services/user.service.ts` | Get user profile data |
| 20 | `/user/profile`, `/admin/profile` | `/api/v1/user/profile` | `PUT` | `src/app/core/services/user.service.ts` | Update user profile details |
| 21 | `/user/profile`, `/admin/profile` | `/api/v1/user/change-password` | `PUT` | `src/app/core/services/user.service.ts` | Change user password |
| 22 | `/user/profile`, `/admin/profile` | `/api/v1/user/availability` | `POST` | `src/app/core/services/user.service.ts` | Add weekly availability slot |
| 23 | `/user/profile`, `/admin/profile` | `/api/v1/user/availability` | `DELETE` | `src/app/core/services/user.service.ts` | Remove weekly availability slot |
| 24 | `/user/search` | `/api/v1/search/users?searchType=..&query=..` | `GET` | `src/app/pages/user/search-page/search-page.ts` | Search users or skills |
| 25 | `/user/search` | `/api/v1/search/recommendations/mentors` | `GET` | `src/app/pages/user/search-page/search-page.ts` | Get mentor recommendations |
| 26 | `/user/search` | `/api/v1/search/recommendations/barter` | `GET` | `src/app/pages/user/search-page/search-page.ts` | Get barter partner recommendations |
| 27 | `/user/user-details/:userId` | `/api/v1/search/users/{userId}/details` | `GET` | `src/app/pages/user/user-details-page/user-details-page.ts` | Get public profile details of a user |
| 28 | `/user/user-details/:userId` | `/api/v1/sessions/create` | `POST` | `src/app/pages/user/user-details-page/user-details-page.ts` | Schedule session with mentor |
| 29 | `/user/user-details/:userId` | `/api/v1/connections/send` | `POST` | `src/app/pages/user/user-details-page/user-details-page.ts` | Send connection request to user |
| 30 | `/user/user-details/:userId` | `/api/v1/connections/accept/{requestId}` | `POST` | `src/app/pages/user/user-details-page/user-details-page.ts` | Accept connection request from details page |
| 31 | `/user/skill` | `/api/v1/skills/details/page?page=..&size=..` | `GET` | `src/app/pages/user/skill-page/skill-page.ts` | Paginated system skills directory with teacher counts |
| 32 | `/user/session` | `/api/v1/sessions/my-sessions` | `GET` | `src/app/core/services/session.service.ts` | Get logged-in user's learning sessions |
| 33 | `/user/session/:id` | `/api/v1/sessions/{id}` | `GET` | `src/app/core/services/session.service.ts` | Get specific session details |
| 34 | `/user/session/:id` | `/api/v1/sessions/{id}/accept` | `PUT` | `src/app/core/services/session.service.ts` | Accept requested session |
| 35 | `/user/session/:id` | `/api/v1/sessions/{id}/decline` | `POST` | `src/app/core/services/session.service.ts` | Decline requested session |
| 36 | `/user/session/:id` | `/api/v1/sessions/{id}/cancel` | `PUT` | `src/app/core/services/session.service.ts` | Cancel active session |
| 37 | `/user/session/:id` | `/api/v1/sessions/{id}/my-otp` | `GET` | `src/app/core/services/session.service.ts` | Get start/end OTPs for session |
| 38 | `/user/session/:id` | `/api/v1/sessions/{id}/verify-start` | `POST` | `src/app/core/services/session.service.ts` | Verify session start OTP |
| 39 | `/user/session/:id` | `/api/v1/sessions/{id}/verify-end` | `POST` | `src/app/core/services/session.service.ts` | Verify session end OTP |
| 40 | `/user/session/:id` | `/api/v1/sessions/{id}/raise-conflict` | `POST` | `src/app/core/services/session.service.ts` | Raise a session conflict dispute |
| 41 | `/user/session/:id` | `/api/v1/sessions/{sessionId}/conflict` | `GET` | `src/app/core/services/session.service.ts` | Get session conflict details |
| 42 | `/user/session/:id` | `/api/v1/sessions/{sessionId}/conflict/story` | `PUT` | `src/app/core/services/session.service.ts` | Submit user story for session conflict |
| 43 | `/user/conflicts` | `/api/v1/conflicts/my-conflicts` | `GET` | `src/app/core/services/conflict.service.ts` | Get list of user's session conflicts |
| 44 | `/user/my-queries` | `/queries` | `GET` | `src/app/core/services/query.service.ts` | Get user's submitted support queries |
| 45 | `/user/my-queries` | `/queries` | `POST` | `src/app/core/services/query.service.ts` | Submit a new support query |
| 46 | `/user/my-queries` | `/queries/{id}` | `GET` | `src/app/core/services/query.service.ts` | Get specific support query details |
| 47 | `/user/inbox`, Global Panel | `/api/v1/chat/conversations` | `GET` | `src/app/core/services/chat.service.ts` | Get active chat conversations list |
| 48 | `/user/inbox`, Global Panel | `/api/v1/chat/{connectionRequestId}/messages` | `GET` | `src/app/core/services/chat.service.ts` | Get chat messages for connection |
| 49 | `/user/inbox`, Global Panel | `/api/v1/chat/{connectionRequestId}/send` | `POST` | `src/app/core/services/chat.service.ts` | Send direct chat message |
| 50 | `/user/inbox`, Global Panel | `/api/v1/chat/{connectionRequestId}/read` | `PUT` | `src/app/core/services/chat.service.ts` | Mark conversation messages as read |
| 51 | `/user/inbox`, Global Panel | `/api/v1/chat/unread-count` | `GET` | `src/app/core/services/chat.service.ts` | Get total unread messages count |
| 52 | Floating AI Chat Widget | `/api/ai/chat-menu` | `GET` | `src/app/core/services/ai-chat.service.ts` | Get AI chat menu history list |
| 53 | Floating AI Chat Widget | `/api/ai/chat/{chatId}` | `GET` | `src/app/core/services/ai-chat.service.ts` | Get specific AI chat conversation |
| 54 | Floating AI Chat Widget | `/api/ai/chat` | `POST` | `src/app/core/services/ai-chat.service.ts` | Send message to AI assistant (new chat) |
| 55 | Floating AI Chat Widget | `/api/ai/chat/{chatId}` | `POST` | `src/app/core/services/ai-chat.service.ts` | Send message to AI assistant (existing chat) |
| 56 | `/admin/home` | `/admin/dashboard` | `GET` | `src/app/core/services/admin-dashboard.service.ts` | Get admin dashboard statistics |
| 57 | `/admin/user` | `/api/v1/admin/user` | `GET` | `src/app/pages/admin/user-page/user-page.ts` | Paginated search of all users for admin |
| 58 | `/admin/users/:userId/details` | `/api/v1/search/users/{userId}/details` | `GET` | `src/app/pages/admin/user-details-page/user-details-page.ts` | Admin view user details |
| 59 | `/admin/skill-categories` | `/api/v1/skill-categories` | `GET` | `src/app/pages/admin/skill-category-page/skill-category-page.ts` | Get all skill categories |
| 60 | `/admin/skill-categories` | `/api/v1/admin/skill-categories` | `POST` | `src/app/components/add-skill-category-dialog/add-skill-category-dialog.ts` | Create new skill category |
| 61 | `/admin/skill-categories/:id/details` | `/api/v1/admin/skill-categories/{categoryId}` | `GET` | `src/app/pages/admin/skill-category-details-page/skill-category-details-page.ts` | Get skill category details |
| 62 | `/admin/skill-categories/:id/details` | `/api/v1/admin/skill-categories/{categoryId}/skills` | `GET` | `src/app/pages/admin/skill-category-details-page/skill-category-details-page.ts` | Get skills in category |
| 63 | `/admin/skill-categories/:id/details` | `/api/v1/admin/skills` | `POST` | `src/app/components/add-skill-dialog/add-skill-dialog.ts` | Add new skill under category |
| 64 | `/admin/skill-categories/:id/details` | `/api/v1/admin/skills/{skillId}/details` | `GET` | `src/app/pages/admin/skill-category-details-page/skill-category-details-page.ts` | Get skill details |
| 65 | `/admin/session` | `/api/v1/admin/sessions` | `GET` | `src/app/core/services/admin-session.service.ts` | Get all sessions across platform |
| 66 | `/admin/session` | `/api/v1/admin/sessions/{id}` | `GET` | `src/app/core/services/admin-session.service.ts` | Get admin session details |
| 67 | `/admin/session` | `/api/v1/admin/sessions/{id}/cancel` | `PUT` | `src/app/core/services/admin-session.service.ts` | Admin force cancel session |
| 68 | `/admin/conflicts`, `/admin/queries` | `/api/v1/admin/conflicts` | `GET` | `src/app/core/services/admin-conflict.service.ts` | Get all session conflict disputes |
| 69 | `/admin/conflicts/:id/details` | `/api/v1/admin/conflicts/{id}` | `GET` | `src/app/core/services/admin-conflict.service.ts` | Get admin conflict details |
| 70 | `/admin/conflicts/:id/details` | `/api/v1/admin/conflicts/{id}/resolve` | `PUT` | `src/app/core/services/admin-conflict.service.ts` | Admin resolve session conflict dispute |
| 71 | `/admin/queries` | `/admin/queries` | `GET` | `src/app/core/services/admin-query.service.ts` | Get all user support queries |
| 72 | `/admin/queries` | `/admin/queries/{id}/reply` | `PATCH` | `src/app/core/services/admin-query.service.ts` | Admin reply to user query |
| 73 | `/admin/locations` | `/api/admin/locations` | `GET` | `src/app/core/services/location.service.ts` | Get all offline locations |
| 74 | `/admin/locations` | `/api/admin/locations/{id}` | `GET` | `src/app/core/services/location.service.ts` | Get location details by ID |
| 75 | `/admin/locations` | `/api/admin/locations` | `POST` | `src/app/core/services/location.service.ts` | Create new offline location |

---

## Detailed Page-by-Page Mapping

### 1. Authentication Pages (`/login`, `/register`, `/forgot-password`)
- **Login Page (`/login`)**:
  - `POST` `/api/v1/auth/login` — Location: `src/app/core/services/auth.service.ts`
- **Register Page (`/register`)**:
  - `POST` `/api/v1/auth/register` — Location: `src/app/core/services/auth.service.ts`
- **Forgot Password Page (`/forgot-password`)**:
  - `POST` `/api/v1/auth/forgot-password` — Location: `src/app/core/services/auth.service.ts`

### 2. User Home Page (`/user/home`)
- `GET` `/api/v1/skills` — Location: `src/app/core/services/user-skill.service.ts`
- `GET` `/api/v1/user/skills` — Location: `src/app/core/services/user-skill.service.ts`
- `GET` `/api/v1/user/learning-goals` — Location: `src/app/core/services/user-skill.service.ts`
- `GET` `/api/v1/user/availability` — Location: `src/app/core/services/user.service.ts`
- `POST` `/api/v1/user/skills/teach` — Location: `src/app/core/services/user-skill.service.ts`
- `POST` `/api/v1/user/skills/learn` — Location: `src/app/core/services/user-skill.service.ts`
- `DELETE` `/api/v1/user/skills/teach/{id}` — Location: `src/app/core/services/user-skill.service.ts`
- `DELETE` `/api/v1/user/skills/learn/{id}` — Location: `src/app/core/services/user-skill.service.ts`
- `GET` `/api/v1/user/skills/{skillId}/verify/questions` — Location: `src/app/core/services/user-skill.service.ts`
- `POST` `/api/v1/user/skills/{skillId}/verify/submit` — Location: `src/app/core/services/user-skill.service.ts`
- `POST` `/api/v1/learning-goals/{goalId}/roadplan/generate` — Location: `src/app/core/services/user-skill.service.ts`
- `PATCH` `/api/v1/learning-goals/{goalId}/roadplan` — Location: `src/app/core/services/user-skill.service.ts`
- `GET` `/api/v1/connections/sent` — Location: `src/app/pages/user/user-home-page/user-home-page.ts`
- `GET` `/api/v1/connections/received/pending` — Location: `src/app/pages/user/user-home-page/user-home-page.ts`
- `POST` `/api/v1/connections/accept/{requestId}` — Location: `src/app/pages/user/user-home-page/user-home-page.ts`

### 3. User Profile & Settings Page (`/user/profile`, `/admin/profile`)
- `GET` `/api/v1/user/profile` — Location: `src/app/core/services/user.service.ts`
- `PUT` `/api/v1/user/profile` — Location: `src/app/core/services/user.service.ts`
- `PUT` `/api/v1/user/change-password` — Location: `src/app/core/services/user.service.ts`
- `POST` `/api/v1/user/availability` — Location: `src/app/core/services/user.service.ts`
- `DELETE` `/api/v1/user/availability` — Location: `src/app/core/services/user.service.ts`

### 4. User Search Page (`/user/search`)
- `GET` `/api/v1/search/users` — Location: `src/app/pages/user/search-page/search-page.ts`
- `GET` `/api/v1/search/recommendations/mentors` — Location: `src/app/pages/user/search-page/search-page.ts`
- `GET` `/api/v1/search/recommendations/barter` — Location: `src/app/pages/user/search-page/search-page.ts`

### 5. User Details Page (`/user/user-details/:userId`)
- `GET` `/api/v1/search/users/{userId}/details` — Location: `src/app/pages/user/user-details-page/user-details-page.ts`
- `POST` `/api/v1/sessions/create` — Location: `src/app/pages/user/user-details-page/user-details-page.ts`
- `POST` `/api/v1/connections/send` — Location: `src/app/pages/user/user-details-page/user-details-page.ts`
- `POST` `/api/v1/connections/accept/{requestId}` — Location: `src/app/pages/user/user-details-page/user-details-page.ts`

### 6. User Skill Directory Page (`/user/skill`)
- `GET` `/api/v1/skills/details/page` — Location: `src/app/pages/user/skill-page/skill-page.ts`

### 7. User Sessions Pages (`/user/session`, `/user/session/:id`)
- `GET` `/api/v1/sessions/my-sessions` — Location: `src/app/core/services/session.service.ts`
- `GET` `/api/v1/sessions/{id}` — Location: `src/app/core/services/session.service.ts`
- `PUT` `/api/v1/sessions/{id}/accept` — Location: `src/app/core/services/session.service.ts`
- `POST` `/api/v1/sessions/{id}/decline` — Location: `src/app/core/services/session.service.ts`
- `PUT` `/api/v1/sessions/{id}/cancel` — Location: `src/app/core/services/session.service.ts`
- `GET` `/api/v1/sessions/{id}/my-otp` — Location: `src/app/core/services/session.service.ts`
- `POST` `/api/v1/sessions/{id}/verify-start` — Location: `src/app/core/services/session.service.ts`
- `POST` `/api/v1/sessions/{id}/verify-end` — Location: `src/app/core/services/session.service.ts`
- `POST` `/api/v1/sessions/{id}/raise-conflict` — Location: `src/app/core/services/session.service.ts`
- `GET` `/api/v1/sessions/{sessionId}/conflict` — Location: `src/app/core/services/session.service.ts`
- `PUT` `/api/v1/sessions/{sessionId}/conflict/story` — Location: `src/app/core/services/session.service.ts`

### 8. User Conflicts & Support Queries (`/user/conflicts`, `/user/my-queries`)
- `GET` `/api/v1/conflicts/my-conflicts` — Location: `src/app/core/services/conflict.service.ts`
- `GET` `/queries` — Location: `src/app/core/services/query.service.ts`
- `POST` `/queries` — Location: `src/app/core/services/query.service.ts`
- `GET` `/queries/{id}` — Location: `src/app/core/services/query.service.ts`

### 9. Inbox & Direct Messaging (`/user/inbox`, Global Panel)
- `GET` `/api/v1/chat/conversations` — Location: `src/app/core/services/chat.service.ts`
- `GET` `/api/v1/chat/{connectionRequestId}/messages` — Location: `src/app/core/services/chat.service.ts`
- `POST` `/api/v1/chat/{connectionRequestId}/send` — Location: `src/app/core/services/chat.service.ts`
- `PUT` `/api/v1/chat/{connectionRequestId}/read` — Location: `src/app/core/services/chat.service.ts`
- `GET` `/api/v1/chat/unread-count` — Location: `src/app/core/services/chat.service.ts`

### 10. AI Assistant Chat Widget
- `GET` `/api/ai/chat-menu` — Location: `src/app/core/services/ai-chat.service.ts`
- `GET` `/api/ai/chat/{chatId}` — Location: `src/app/core/services/ai-chat.service.ts`
- `POST` `/api/ai/chat` — Location: `src/app/core/services/ai-chat.service.ts`
- `POST` `/api/ai/chat/{chatId}` — Location: `src/app/core/services/ai-chat.service.ts`

### 11. Admin Home / Dashboard (`/admin/home`)
- `GET` `/admin/dashboard` — Location: `src/app/core/services/admin-dashboard.service.ts`

### 12. Admin User Management Pages (`/admin/user`, `/admin/users/:userId/details`)
- `GET` `/api/v1/admin/user` — Location: `src/app/pages/admin/user-page/user-page.ts`
- `GET` `/api/v1/search/users/{userId}/details` — Location: `src/app/pages/admin/user-details-page/user-details-page.ts`

### 13. Admin Skill Management Pages (`/admin/skill-categories`, `/admin/skill-categories/:id/details`)
- `GET` `/api/v1/skill-categories` — Location: `src/app/pages/admin/skill-category-page/skill-category-page.ts`
- `POST` `/api/v1/admin/skill-categories` — Location: `src/app/components/add-skill-category-dialog/add-skill-category-dialog.ts`
- `GET` `/api/v1/admin/skill-categories/{categoryId}` — Location: `src/app/pages/admin/skill-category-details-page/skill-category-details-page.ts`
- `GET` `/api/v1/admin/skill-categories/{categoryId}/skills` — Location: `src/app/pages/admin/skill-category-details-page/skill-category-details-page.ts`
- `POST` `/api/v1/admin/skills` — Location: `src/app/components/add-skill-dialog/add-skill-dialog.ts`
- `GET` `/api/v1/admin/skills/{skillId}/details` — Location: `src/app/pages/admin/skill-category-details-page/skill-category-details-page.ts`

### 14. Admin Session & Conflict Management (`/admin/session`, `/admin/conflicts`, `/admin/conflicts/:id/details`)
- `GET` `/api/v1/admin/sessions` — Location: `src/app/core/services/admin-session.service.ts`
- `GET` `/api/v1/admin/sessions/{id}` — Location: `src/app/core/services/admin-session.service.ts`
- `PUT` `/api/v1/admin/sessions/{id}/cancel` — Location: `src/app/core/services/admin-session.service.ts`
- `GET` `/api/v1/admin/conflicts` — Location: `src/app/core/services/admin-conflict.service.ts`
- `GET` `/api/v1/admin/conflicts/{id}` — Location: `src/app/core/services/admin-conflict.service.ts`
- `PUT` `/api/v1/admin/conflicts/{id}/resolve` — Location: `src/app/core/services/admin-conflict.service.ts`

### 15. Admin Support Queries (`/admin/queries`)
- `GET` `/admin/queries` — Location: `src/app/core/services/admin-query.service.ts`
- `PATCH` `/admin/queries/{id}/reply` — Location: `src/app/core/services/admin-query.service.ts`

### 16. Admin Locations Management (`/admin/locations`)
- `GET` `/api/admin/locations` — Location: `src/app/core/services/location.service.ts`
- `GET` `/api/admin/locations/{id}` — Location: `src/app/core/services/location.service.ts`
- `POST` `/api/admin/locations` — Location: `src/app/core/services/location.service.ts`

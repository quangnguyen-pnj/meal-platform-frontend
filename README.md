# meal-platform-web

Frontend cua nen tang quan ly suat an nha may. Day la repository web doc lap,
giao tiep voi backend `meal-platform-api` qua REST/JSON.

## Cong nghe

- Next.js 16 (App Router) + TypeScript (strict)
- Tailwind CSS v4 + shadcn/ui (new-york) + Lucide icons
- TanStack Query v5 cho server state (khong dung SWR, Redux, hay Zustand)
- Light mode truoc

## Yeu cau

- Node.js 20 tro len (khuyen nghi 22)
- npm

## Thiet lap local

```bash
npm install
cp .env.example .env
```

`.env` can bien:

| Bien                     | Mac dinh                | Y nghia                                                                     |
| ------------------------ | ----------------------- | --------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_ORIGIN` | `http://localhost:3000` | Base origin cua backend. HTTP client goi `${NEXT_PUBLIC_API_ORIGIN}/v1/...` |

## Chay

```bash
npm run dev
```

Mo [http://localhost:3001](http://localhost:3001). Web chay o cong `3001`
(`next dev -p 3001`) de khong dung cong voi backend, vi backend mac dinh o cong
`3000`. `NEXT_PUBLIC_API_ORIGIN` phai tro toi backend (`http://localhost:3000`),
va backend phai cho phep CORS tu `http://localhost:3001` (bien `WEB_ORIGIN`).

Route `/` dieu huong vao `/dashboard`. Shell bao ve yeu cau dang nhap: neu chua
co phien, nguoi dung bi dua ve `/login`. Trang dashboard goi `GET /v1/health`
qua HTTP client va TanStack Query. Khi backend chua chay, UI hien thi loi co cau
truc (ma loi, thong bao, request id) thay vi crash.

## Xac thuc va phien

Backend dung Bearer token trong header, khong dung cookie.

- `POST /auth/login` tra `{ accessToken, refreshToken, tokenType, expiresIn }`.
- Token duoc luu o `services/auth-session.ts`: trong bo nho khi tab mo va dong
  bo xuong `localStorage` de reload khong mat phien. Day la mo hinh don gian cho
  SPA dev; backend van la nguon enforce quyen.
- `lib/http-client.ts` tu dong gan `Authorization: Bearer <accessToken>`. Khi gap
  `401`, client goi `POST /auth/refresh` mot lan (refresh token **xoay vong**, luon
  luu ban moi nhat), roi phat lai request. Neu refresh that bai, phien bi xoa.
- `contexts/AuthContext.tsx` tai `GET /auth/me` de lay principal (roles,
  permissions, scopeGrants), chan route bao ve, va cung cap `logout`
  (`POST /auth/logout` roi xoa token).

## Man hinh Phase 0

- `/login`: form email + mat khau, hien loi `ApiError` (vd 401) ngay tai form.
- `/dashboard`: tong quan + kiem tra ket noi backend.
- `/organization`: cay to chuc (nha may -> phong ban -> to), tao/sua/xoa gated
  boi quyen `organization:manage`.
- `/workforce/employees`: danh sach nhan vien da loc theo scope (loc them theo
  to), tao/sua/xoa + tai khoan tuy chon, gated boi `employee:read` /
  `employee:manage`.
- `/workforce/imports`: wizard import nhan vien tu file `.xlsx` (tai template,
  upload, xem loi theo tung dong, xac nhan apply), gated boi `employee:import`.

Nav chi hien muc ma quyen cua principal cho phep. Loi `403 FORBIDDEN` hien thi
dang "khong co quyen" ro rang thay vi crash.

## Lenh

| Lenh                | Mo ta                    |
| ------------------- | ------------------------ |
| `npm run dev`       | Chay dev server          |
| `npm run build`     | Build production         |
| `npm run start`     | Chay ban build           |
| `npm run lint`      | ESLint                   |
| `npm run typecheck` | Kiem tra kieu TypeScript |
| `npm run format`    | Prettier format          |

## Cau truc thu muc

Rang buoc theo ke hoach kien truc:

| Thu muc               | Trach nhiem                                                                 |
| --------------------- | --------------------------------------------------------------------------- |
| `app/`, `components/` | Trinh bay (props vao, UI ra). Khong goi API, khong chuyen doi DTO trong JSX |
| `hooks/`              | TanStack Query, form state, mutation                                        |
| `api/`                | Wrapper REST mong tren HTTP client                                          |
| `mappers/`            | Chuyen DTO backend thanh view model                                         |
| `services/`           | Logic nghiep vu khong gan voi component cu the                              |
| `contexts/`           | State dung chung giua nhieu component                                       |
| `lib/`                | Tien ich chung, HTTP client, chuan loi                                      |
| `types/`              | Kieu dung chung, bao gom shape loi API                                      |

## Xu ly loi

Backend tra loi theo shape `{ code, message, details?, requestId }`. HTTP client
(`lib/http-client.ts`) map moi response loi va loi mang thanh `ApiError`
(`lib/api-error.ts`) giu nguyen shape nay de UI hien thi dong nhat.

# Hướng Dẫn Dành Cho Copilot: Dự Án Game "Tinh Hà Giả"

Bạn đang hỗ trợ code cho một dự án game MUD (Multi-User Dungeon) text-based có tên "Tinh Hà Giả". Đây là các quy tắc và bối cảnh cốt lõi bạn cần tuân theo.

## 1. Bối Cảnh & Chủ Đề (Concept & Theme)

* **Chủ Đề:** Khoa học viễn tưởng (Sci-Fi), sinh tồn, lấy cảm hứng từ "Thôn Phệ Tinh Không".
* **KHÔNG DÙNG "TU TIÊN":** Đây là điểm quan trọng nhất. Chúng ta không dùng các khái niệm "Luyện Khí", "Kim Đan", "Nguyên Anh".
* **HỆ THỐNG CHÍNH:** "Tiến Hóa Gien" (Gene Evolution). Người chơi hấp thụ "Năng Lượng Tinh Thể" (Energy Crystal) để tăng `geneEnergy`.
* **Cấp Bậc (Ranks):** Sử dụng các cấp bậc như: "Học Đồ" (Apprentice), "Chiến Sĩ" (Soldier), "Chiến Tướng" (General), "Chiến Thần" (Wargod).
* **UI/UX:** Giao diện dạng terminal/console, text-based, dùng font `font-mono` và các màu neon (xanh, tím) trên nền tối.

## 2. Ngăn Xếp Công Nghệ (Tech Stack)

* **Framework:** Nuxt 3 (SSR: `false`).
* **Database:** MongoDB qua `nuxt-mongoose`.
* **Xác Thực:** `nuxt-auth-utils`.
* **Quản Lý Trạng Thái (Client):** Pinia (`@pinia/nuxt`).
* **Styling:** TailwindCSS.

## 3. Kiến Trúc Cốt Lõi (Core Architecture)

Đây là luồng dữ liệu chính của game. **TUYỆT ĐỐI TUÂN THỦ.**

### A. API Endpoint DUY NHẤT

* Chúng ta **KHÔNG** tạo nhiều API endpoint (như `/api/move`, `/api/attack`).
* Tất cả mọi hành động trong game (di chuyển, tấn công, thu thập, hấp thụ...) đều được xử lý bởi **MỘT** endpoint duy nhất: `POST /api/action`.
* File `server/api/action.post.ts` chịu trách nhiệm:
    1.  Lấy thông tin `characterId` từ session.
    2.  Đọc body request (gồm `action: string` và `payload: any`).
    3.  Tìm handler tương ứng với `action` (ví dụ: `actions['zone/move']`).
    4.  Thực thi handler với context `({ character, payload })`.
    5.  Tự động lưu lại `character.save()` sau khi handler chạy xong.

### B. Logic Phía Server (Action Handlers)

* Toàn bộ game logic được đặt trong thư mục `server/actions/`.
* Mỗi action là một file (ví dụ: `server/actions/zone/move.ts`).
* Tất cả action handlers được đăng ký trong `server/actions/index.ts`.
* Tên action theo định dạng `group/name` (ví dụ: `zone/move`, `combat/attack`, `core/absorb`).
* Mỗi handler là một hàm `async` nhận `({ character, payload })` và *phải* trả về một `result` (thường là log text cho client).

### C. Client (Frontend)

* **State:** Trạng thái nhân vật (`character`), thông tin zone (`currentZone`), và log game (`gameLogs`) được quản lý trong Pinia store (ví dụ: `useGameStore`).
* **Gọi Action:** Client **KHÔNG** gọi `useFetch` trực tiếp đến `/api/action`. Thay vào đó, client sử dụng composable `useGameAction()`.
* **Ví dụ Client:**
    ```typescript
    // Trong một component .vue
    const { execute: runAction, loading } = useGameAction() //

    async function moveNorth() {
      await runAction('zone/move', { direction: 'North' })
      // Store (useGameStore) sẽ tự động cập nhật state
    }
    ```

## 4. Quy Tắc Code & Hướng Dẫn

1.  **Khi thêm tính năng mới (ví dụ: "Thu thập item"):**
    * **SAI:** Tạo `server/api/collect.post.ts`.
    * **ĐÚNG:**
        1.  Tạo file `server/actions/item/collect.ts`.
        2.  Viết logic `export default async ({ character, payload }) => { ... }`.
        3.  Đăng ký nó trong `server/actions/index.ts` với key `'item/collect'`.
        4.  Từ client, gọi `runAction('item/collect', { itemId: '...' })`.

2.  **Schema Database:**
    * Tất cả Mongoose schema được định nghĩa trong `server/models/`.
    * Luôn sử dụng `defineMongooseModel`.
    * `character.model.ts` là model quan trọng nhất, chứa `rank`, `geneEnergy`, `stats`, `location`, `inventory`....

3.  **UI/UX (Rất Quan Trọng): Triết lý "Giao Diện Chỉ Huy" (Command Interface)**
    * **Mobile-First:** Luôn thiết kế cho mobile trước. Layout phải tuân theo cấu trúc "HUD Tối Giản":
        * **Header (Sticky):** Thanh trạng thái mỏng (HP, EN, Zone).
        * **Body (Scrollable):** Khu vực log chính, hiển thị mọi thông tin.
        * **Footer (Sticky):** "Bảng Lệnh" chứa các hành động (di chuyển, tấn công).
    * **Không Dùng Icon:** Tuyệt đối không dùng icon (fontawesome, heroicons...). Sử dụng typography và văn bản để thể hiện hành động (ví dụ: `> Di chuyển: [Bắc]`, `[ MỞ RỘNG ]`).
    * **Phong Cách (Vibe):** Phải tạo cảm giác "utilitarian" (hữu dụng), giống như một bảng điều khiển thật, không phải một trang web "nhựa" hay "AI".
    * **Styling:**
        * Luôn dùng `font-mono`.
        * Sử dụng các màu đã định nghĩa: `bg_dark` (từ `background.dark`), `text-text_primary`, `text-neon_blue`, `text-neon_purple`.
        * Tận dụng các hiệu ứng (animation) như `animate-softPulse` để tạo cảm giác sci-fi.

4.  **Ngôn Ngữ:**
    * **Tên file, biến, hàm, comments:** Tiếng Anh (English) (ví dụ: `character.model.ts`, `geneEnergy`).
    * **Nội dung game (Data):** Tiếng Việt (ví dụ: `name: 'Lang Thú Biến Dị'`, `rank: 'Học Đồ Cấp 1'`, `description: 'Bạn đang ở Căn Cứ Tân Thủ.'`).
    * **Các log, stats, thông tin key của hệ giống phải map sang tiếng việt (ví dụ như trong log: "Bạn đã hấp thụ 50 Năng Lượng Tinh Thể.")** (ví dụ "bạn vừa tăng 10 điểm Sinh Lực" chứ không phải "bạn vừa tăng 50 hp").

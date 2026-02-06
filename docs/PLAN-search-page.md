# PLAN-search-page.md

Xây dựng trang tìm kiếm riêng biệt (`/search`) hỗ trợ tìm kiếm văn bản kết hợp với lọc danh mục, hiển thị thông báo kết quả thông minh.

## Proposed Changes

### 1. Backend Search Enhancement
- Đảm bảo API `/api/movies` xử lý mượt mà cả 3 tham số: `search`, `genre_id`, `age_rating`. (Đã hoàn thành cơ bản).

### 2. Frontend - Routing
- **[MODIFY] [App.jsx](file:///d:/Movie-Cinema/frontend/src/App.jsx)**:
    - Thêm route: `<Route path="/search" element={<Search />} />`.

### 3. Frontend - Navbar
- **[MODIFY] [Navbar.jsx](file:///d:/Movie-Cinema/frontend/src/components/Navbar.jsx)**:
    - Cập nhật logic điều hướng: Tất cả hành động tìm kiếm/lọc đều chuyển hướng sang `/search`.
    - Duy trì state `searchInput` đồng bộ với URL.

### 4. Frontend - Search Results Page (NEW)
- **[NEW] [Search.jsx](file:///d:/Movie-Cinema/frontend/src/pages/Search.jsx)**:
    - Sử dụng `useSearchParams` để lấy query.
    - Fetch danh sách phim dựa trên URL.
    - **Logic Tiêu đề động**:
        - Nếu có `search`: "Đã tìm thấy [số lượng] kết quả cho '[từ khóa]'"
        - Nếu có `genre_id` (và không có search): "Phim cho thể loại [tên thể loại]"
        - Nếu kết hợp: Hiển thị tiêu đề kết hợp (Vd: "Thể loại [A] phù hợp với từ khóa '[B]'")
        - Cần load danh sách `genres` để map `genre_id` -> `name` của thể loại.

### 5. Frontend - Home Page
- **[MODIFY] [Home.jsx](file:///d:/Movie-Cinema/frontend/src/pages/Home.jsx)**:
    - Xóa các logic liên quan đến URL search params.
    - Chỉ hiển thị danh sách phim mặc định (Vd: Phim mới nhất/Phim đang chiếu).

## Verification Plan
1. **Tìm kiếm văn bản**: Nhập "Panda" -> Chuyển sang `/search?search=Panda` -> Tiêu đề: "Đã tìm thấy 1 kết quả cho 'Panda'".
2. **Lọc danh mục**: Chọn "Hành động" -> Chuyển sang `/search?genre_id=1` -> Tiêu đề: "Phim cho thể loại Hành động".
3. **Kết hợp**: Chọn "Hành động" + Nhập "Panda" -> `/search?search=Panda&genre_id=1` -> Tiêu đề thông minh.
4. **Trang chủ**: Truy cập trang chủ không được bị ảnh hưởng bởi các bộ lọc cũ.

## Next Steps
- Chạy `/create` sau khi xác nhận bản kế hoạch này.

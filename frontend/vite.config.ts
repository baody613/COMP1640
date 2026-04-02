// sua cấu hình  vite để nghe tất cả cổng, cấu hình này sẽ giúp tui có thể truy cập bằng địa chỉ ip của dt,máy tính( phải cùng mạng)
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});

// vite.config.ts
import path from "path";
import react from "file:///D:/D%E1%BB%B1%20%C3%81n/indecovietnam/indeco-admin/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///D:/D%E1%BB%B1%20%C3%81n/indecovietnam/indeco-admin/node_modules/vite/dist/node/index.js";
import { createSvgIconsPlugin } from "file:///D:/D%E1%BB%B1%20%C3%81n/indecovietnam/indeco-admin/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import tsconfigPaths from "file:///D:/D%E1%BB%B1%20%C3%81n/indecovietnam/indeco-admin/node_modules/vite-tsconfig-paths/dist/index.mjs";
import dotenv from "file:///D:/D%E1%BB%B1%20%C3%81n/indecovietnam/indeco-admin/node_modules/dotenv/lib/main.js";
dotenv.config();
var vite_config_default = defineConfig({
  base: "./",
  esbuild: {
    // drop: ['console', 'debugger'],
  },
  css: {
    // 开css sourcemap方便找css
    devSourcemap: true
  },
  plugins: [
    react(),
    // 同步tsconfig.json的path设置alias
    tsconfigPaths(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
      // 指定symbolId格式
      symbolId: "icon-[dir]-[name]"
    })
  ],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  server: {
    // 自动打开浏览器
    open: true,
    host: true,
    port: 3001,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        // target: 'https://indecovietnam-backend.onrender.com',
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/api/, "/api")
      }
    }
  },
  build: {
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        // 生产环境移除console
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxEXHUxRUYxIFx1MDBDMW5cXFxcaW5kZWNvdmlldG5hbVxcXFxpbmRlY28tYWRtaW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXERcdTFFRjEgXHUwMEMxblxcXFxpbmRlY292aWV0bmFtXFxcXGluZGVjby1hZG1pblxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovRCVFMSVCQiVCMSUyMCVDMyU4MW4vaW5kZWNvdmlldG5hbS9pbmRlY28tYWRtaW4vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuXHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgeyBjcmVhdGVTdmdJY29uc1BsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLXN2Zy1pY29ucyc7XHJcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnO1xyXG5pbXBvcnQgZG90ZW52IGZyb20gJ2RvdGVudic7XHJcbmRvdGVudi5jb25maWcoKTtcclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBiYXNlOiAnLi8nLFxyXG4gIGVzYnVpbGQ6IHtcclxuICAgIC8vIGRyb3A6IFsnY29uc29sZScsICdkZWJ1Z2dlciddLFxyXG4gIH0sXHJcbiAgY3NzOiB7XHJcbiAgICAvLyBcdTVGMDBjc3Mgc291cmNlbWFwXHU2NUI5XHU0RkJGXHU2MjdFY3NzXHJcbiAgICBkZXZTb3VyY2VtYXA6IHRydWUsXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgLy8gXHU1NDBDXHU2QjY1dHNjb25maWcuanNvblx1NzY4NHBhdGhcdThCQkVcdTdGNkVhbGlhc1xyXG4gICAgdHNjb25maWdQYXRocygpLFxyXG4gICAgY3JlYXRlU3ZnSWNvbnNQbHVnaW4oe1xyXG4gICAgICAvLyBcdTYzMDdcdTVCOUFcdTk3MDBcdTg5ODFcdTdGMTNcdTVCNThcdTc2ODRcdTU2RkVcdTY4MDdcdTY1ODdcdTRFRjZcdTU5MzlcclxuICAgICAgaWNvbkRpcnM6IFtwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJ3NyYy9hc3NldHMvaWNvbnMnKV0sXHJcbiAgICAgIC8vIFx1NjMwN1x1NUI5QXN5bWJvbElkXHU2ODNDXHU1RjBGXHJcbiAgICAgIHN5bWJvbElkOiAnaWNvbi1bZGlyXS1bbmFtZV0nLFxyXG4gICAgfSksXHJcbiAgXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBleHRlbnNpb25zOiBbXCIuanNcIiwgXCIuanN4XCIsIFwiLnRzXCIsIFwiLnRzeFwiXSxcclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgLy8gXHU4MUVBXHU1MkE4XHU2MjUzXHU1RjAwXHU2RDRGXHU4OUM4XHU1NjY4XHJcbiAgICBvcGVuOiB0cnVlLFxyXG4gICAgaG9zdDogdHJ1ZSxcclxuICAgIHBvcnQ6IDMwMDEsXHJcbiAgICBwcm94eToge1xyXG4gICAgICAnL2FwaSc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjUwMDAnLFxyXG4gICAgICAgIC8vIHRhcmdldDogJ2h0dHBzOi8vaW5kZWNvdmlldG5hbS1iYWNrZW5kLm9ucmVuZGVyLmNvbScsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnL2FwaScpXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIHRhcmdldDogJ2VzbmV4dCcsXHJcbiAgICBtaW5pZnk6ICd0ZXJzZXInLFxyXG4gICAgdGVyc2VyT3B0aW9uczoge1xyXG4gICAgICBjb21wcmVzczoge1xyXG4gICAgICAgIC8vIFx1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1NzlGQlx1OTY2NGNvbnNvbGVcclxuICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsXHJcbiAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBa1QsT0FBTyxVQUFVO0FBRW5VLE9BQU8sV0FBVztBQUNsQixTQUFTLG9CQUFvQjtBQUM3QixTQUFTLDRCQUE0QjtBQUNyQyxPQUFPLG1CQUFtQjtBQUMxQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxPQUFPO0FBRWQsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTTtBQUFBLEVBQ04sU0FBUztBQUFBO0FBQUEsRUFFVDtBQUFBLEVBQ0EsS0FBSztBQUFBO0FBQUEsSUFFSCxjQUFjO0FBQUEsRUFDaEI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQTtBQUFBLElBRU4sY0FBYztBQUFBLElBQ2QscUJBQXFCO0FBQUE7QUFBQSxNQUVuQixVQUFVLENBQUMsS0FBSyxRQUFRLFFBQVEsSUFBSSxHQUFHLGtCQUFrQixDQUFDO0FBQUE7QUFBQSxNQUUxRCxVQUFVO0FBQUEsSUFDWixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsWUFBWSxDQUFDLE9BQU8sUUFBUSxPQUFPLE1BQU07QUFBQSxFQUMzQztBQUFBLEVBQ0EsUUFBUTtBQUFBO0FBQUEsSUFFTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUE7QUFBQSxRQUVSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQ0EsVUFBU0EsTUFBSyxRQUFRLFVBQVUsTUFBTTtBQUFBLE1BQ2xEO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQTtBQUFBLFFBRVIsY0FBYztBQUFBLFFBQ2QsZUFBZTtBQUFBLE1BQ2pCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFFRixDQUFDOyIsCiAgIm5hbWVzIjogWyJwYXRoIl0KfQo=

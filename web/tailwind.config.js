/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // 确保扫描 src 目录下所有可能包含 Tailwind 类的文件
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
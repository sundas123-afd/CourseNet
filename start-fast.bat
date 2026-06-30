@echo off
echo Starting Next.js with optimized settings...
set NODE_OPTIONS=--max-old-space-size=4096
set NEXT_TELEMETRY_DISABLED=1
npm run dev

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/api/webhook(.*)', 
  '/api/uploadthing(.*)', 
  '/api/generate(.*)', 
  '/api/category(.*)', 
  '/api/categories(.*)', 
  '/api/courses(.*)', 
  '/api/test(.*)',
  '/teacher/create(.*)', 
  '/api/user(.*)', 
  '/api/sync-users(.*)', 
  '/api/create-test-users(.*)'
]);

export default clerkMiddleware((auth, request) => {
  if(!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
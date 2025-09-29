import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/signin",
  "/signup",
  "/",
  "/home"
])

const isPublicApiRoute = createRouteMatcher([
  "/api/video"
])



export default clerkMiddleware(async(auth,req)=>{
  const {userId} = await auth();
  const currentUrl = new URL(req.url)
  const isAccessingDashboard=currentUrl.pathname ==="/home"
  const isApiRequest = currentUrl.pathname.startsWith("/api")

  //if user is logged in and has not accessed the dashboard but is in actually one of the public routes - for example i dont want a logged in user to be rerouted to another login page 
  if(userId && isPublicRoute(req) && !isAccessingDashboard){
    return NextResponse.redirect(new URL("/home",req.url))
  }

  if(!userId){
    //user is not loggedin and is trying to access one of the protected routes

    if(!isPublicRoute(req) && !isPublicApiRoute(req))
    {
       return NextResponse.redirect(new URL("/signin", req.url));
    }

    //if the request is for a protected API and the user is not logged in 
    if(isApiRequest && !isPublicApiRoute(req)){
       return NextResponse.redirect(new URL("/signin", req.url));
       //user not logged in , has sent a api request 
    }
  }
  return NextResponse.next();//important line --> passing onto next part of the code flow/middleware

});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

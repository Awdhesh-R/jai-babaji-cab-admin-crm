import { jwtDecode } from 'jwt-decode';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path.startsWith('/auth/signin');

  // Backend uses 'adminAuthToken' cookie name for secure cookie authentication
  const token = request.cookies.get('adminAuthToken')?.value;

  const preventedRoute = [{
    path: "/clusterCity/addCluster",
    allowedId: [1, 3, 36]
  }];

  function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; 
    return decoded.exp < currentTime;
  } catch (e) {
    // If token can't be decoded, assume it's valid (might be encrypted or different format)
    // Backend will handle validation via secure cookies
    return false; 
  }
}

  const route = preventedRoute.find(r => path.startsWith(r.path));

// Only redirect if token exists AND can be decoded AND is expired
if (token && isTokenExpired(token)) {
  const response = NextResponse.redirect(
    new URL('/auth/signin', request.nextUrl)
  );

  
  response.cookies.delete('adminAuthToken');

  return response;
}


  if (route) {
    let userId;

    if (token) {
      // try plain JSON token first
      try {
        const parsed = JSON.parse(token);
        userId = parsed.id ?? parsed.userId;
      } catch (e) {
        // try JWT decode (base64url)
        try {
          const parts = token.split('.');
          if (parts.length >= 2) {
            const obj = jwtDecode(token);
            userId = obj.user_id;
          }
        } catch (e) {
          userId = undefined;
        }
      }
    }

    if (!userId || !route.allowedId.includes(Number(userId))) {
      return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
    }
  }

  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth/signin', request.nextUrl));
  }

  // If token exists and none of the above conditions matched, allow the request to proceed
  return NextResponse.next();
}
 
export const config = {
  matcher: [
     '/((?!_next/static|_next/image|api|favicon.ico|.*\\.(?:css|js|png|jpg|jpeg|gif|webp|svg)).*)',
 ],
}
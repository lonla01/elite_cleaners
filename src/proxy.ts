import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Locale detection and redirects for the public site (/ → /en). The admin (/admin) and API
// routes are excluded here. From milestone 6, admin access is enforced in the admin layout and in
// every server action, not only here.
export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};

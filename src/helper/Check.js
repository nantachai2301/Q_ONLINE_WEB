export function checkActive(location, pathname) {
  if (pathname !== '/') {
    if (location.pathname.includes(pathname)) {
      return true;
    }
    return false;
  }
  return false;
}

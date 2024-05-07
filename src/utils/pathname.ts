export const getLastPathSegment = (pathname: string) => {
  const pathSegments = pathname.split("/");
  return pathSegments[pathSegments.length - 1];
};

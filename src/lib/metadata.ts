export function getPageMetadata({ title, description }: { title: string; description?: string }) {
  const siteTitle = process.env.SITE_TITLE ?? "TODO Dashboard";
  return {
    title: `${title} - ${siteTitle}`,
    description: description ?? "",
  };
}

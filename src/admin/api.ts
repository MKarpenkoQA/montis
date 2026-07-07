import type { SiteContent } from "../content/types";
import {
  checkAuth,
  fetchSiteContent,
  login,
  logout,
  saveSiteContent,
  uploadFile,
} from "../lib/siteContentApi";

export { checkAuth, login, logout, uploadFile };

export const fetchContent = fetchSiteContent;
export const saveContent = saveSiteContent;

export type { SiteContent };

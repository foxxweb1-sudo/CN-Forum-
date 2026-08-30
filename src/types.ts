export interface ReplyItem {
  userType?: 'user' | 'admin';
  userName?: string;
  adminName?: string;
  uid?: string;
  text: string;
  replyTo?: string | null;
  createdAt: string;
  avatar?: string;
}

export interface ForumPost {
  id: string;
  name: string;
  uid?: string;
  avatar?: string;
  message: string;
  tags?: string[];
  codeSnippet?: {
    code: string;
    language: string;
  };
  createdAt: any; // Firebase Timestamp | Date | string
  replies?: ReplyItem[];
  likes?: number;
  likedBy?: string[];
  isPinned?: boolean;
}

export const CYBENODE_LOGO_URL = "https://blogger.googleusercontent.com/img/a/AVvXsEiJaOlEw_pmmcLSEgHEvlbypc6z2lftqGtMpNWdKc1sK92j-z7FycxSHyT5x6AyLvtipW3aDjsV4McFb16-jJo1W-ZUBjZzkZHgWVAHJux-AESVfBszSMnRfaGxBB0OcexsZc5o5YA_931pVBnZ-iopGtP0vGTvk6gZPGbZOYElC80ZQrXUrDo7m-2Pgm9r=s150";

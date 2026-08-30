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

export const CYBENODE_LOGO_URL = "https://blogger.googleusercontent.com/img/a/AVvXsEho-rNTqe4wDlAEUG77w2rWjSSDzRyfD0S7xwUJYGT-NIrKSia2ZQ5deLtnBWehHCrdkLedruQkatUp0lOjqknGWbKrp_OqFqnAWkaZ8NLH-cRlSu-hIvvtmjb4iZtJaZwkWFOtLfrZbwY49JdlayLbxCTPEDn76rRJlakQRtpXSHXuBAfHuukqZsiOm7Us";

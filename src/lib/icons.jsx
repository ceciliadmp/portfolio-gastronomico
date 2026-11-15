const S = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props} />
)
export const Icon = {
  mail: (p) => <S {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></S>,
  whatsapp: (p) => <S {...p}><path d="M3.5 20.5 5 16.3A8.5 8.5 0 1 1 8 19.2Z" /><path d="M9 8.5c0 3.3 3 6.5 6.5 6.5l1-1.5-2-1-1 .8c-1.1-.5-2-1.4-2.6-2.5l.8-1-1-2Z" /></S>,
  instagram: (p) => <S {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" /></S>,
  facebook: (p) => <S {...p}><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z" /></S>,
  tiktok: (p) => <S {...p}><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" /><path d="M14 3c.5 2.8 2.3 4.5 5 4.8" /></S>,
  youtube: (p) => <S {...p}><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="m10 9.5 4.5 2.5L10 14.5Z" /></S>,
  linkedin: (p) => <S {...p}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10.5V16M8 7.5v.01M12 16v-3.2c0-1.4 1-2.3 2.2-2.3s2 .9 2 2.3V16M12 10.5V16" /></S>,
  globe: (p) => <S {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" /></S>,
  close: (p) => <S {...p}><path d="M6 6l12 12M18 6 6 18" /></S>,
  left: (p) => <S {...p}><path d="m15 5-7 7 7 7" /></S>,
  right: (p) => <S {...p}><path d="m9 5 7 7-7 7" /></S>,
  menu: (p) => <S {...p}><path d="M4 8h16M4 16h16" /></S>,
  upload: (p) => <S {...p}><path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></S>,
  trash: (p) => <S {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></S>,
  grip: (p) => <S {...p}><circle cx="9" cy="6" r=".8" fill="currentColor" /><circle cx="15" cy="6" r=".8" fill="currentColor" /><circle cx="9" cy="12" r=".8" fill="currentColor" /><circle cx="15" cy="12" r=".8" fill="currentColor" /><circle cx="9" cy="18" r=".8" fill="currentColor" /><circle cx="15" cy="18" r=".8" fill="currentColor" /></S>,
  up: (p) => <S {...p}><path d="m6 15 6-6 6 6" /></S>,
  down: (p) => <S {...p}><path d="m6 9 6 6 6-6" /></S>,
  external: (p) => <S {...p}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></S>,
  photo: (p) => <S {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 9" /></S>,
  tag: (p) => <S {...p}><path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9Z" /><circle cx="8" cy="8" r="1.3" /></S>,
  user: (p) => <S {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6" /></S>,
  type: (p) => <S {...p}><path d="M5 6V4h14v2M12 4v16M9 20h6" /></S>,
  phone: (p) => <S {...p}><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z" /></S>,
  logout: (p) => <S {...p}><path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H4" /></S>,
}

export const socialList = [
  { key: 'instagram', label: 'Instagram', icon: Icon.instagram },
  { key: 'facebook', label: 'Facebook', icon: Icon.facebook },
  { key: 'tiktok', label: 'TikTok', icon: Icon.tiktok },
  { key: 'youtube', label: 'YouTube', icon: Icon.youtube },
  { key: 'linkedin', label: 'LinkedIn', icon: Icon.linkedin },
  { key: 'website', label: 'Site', icon: Icon.globe },
]

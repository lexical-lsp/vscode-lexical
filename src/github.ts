/* eslint-disable @typescript-eslint/naming-convention */

export interface Release {
  url: string
  html_url: string
  assets_url: string
  upload_url: string
  tarball_url: string | null
  zipball_url: string | null
  id: number
  node_id: string
  tag_name: string
  target_commitish: string
  name: string | null
  body?: string | null
  draft: boolean
  prerelease: boolean
  created_at: string
  published_at: string | null
  author: SimpleUser
  assets: ReleaseAsset[]
  body_html?: string
  body_text?: string
  mentions_count?: number
  discussion_url?: string
  reactions?: ReactionRollup
  [k: string]: unknown
}

export interface SimpleUser {
  name?: string | null
  email?: string | null
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string | null
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  starred_at?: string
  [k: string]: unknown
}

export interface ReleaseAsset {
  url: string
  browser_download_url: string
  id: number
  node_id: string
  name: string
  label: string | null
  state: "uploaded" | "open"
  content_type: string
  size: number
  download_count: number
  created_at: string
  updated_at: string
  uploader: null | SimpleUser
  [k: string]: unknown
}

export interface ReactionRollup {
  url: string
  total_count: number
  "+1": number
  "-1": number
  laugh: number
  confused: number
  heart: number
  hooray: number
  eyes: number
  rocket: number
  [k: string]: unknown
}

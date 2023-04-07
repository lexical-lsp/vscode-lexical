import { workspace } from "vscode";

export function getReleasePathOverride(): string | undefined {
  return workspace.getConfiguration('lexical.server').get('releasePathOverride');
}

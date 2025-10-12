/**
 * Centralized color configuration for node types
 * Used for both tooltip headers and graph node dots
 */

export type NodeType = "person" | "cred" | "experience" | "company" | "project" | "music" | "skill" | "role";

export const NODE_TYPE_COLORS: Record<NodeType | "default", string> = {
  // Projects & Companies = Brown
  project: "var(--accent-brown)",
  company: "var(--accent-brown)",
  
  // Music = Purple
  music: "var(--accent-purple)",
  
  // Skills = Green
  skill: "var(--accent-green)",
  
  // Experience/Roles/Credentials = Blue
  role: "var(--accent)",
  experience: "var(--accent)",
  cred: "var(--accent)",
  
  // Person = Blue (default)
  person: "var(--accent)",
  default: "var(--accent)",
};

/**
 * Get the CSS color variable for a given node type
 */
export function getNodeTypeColor(type: string): string {
  return NODE_TYPE_COLORS[type as NodeType] || NODE_TYPE_COLORS.default;
}


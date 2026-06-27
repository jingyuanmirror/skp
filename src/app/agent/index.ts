import type { AgentResponse, SkillContext } from "./types";
import { skills } from "../skills";

export function route(ctx: SkillContext): AgentResponse | null {
  for (const skill of skills) {
    if (skill.match(ctx)) {
      return skill.handle(ctx);
    }
  }
  return null;
}

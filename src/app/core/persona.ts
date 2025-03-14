export default class Persona {
  name?: string;
  background?: string;

  constructor(name?: string, background?: string) {
    this.name = name;
    this.background = background;
  }

  context(): string {
    const context_parts: string[] = [];
    this.name && context_parts.push(`User is ${this.name}.`);
    this.background && context_parts.push(`User's background:\n'''${this.background}'''`);
    return context_parts.join('\n\n');
  }
}

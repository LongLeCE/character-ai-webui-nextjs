export default class Character {
  name?: string;
  tagline?: string;
  selfDescription?: string;
  greeting?: string;
  definition?: string;

  constructor(
    name?: string,
    tagline?: string,
    selfDescription?: string,
    greeting?: string,
    definition?: string
  ) {
    this.name = name;
    this.tagline = tagline;
    this.selfDescription = selfDescription;
    this.greeting = greeting;
    this.definition = definition;
  }

  context(): string {
    const context_parts = [`You are ${this.name ? `now ${this.name}` : 'an AI assistant'}.`];
    this.definition &&
      context_parts.push(`What defines ${this.name || 'you'}:\n'''${this.definition}'''`);
    this.selfDescription &&
      context_parts.push(
        `How ${this.name || 'you'} would describe ${this.name ? 'themselves' : 'yourself'}:\n'''${this.selfDescription}'''`
      );
    return context_parts.join('\n\n');
  }
}

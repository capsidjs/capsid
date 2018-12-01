declare module 'genel' {
  export function div(literals: TemplateStringsArray, ...placeholders: string[]): HTMLElement;
}

declare module 'testdouble' {
  export const verify: any;
  export const replace: any;
  export const reset: any;
}

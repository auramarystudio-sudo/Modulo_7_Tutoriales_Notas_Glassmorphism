// Declaración de tipos para módulos JavaScript/JSX
declare module '*.jsx' {
  import { FC } from 'react';
  const Component: FC<any>;
  export default Component;
}

declare module '*.js' {
  const content: any;
  export default content;
  export const content: any;
}

declare module 'react-markdown' {
  import { ComponentType } from 'react';
  interface ReactMarkdownProps {
    children?: string;
    remarkPlugins?: any[];
    rehypePlugins?: any[];
    components?: Record<string, ComponentType<any>>;
    className?: string;
  }
  const ReactMarkdown: ComponentType<ReactMarkdownProps>;
  export default ReactMarkdown;
}

declare module 'remark-gfm' {
  const remarkGfm: any;
  export default remarkGfm;
}

declare module 'pocketbase' {
  class PocketBase {
    constructor(url: string);
    collection(name: string): any;
    health: { check(): Promise<any> };
    authStore: { model: any; isValid: boolean };
    collection(name: string): {
      getFullList(options?: any): Promise<any[]>;
      getOne(id: string): Promise<any>;
      create(data: any): Promise<any>;
      update(id: string, data: any): Promise<any>;
      delete(id: string): Promise<any>;
    };
  }
  export default PocketBase;
}

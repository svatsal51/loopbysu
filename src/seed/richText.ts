export function paragraph(text: string) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [{ type: 'text', format: 0, style: '', mode: 'normal', text, version: 1 }],
        },
      ],
      direction: 'ltr' as const,
    },
  }
}

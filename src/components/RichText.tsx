import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export function RichText({ data, className = '' }: { data: SerializedEditorState | null | undefined; className?: string }) {
  if (!data) return null
  return (
    <div className={`richtext max-w-none ${className}`}>
      <PayloadRichText data={data} />
    </div>
  )
}

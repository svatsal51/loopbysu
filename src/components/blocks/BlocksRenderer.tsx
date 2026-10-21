import { HeroBlock } from './HeroBlock'
import { TextBlockRenderer } from './TextBlockRenderer'
import { ImageBlockRenderer } from './ImageBlockRenderer'
import { FeatureGridRenderer } from './FeatureGridRenderer'
import { CTABlockRenderer } from './CTABlockRenderer'
import { FAQBlockRenderer } from './FAQBlockRenderer'
import { ProcessStepsRenderer } from './ProcessStepsRenderer'

export type AnyBlock = { blockType: string; id?: string | null; [key: string]: unknown }

export function BlocksRenderer({ blocks }: { blocks: AnyBlock[] | null | undefined }) {
  if (!blocks?.length) return null
  return (
    <>
      {blocks.map((block) => {
        switch (block.blockType) {
          case 'hero':
            return <HeroBlock key={block.id} block={block as any} />
          case 'textBlock':
            return <TextBlockRenderer key={block.id} block={block as any} />
          case 'imageBlock':
            return <ImageBlockRenderer key={block.id} block={block as any} />
          case 'featureGrid':
            return <FeatureGridRenderer key={block.id} block={block as any} />
          case 'cta':
            return <CTABlockRenderer key={block.id} block={block as any} />
          case 'faq':
            return <FAQBlockRenderer key={block.id} block={block as any} />
          case 'processSteps':
            return <ProcessStepsRenderer key={block.id} block={block as any} />
          default:
            return null
        }
      })}
    </>
  )
}

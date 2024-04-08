import YetLightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

import { useImage } from '@/contexts/image'

interface Props {
  onClose(): void
  open: boolean
}

export function Lightbox({ onClose, open }: Props) {
  const { images } = useImage()

  return <YetLightbox open={open} close={onClose} slides={images} />
}

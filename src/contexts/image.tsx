import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react'

interface ImageContextData {
  images: { src: string }[] | []
  setImages(image: Blob | null): void
}

const ImageContext = createContext({} as ImageContextData)

export function ImageProvider({ children }: { children: ReactNode }) {
  const [images, _setImages] = useState<{ src: string }[]>([])

  const handleAddImage = useCallback((image: Blob | null) => {
    if (image) {
      const src = URL.createObjectURL(image)

      _setImages((prev) => (prev.includes({ src }) ? prev : [...prev, { src }]))
    }

    if (!image) _setImages([])
  }, [])

  return (
    <ImageContext.Provider value={{ images, setImages: handleAddImage }}>
      {children}
    </ImageContext.Provider>
  )
}

export const useImage = () => useContext(ImageContext)

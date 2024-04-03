import { Camera, X, XCircle } from '@phosphor-icons/react'
import { ChangeEvent } from 'react'

export interface Image {
  base64: string
  lastModified: number
  name: string
  size: number
  type: string
}

interface Props {
  onSelect(image: ChangeEvent<HTMLInputElement> | null): void
  image: Image | null
}

export function ImagePicker({ image, onSelect }: Props) {
  return (
    <div className="relative">
      <div className="flex sm:flex-wrap items-start sm:items-center sticky top-10 gap-2.5">
        <div className="group relative hover:bg-zinc-200/50 transition-all duration-300 items-center justify-center flex border-dashed h-[300px] sm:h-[500px] w-[300px] sm:w-[500px] bg-zinc-50 dark:bg-zinc-800/50 dark:border-zinc-700/50 rounded-md border border-zinc-200">
          {image ? (
            <>
              <div className="flex flex-col items-center absolute top-0 -right-12 gap-y-1.5">
                <button
                  onClick={() => onSelect(null)}
                  className="flex items-center justify-center h-10 w-10 bg-red-200/50 rounded-md hover:bg-red-300/50"
                >
                  <XCircle size={20} className="text-red-500" />
                </button>
              </div>

              {image.type !== 'image/jpeg' && image.type !== 'image/jpg' ? (
                <div className="flex flex-col items-center">
                  <X className="w-10 h-10 text-red-500" />
                  <p className="text-xs mt-10">
                    Formato não suportado, apenas JPG ou JPEG
                  </p>

                  <button
                    onClick={() => onSelect(null)}
                    className="bg-white h-10 pl-1 pr-10 flex items-center justify-center rounded-full absolute bottom-0 group-hover:visible group-hover:opacity-1 group-hover:-translate-y-10 duration-300 invisible text-xs"
                  >
                    <div className="h-8 w-8 flex items-center justify-center bg-zinc-200 rounded-full mr-2.5">
                      <Camera size={14} weight="bold" />
                    </div>
                    <p>Trocar imagem.</p>
                  </button>
                </div>
              ) : (
                <img
                  src={image.base64}
                  alt=""
                  className="w-[440px] h-[440px] rounded-md"
                />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-xs">Imagem JPG com 400x400</p>

              <div className="bg-white h-10 pl-1 pr-10 flex items-center justify-center rounded-full absolute bottom-0 group-hover:visible group-hover:opacity-1 group-hover:-translate-y-10 duration-300 invisible text-xs">
                <div className="h-8 w-8 flex items-center justify-center bg-zinc-200 rounded-full mr-2.5">
                  <Camera size={14} weight="bold" />
                </div>
                <p>Escolha uma imagem da sua galeria.</p>
              </div>

              <input
                type="file"
                className="absolute inset-0 flex flex-1 opacity-0 cursor-pointer"
                onChange={(e) => onSelect(e)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

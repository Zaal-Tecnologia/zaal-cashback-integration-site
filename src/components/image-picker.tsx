import { Camera, X, XCircle } from 'lucide-react'
import { ChangeEvent } from 'react'
import { red } from 'tailwindcss/colors'

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
        <div className="group relative hover:bg-zinc-200/50 transition-all duration-300 items-center justify-center flex min-w-full border-dashed h-[300px] sm:h-[500px] w-[300px] sm:w-[500px] bg-zinc-50 dark:bg-zinc-700/50 dark:border-zinc-600/50 rounded-md border border-zinc-200">
          {image ? (
            <>
              <button
                onClick={() => onSelect(null)}
                className="hover:bg-zinc-100 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900 h-10 pl-1 pr-7 flex items-center justify-center rounded-full absolute bottom-0 group-hover:visible group-hover:opacity-100 group-hover:-translate-y-10 duration-300 invisible text-xs"
              >
                <div className="h-8 w-8 flex items-center justify-center bg-red-200 dark:bg-red-800 rounded-full mr-2.5">
                  <XCircle size={18} color={red[500]} />
                </div>
                <p>Remover imagem</p>
              </button>

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
                      <Camera size={14} />
                    </div>
                    <p>Trocar imagem.</p>
                  </button>
                </div>
              ) : (
                <img
                  src={image.base64}
                  alt=""
                  className="min-w-[calc(100%_-_20px)] w-[480px] h-[480px]"
                />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-xs">Imagem JPG com 400x400</p>

              <div className="bg-white dark:bg-zinc-900 h-10 pl-1 pr-10 flex items-center justify-center rounded-full absolute bottom-0 group-hover:visible group-hover:opacity-1 group-hover:-translate-y-10 duration-300 invisible text-xs">
                <div className="h-8 w-8 flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 rounded-full mr-2.5">
                  <Camera size={14} />
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

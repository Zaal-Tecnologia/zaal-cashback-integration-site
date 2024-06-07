import { PhotoSVG } from '@/components/svgs/photo-svg'
import { ChangeEvent, useCallback, useContext, useState } from 'react'
import { Base64Form, FormContext } from '../contexts/form'

export function Photo() {
  const { setStep, setForm, form } = useContext(FormContext)

  const content = form as Base64Form | undefined

  const [errors, setErrors] = useState<string[]>([])

  const handleGetPhoto = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event && event.target.files) {
        const file = event.target.files[0]

        if (file) {
          const reader = new FileReader()

          reader.onload = (event) => {
            const image = new Image()

            if (event.target && event.target.result) {
              image.src = String(event.target.result)

              image.onload = () => {
                const width = image.width
                const height = image.height

                const isSmaller = width < 200 && height < 200
                const isBigger = width > 2000 && height > 2000
                // const itHasADifferentHeightAndWidth = width !== height

                if (
                  !(file.type === 'image/jpg' || file.type === 'image/jpeg')
                ) {
                  setErrors((prev) => [...prev, 'Formato inválido!'])

                  return
                }

                if (isSmaller || isBigger) {
                  setErrors((prev) => [...prev, 'Dimensões inválidas!'])

                  return
                }

                setErrors([])

                /** if (itHasADifferentHeightAndWidth) {
                  setErrors((prev) => [...prev, 'Ter lados iguais'])
                } */

                // setPhoto(String(event.target!.result))

                setForm({ imagemBase64: String(event.target!.result) })
              }

              // setPhoto(String(event.target.result))
            }
          }

          reader.readAsDataURL(file)
        }
      }
    },
    [setForm],
  )

  function handleRemovePhoto() {
    setForm({ imagemBase64: '' })

    setErrors([])
  }

  return (
    <>
      <div className="flex items-start mb-5">
        <div className="h-20 w-20 rounded-lg bg-[#305a96]/20 flex items-center justify-center">
          {content?.imagemBase64 ? (
            <img
              src={content.imagemBase64}
              alt=""
              className="h-[72px] w-[72px] rounded-md"
            />
          ) : null}
        </div>

        <div className="flex flex-col ml-5">
          <div className="flex items-center gap-x-5">
            <div className="relative cursor-pointer rounded-lg h-8 bg-zinc-100 hover:bg-zinc-100/50 shadow hover:shadow-none w-[150px] border border-zinc-200 transition-all duration-300 flex items-center gap-2 justify-center">
              <input
                type="file"
                className="opacity-0 absolute inset-0 cursor-pointer"
                onChange={handleGetPhoto}
              />
              <PhotoSVG />
              <p className="text-xs font-medium">Carregar imagem</p>
            </div>

            {content?.imagemBase64 ? (
              <button onClick={handleRemovePhoto}>
                <p className="text-xs font-medium hover:underline hover:text-red-600">
                  Remover
                </p>
              </button>
            ) : null}
          </div>

          <p className="text-xs font-medium mt-5">
            Arquivo .jpg ou .jpeg até 5mb de 400 por 400.
          </p>
        </div>
      </div>

      <footer className="flex items-center justify-between">
        {errors.length > 0 && (
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              color="#b91c1c"
              fill="none"
            >
              <path
                d="M5.32171 9.6829C7.73539 5.41196 8.94222 3.27648 10.5983 2.72678C11.5093 2.42437 12.4907 2.42437 13.4017 2.72678C15.0578 3.27648 16.2646 5.41196 18.6783 9.6829C21.092 13.9538 22.2988 16.0893 21.9368 17.8293C21.7376 18.7866 21.2469 19.6548 20.535 20.3097C19.241 21.5 16.8274 21.5 12 21.5C7.17265 21.5 4.75897 21.5 3.46496 20.3097C2.75308 19.6548 2.26239 18.7866 2.06322 17.8293C1.70119 16.0893 2.90803 13.9538 5.32171 9.6829Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12.2422 17V13C12.2422 12.5286 12.2422 12.2929 12.0957 12.1464C11.9493 12 11.7136 12 11.2422 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.992 8.99997H12.001"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-xs font-medium text-red-700 ml-2.5">
              {errors[0]} - 1 de {errors.length}
            </p>
          </div>
        )}

        <button
          onClick={() => setStep(2)}
          disabled={!content?.imagemBase64 || errors.length > 0}
          className="disabled:opacity-70 disabled:cursor-not-allowed ml-auto rounded-md h-9 bg-[#305a96] w-40 flex items-center gap-2 justify-center hover:ring-4 hover:ring-[#305a96]/20"
        >
          <p className="text-xs font-semibold text-white">Próximo</p>
        </button>
      </footer>
    </>
  )
}

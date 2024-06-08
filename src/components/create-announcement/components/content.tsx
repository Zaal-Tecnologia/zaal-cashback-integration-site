import { z } from 'zod'

import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from '@phosphor-icons/react'
import { useContext } from 'react'

import { FormContext } from '../contexts/form'

const FormSchema = z.object({
  descricao: z.string().max(60, 'deve ter no máximo 60 caracteres.'),
  conteudo: z.string().max(250, 'deve ter no máximo 250 caracteres.'),
  cupom: z.string(),
})

export type ContentFormData = z.input<typeof FormSchema>

export function Content() {
  const { setStep, setForm, form } = useContext(FormContext)

  const { register, formState, watch, handleSubmit } = useForm<ContentFormData>(
    {
      resolver: zodResolver(FormSchema),
      defaultValues: form as ContentFormData,
    },
  )

  function onSubmit(input: ContentFormData) {
    setForm(input)

    setStep(3)
  }

  return (
    <form className="gap-3 grid" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center mb-3 text-zinc-700 dark:text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 256 256"
        >
          <path d="M232,48H24A16,16,0,0,0,8,64V192a16,16,0,0,0,16,16H232a16,16,0,0,0,16-16V64A16,16,0,0,0,232,48Zm0,144H24V64H232V192ZM128,104v48a8,8,0,0,1-16,0V123.31L93.66,141.66a8,8,0,0,1-11.32,0L64,123.31V152a8,8,0,0,1-16,0V104a8,8,0,0,1,13.66-5.66L88,124.69l26.34-26.35A8,8,0,0,1,128,104Zm77.66,18.34a8,8,0,0,1,0,11.32l-24,24a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L168,132.69V104a8,8,0,0,1,16,0v28.69l10.34-10.35A8,8,0,0,1,205.66,122.34Z"></path>
        </svg>

        <span className="text-xs font-medium ml-1.5">
          O conteúdo pode ser escrito em markdown.{' '}
          <a
            href="https://commonmark.org/help/"
            className="underline hover:text-zinc-900 dark:hover:text-zinc-200"
            target="_blank"
            rel="noreferrer"
          >
            Saiba mais.
          </a>
        </span>
      </div>

      <Input.Root>
        <div className="flex items-center justify-between">
          <Input.Label
            required
            errorMessage={formState.errors?.conteudo?.message}
          >
            Conteúdo
          </Input.Label>

          <span className="text-xs font-medium text-zinc-500 -tracking-wider mr-2.5">
            {watch('conteudo')?.length || 0} de 250
          </span>
        </div>

        <Input.Area
          {...register('conteudo')}
          maxLength={250}
          placeholder="Conteúdo do anúncio"
        />
      </Input.Root>

      <div className="grid grid-cols-7 gap-x-3">
        <Input.Root className="col-span-4">
          <Input.Label
            required
            errorMessage={formState.errors?.descricao?.message}
          >
            Descrição
          </Input.Label>

          <Input.Write
            {...register('descricao')}
            maxLength={60}
            placeholder="Qual a descrição do anúncio?"
          />
        </Input.Root>

        <Input.Root className="col-span-3">
          <Input.Label required errorMessage={formState.errors?.cupom?.message}>
            Cupom
          </Input.Label>

          <Input.Write {...register('cupom')} placeholder="Cupom de desconto" />
        </Input.Root>
      </div>

      <footer className="flex items-center justify-between mt-5">
        <button type="button" onClick={() => setStep(1)}>
          <ArrowLeft weight="bold" />
        </button>

        <button
          type="submit"
          className="ml-auto rounded-md h-9 bg-[#305a96] w-40 flex items-center gap-2 justify-center hover:ring-4 hover:ring-[#305a96]/20"
        >
          <p className="text-xs font-semibold text-white">Próximo</p>
        </button>
      </footer>
    </form>
  )
}

import { SignOut } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog'

export function Logout() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('@zaalcashback:token')

    navigate('/')
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="font-medium flex items-center w-full h-8 rounded hover:text-red-900 dark:hover:text-red-200 gap-x-2.5 group hover:bg-red-200/20 dark:hover:bg-red-800/20 px-2.5">
          <SignOut size={16} weight="bold" className="mb-[1.5px]" />
          <span className="text-[13px]">Sair</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Ao confirmar você precisará fazer login novamente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-5">
          <AlertDialogCancel asChild>
            <button className="h-8 px-5 rounded-full border">
              <p className="font-medium text-zinc-900 dark:text-white text-xs">
                Cancelar
              </p>
            </button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <button
              className="h-8 px-5 bg-red-500 rounded-full hover:ring-4 hover:ring-red-500/20"
              onClick={handleLogout}
            >
              <p className="font-medium text-white text-xs">Sair mesmo assim</p>
            </button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

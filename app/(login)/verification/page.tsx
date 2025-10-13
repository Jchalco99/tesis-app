import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const VerificationPage = () => {
  return (
    <div className="px-4 sm:px-10 md:px-20 lg:px-40 flex justify-center items-center flex-1 py-5">
      <div className='w-full max-w-[512px] flex flex-col gap-5'>
          <h2 className='text-white text-[28px] font-bold text-center'>
            Verificación de cuenta
          </h2>
          <p className="text-white text-base font-normal text-center">
            Gracias por registrarte. Hemos enviado un código de verificación a xxxx.xxxx@tecsup.edu.pe. Por favor ingresa el código
            a continuación para verificar tu cuenta.
          </p>
          <div className="flex flex-col gap-5">
            <Input
              placeholder="Código de verificación"
              className='h-13 pl-5'
            />
            <Link href='/'>
              <Button variant='primary' className='w-full h-10 rounded-full'>
                Verificar cuenta
              </Button>
          </Link>
          </div>
        </div>
      </div>
  )
}

export default VerificationPage;

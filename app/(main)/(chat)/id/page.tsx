import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { Send } from 'lucide-react'

const ChatIdPage = () => {
  return (
    <div className='flex min-h-screen gap-4'>
      {/* Chat Area - Left Side */}
      <div className='flex-1 flex flex-col'>
        <h2 className='text-white text-xl sm:text-2xl lg:text-[28px] font-bold px-4 pb-3 pt-5'>
          Bienvenido a TesisAI
        </h2>

        {/* Chat Messages */}
        <div className='flex-1 space-y-4 px-4 overflow-y-auto'>
          <div className='flex items-end gap-3'>
            <div
              className='bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 sm:w-10 flex-shrink-0'
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAslSrExRAzL0hUUzsPH7MawQMsxNP0TlLrKL3xGZwN7cTBP6Lo_Qi3MczViwFHYPc9guuZ1XT9Km9EqoksMsRXIcnKsRuR0SD0q441IDylApvpf1co9uRnMT-Q9cQFS663ruJswoJlYG8dkm_KL5FVGOi7PY3iRNFbDN-6ixrEyQG1LLnfh9Mk2eCN_iWrjUrmXdzxj1B8sw1QZrIWb2wAiLVEK27tZbm-NoctU6EHGQpEIRNbXCZcGMT7QX-6zHDoQj8ZLDZbRWU")',
              }}
            ></div>
            <div className='flex flex-1 flex-col gap-1'>
              <p className='text-slate-400 text-xs sm:text-sm'>TesisAI</p>
              <p className='text-sm sm:text-base max-w-full sm:max-w-[360px] rounded-lg px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 text-white'>
                Hola, soy TesisAI. Puedo ayudarte a encontrar tesis y pretesis
                académicas. ¿Qué te gustaría buscar?
              </p>
            </div>
          </div>

          <div className='flex flex-wrap gap-2 sm:gap-3'>
            <button className='px-3 sm:px-4 py-2 bg-slate-700 text-white text-xs sm:text-sm font-medium rounded-lg'>
              Buscar por tema
            </button>
            <button className='px-3 sm:px-4 py-2 bg-slate-700 text-white text-xs sm:text-sm font-medium rounded-lg'>
              Buscar por autor
            </button>
            <button className='px-3 sm:px-4 py-2 bg-slate-700 text-white text-xs sm:text-sm font-medium rounded-lg'>
              Ver más recientes
            </button>
          </div>

          <div className='flex items-end gap-3 justify-end'>
            <div className='flex flex-1 flex-col gap-1 items-end'>
              <p className='text-slate-400 text-xs sm:text-sm'>Usuario</p>
              <p className='text-sm sm:text-base max-w-full sm:max-w-[360px] rounded-lg px-3 sm:px-4 py-2 sm:py-3 bg-blue-500 text-white'>
                Buscar tesis sobre inteligencia artificial en la educación
                superior.
              </p>
            </div>
            <div
              className='bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 sm:w-10 flex-shrink-0'
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAQawndfYx92ha-EV2fSF7WFfl-QXgKijpm7mSRAIEq-yRm8EZiBb8zGPyvK6Xhi0riI_gkTKbersWh4KdMA4nJArloG2sqPiyW58pFj0KmriY30lL5GXXNheblwxVM04Ja5Y2QfnqNr3z9kWCwYFomfhcy3j9756PRTZkI_LMcoxd3v6lOF64za9iVqHLakTf-Xj1kv3YsM6_pl9ZExvjAh4pz7p-dM2FULTzpXtm3WkBiFqyFG1FkJPraeLTyd-3w8fj41EeMDg4")',
              }}
            ></div>
          </div>

          <div className='flex items-end gap-3'>
            <div
              className='bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 sm:w-10 flex-shrink-0'
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDQCFTwDDmApSt4OYcfxX2898Kw_BmiseJSLpQ6XuRQZOCaltB2VHoHPmEoiWxPguz0TqMJ9CqSrLs3Qma5ffwzdhLhSmezDY8yhVrxqrxoiFGpUkzGolvSc-6eBNuO2Y9CcZxh9AxwwmcQ0j4GkpNlyBXy2OlGHXru8Bnx1Sy3WSKyeDc-0iVr3h_mefNyyejOfeH0qcxk76l1lssRam8mJqgBP-tk6RcnEpyqghzsxnx8miP8niZHAawo07HfdrdvMko-UzWD_Gs")',
              }}
            ></div>
            <div className='flex flex-1 flex-col gap-1'>
              <p className='text-slate-400 text-xs sm:text-sm'>TesisAI</p>
              <p className='text-sm sm:text-base max-w-full sm:max-w-[360px] rounded-lg px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 text-white'>
                Aquí tienes algunas tesis relacionadas con inteligencia
                artificial en la educación superior:
              </p>
            </div>
          </div>
        </div>

        {/* Chat Input - Bottom of Chat Area */}
        <div className='px-4 pb-4 pt-2'>
          <div className='w-full max-w-[600px] mx-auto'>
            <form className='flex items-center gap-2 px-3 py-2 rounded-full bg-slate-700'>
              <InputGroup className='pl-4 rounded-full [&:has([data-slot=input-group-control]:focus-visible)]:border-transparent [&:has([data-slot=input-group-control]:focus-visible)]:ring-0'>
                <InputGroupTextarea
                  placeholder='Escribe tu mensaje'
                  className='min-h-[2.25rem] max-h-[7.5rem] py-2 resize-none overflow-y-auto focus-visible:ring-0 focus-visible:border-transparent
                    scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-500
                    hover:scrollbar-thumb-slate-400 scrollbar-thumb-rounded-full
                    [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent
                    [&::-webkit-scrollbar-thumb]:bg-slate-500 [&::-webkit-scrollbar-thumb]:rounded-full
                    hover:[&::-webkit-scrollbar-thumb]:bg-slate-400'
                  rows={1}
                />
                <InputGroupAddon align='inline-end'>
                  <Button
                    variant='primary'
                    size='sm'
                    className='p-2 rounded-full'
                  >
                    <Send />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </form>
          </div>
        </div>
      </div>

      {/* Results Sidebar - Right Side */}
      <div className='w-80 lg:w-96 border-l border-gray-700 bg-gray-900/30 hidden md:flex flex-col'>
        <div className='p-4 border-b border-gray-700'>
          <h2 className='text-white text-base font-semibold'>
            Tesis relacionadas
          </h2>
        </div>

        <div className='p-4'>
          <div className='bg-gray-800/60 rounded-xl p-4 border border-gray-700/50'>
            <div
              className='aspect-video bg-center bg-cover rounded-lg mb-4'
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA83Ww3OcOaqzGWSxQzAYac1PLWKEw7Oyu4sakrF7jyMWhj-AgpgxnrbHljfdvCmGDH_SkLQzuqYPMABeWTNPoRiYxfxZ2novShbi8bcCNoCamLIoi7w5rdYpQjzD0kOfcU5k5ZZmYTWwEb2N48orhTd_PhxG7OxycRH7q870PLTdh0mIfkhPm-a2xFuKavcCr33vhI2MFUT4_59Gm0Pa_PDHtqNAa6-f_z9NwTOH3G5EabHAzOS5hqzT1p0yIOHsbYJ8nJlD06D80")',
              }}
            ></div>

            <div className='space-y-3'>
              <div>
                <h3 className='text-white text-sm font-medium leading-tight'>
                  Aplicación de IA en el aprendizaje personalizado
                </h3>
                <p className='text-slate-400 text-xs mt-1'>
                  Dr. Carlos Mendoza
                </p>
              </div>

              <button className='w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105'>
                Ver PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatIdPage

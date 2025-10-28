'use client';

interface ThesisResult {
  id: string;
  title: string;
  author: string;
  image: string;
  pdfUrl?: string;
}

interface ResultsSidebarProps {
  results: ThesisResult[];
  isLoading?: boolean;
}

export default function ResultsSidebar({ results, isLoading }: ResultsSidebarProps) {
  // Datos simulados si no hay resultados
  const defaultResults: ThesisResult[] = [
    {
      id: '1',
      title: 'Aplicación de IA en el aprendizaje personalizado',
      author: 'Dr. Carlos Mendoza',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA83Ww3OcOaqzGWSxQzAYac1PLWKEw7Oyu4sakrF7jyMWhj-AgpgxnrbHljfdvCmGDH_SkLQzuqYPMABeWTNPoRiYxfxZ2novShbi8bcCNoCamLIoi7w5rdYpQjzD0kOfcU5k5ZZmYTWwEb2N48orhTd_PhxG7OxycRH7q870PLTdh0mIfkhPm-a2xFuKavcCr33vhI2MFUT4_59Gm0Pa_PDHtqNAa6-f_z9NwTOH3G5EabHAzOS5hqzT1p0yIOHsbYJ8nJlD06D80',
    },
    {
      id: '2',
      title: 'Machine Learning en sistemas educativos',
      author: 'Dra. Ana García',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA83Ww3OcOaqzGWSxQzAYac1PLWKEw7Oyu4sakrF7jyMWhj-AgpgxnrbHljfdvCmGDH_SkLQzuqYPMABeWTNPoRiYxfxZ2novShbi8bcCNoCamLIoi7w5rdYpQjzD0kOfcU5k5ZZmYTWwEb2N48orhTd_PhxG7OxycRH7q870PLTdh0mIfkhPm-a2xFuKavcCr33vhI2MFUT4_59Gm0Pa_PDHtqNAa6-f_z9NwTOH3G5EabHAzOS5hqzT1p0yIOHsbYJ8nJlD06D80',
    }
  ];

  const displayResults = results.length > 0 ? results : defaultResults;

  return (
    <div className='w-80 lg:w-96 border-l border-gray-700 bg-gray-900/30 hidden lg:flex flex-col'>
      <div className='p-4 border-b border-gray-700'>
        <h2 className='text-white text-base font-semibold'>
          Tesis relacionadas
        </h2>
        {isLoading && (
          <p className="text-slate-400 text-sm mt-1">Buscando...</p>
        )}
      </div>

      <div className='p-4 space-y-4 overflow-y-auto'>
        {displayResults.map((result) => (
          <div
            key={result.id}
            className='bg-gray-800/60 rounded-xl p-4 border border-gray-700/50 hover:bg-gray-800/80 transition-colors'
          >
            <div
              className='aspect-video bg-center bg-cover rounded-lg mb-4 bg-gray-700'
              style={{ backgroundImage: `url("${result.image}")` }}
            />

            <div className='space-y-3'>
              <div>
                <h3 className='text-white text-sm font-medium leading-tight line-clamp-2'>
                  {result.title}
                </h3>
                <p className='text-slate-400 text-xs mt-1'>
                  {result.author}
                </p>
              </div>

              <button className='w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105'>
                Ver PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

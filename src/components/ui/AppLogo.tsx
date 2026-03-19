const AppLogo = () => {
  return (
    <div className='flex items-center gap-3 py-4'>
      <div className='flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white text-xl font-semibold'>
        <img
          src='/scissors.svg'
          alt='Logo'
          className='h-5 w-5 object-contain'
        />
        {/* ✂ */}
      </div>
      <div className='flex flex-col'>
        <span className='text-3xl font-semibold tracking-tight'>Belya</span>
        {/* <span className='text-xs text-slate-500'>
              Système de gestion salon
            </span> */}
      </div>
    </div>
  );
};

export default AppLogo;

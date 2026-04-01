import { NavLink } from 'react-router-dom';

const AppLogo = () => {
  return (
    <NavLink to='/'>
      <div className='flex items-center gap-3 py-4'>
        <div className='flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white text-xl font-semibold'>
          <img
            src='/scissors.svg'
            alt='Logo'
            className='h-5 w-5 object-contain'
          />
          {/* ✂ */}
        </div>
        <div className='flex flex-col leading-none'>
          <span className='text-2xl font-bold tracking-tight'>MG</span>
          <span className='mt-0.5 text-[11px] font-semibold tracking-[0.35em]'>
            BEAUTY
          </span>
        </div>
      </div>
    </NavLink>
  );
};

export default AppLogo;

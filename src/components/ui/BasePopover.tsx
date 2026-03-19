import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from '@headlessui/react';
import { Link } from 'lucide-react';
import { Fragment } from 'react';

// const items = [
//   {
//     name: 'Insights',
//     description: 'Measure actions your users take',
//     href: '##',
//     icon: IconOne,
//   },
//   {
//     name: 'Automations',
//     description: 'Create your own targeted content',
//     href: '##',
//     icon: IconTwo,
//   },
//   {
//     name: 'Reports',
//     description: 'Keep track of your growth',
//     href: '##',
//     icon: IconThree,
//   },
// ];
type ItemsData = {
  label: string;
  icon: React.ReactNode;
  path: string;
};

export default function BasePopover({
  buttonChildren,
  items,
}: {
  buttonChildren?: React.ReactNode;
  items: ItemsData[];
}) {
  return (
    <div className='w-full max-w-sm px-4'>
      <Popover className='relative'>
        {({ open }) => (
          <>
            <PopoverButton
              className={`
                ${open ? 'text-white' : 'text-white/90'}
                group inline-flex items-center rounded-md bg-orange-700 px-3 py-2 text-base font-medium hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
            >
              {buttonChildren}
              {/* <span>Solutions</span>
                <ChevronDownIcon
                  className={`${open ? 'text-orange-300' : 'text-orange-300/70'}
                    ml-2 h-5 w-5 transition duration-150 ease-in-out group-hover:text-orange-300/80`}
                  aria-hidden='true'
              /> */}
            </PopoverButton>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-200'
              enterFrom='opacity-0 translate-y-1'
              enterTo='opacity-100 translate-y-0'
              leave='transition ease-in duration-150'
              leaveFrom='opacity-100 translate-y-0'
              leaveTo='opacity-0 translate-y-1'
            >
              <PopoverPanel className='absolute left-1/2 z-50 mt-3 w-screen max-w-xs -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-md'>
                <div className='overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5'>
                  <div className='relative grid gap-8 bg-white p-7 lg:grid-cols-2'>
                    {items.map((item) => (
                      <Link
                        key={item.label}
                        to={item.path}
                        className='-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50'
                      >
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12'>
                          {item.icon}
                        </div>
                        <div className='ml-4'>
                          <p className='text-sm font-medium text-gray-900'>
                            {item.label}
                          </p>
                          {/* <p className='text-sm text-gray-500'>
                            {item.description}
                          </p> */}
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className='bg-gray-50 p-4'>
                    <a
                      href='##'
                      className='flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50'
                    >
                      <span className='flex items-center'>
                        <span className='text-sm font-medium text-gray-900'>
                          Documentation
                        </span>
                      </span>
                      <span className='block text-sm text-gray-500'>
                        Start integrating products and tools
                      </span>
                    </a>
                  </div>
                </div>
              </PopoverPanel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}

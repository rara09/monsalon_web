import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react';
import { Ellipsis } from 'lucide-react';
import { Fragment } from 'react';
type ItemsData = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
};

export default function BaseDropdown({
  btnChildren,
  items,
}: {
  btnChildren: React.ReactNode;
  items: ItemsData[];
}) {
  return (
    <div className='text-right'>
      <Menu as='div' className='relative inline-block text-left'>
        <div>
          <MenuButton className=''>
            {btnChildren || (
              <Ellipsis
                className='h-5 w-5 text-slate-400 cursor-pointer'
                aria-hidden='true'
              />
            )}
            {/* Options
            <ChevronDownIcon
              className='-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100'
              aria-hidden='true'
            /> */}
          </MenuButton>
        </div>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <MenuItems className='absolute right-0 mt-2 w-42 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50'>
            {items.map((item, idx) => (
              <div key={idx} className='px-1 py-1 '>
                <MenuItem>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-rose-500 text-white' : 'text-slate-600'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:text-white`}
                      onClick={item.onClick}
                    >
                      <div className='pr-2 '>{item.icon}</div>
                      <div className=''>{item.label}</div>
                    </button>
                  )}
                </MenuItem>
              </div>
            ))}
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
}

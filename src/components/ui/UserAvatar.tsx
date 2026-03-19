import clsx from 'clsx';

type UserAvatarProps = {
  name?: string | null;
  email?: string | null;
  size?: 'sm' | 'md' | 'lg';
};

function getInitials(name?: string | null, email?: string | null) {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0];
    const last = parts.length > 1 ? parts[parts.length - 1][0] : undefined;
    return (first ?? '') + (last ?? '');
  }

  if (email && email.length > 0) {
    return email[0].toUpperCase();
  }

  return '?';
}

export default function UserAvatar({ name, email, size = 'md' }: UserAvatarProps) {
  const initials = getInitials(name, email).toUpperCase();

  const baseClasses =
    'inline-flex items-center justify-center rounded-full font-semibold bg-rose-100 text-rose-700';

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-11 w-11 text-base',
  }[size];

  return <div className={clsx(baseClasses, sizeClasses)}>{initials}</div>;
}


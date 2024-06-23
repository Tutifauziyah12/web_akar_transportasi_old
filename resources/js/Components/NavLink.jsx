import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', icon: Icon, children, ...props }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center my-2 px-4 py-2 border-b-2 rounded-md w-full font-medium    transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-indigo-200 focus:border-indigo-700 bg-white bg-opacity-10'
                    : 'border-transparent hover:bg-white hover:bg-opacity-10') +
                className
            }
        >
            {Icon && <Icon className="mr-2" />}
            {children}
        </Link>
    );
}

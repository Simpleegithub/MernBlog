/* eslint-disable */
import React from 'react';
import { Button, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon } from 'react-icons/fa';

function Header() {
    const location = useLocation(); // Use useLocation to get the location object

    return (
        <Navbar className='border-b-2 self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
            <Link to='/'>
                <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                    Sahand's
                </span>
                Blog
            </Link>

            <form>
                <TextInput
                    type='text'
                    placeholder='Search'
                    rightIcon={AiOutlineSearch}
                    className='hidden lg:inline'
                />
            </form>

            <Button className='w-12 h-10 lg:hidden' color='gray' pill>
                <AiOutlineSearch />
            </Button>

            <div className='flex gap-2 md:order-2'>
                <Button className='w-12 h-10 hidden sm:inline' color='gray' pill>
                    <FaMoon />
                </Button>

                <Link to='/sign-in'>
                    <Button className='' gradientDuoTone='purpleToBlue'>
                        Sign In
                    </Button>
                </Link>
                <Navbar.Toggle />
            </div>

            <Navbar.Collapse>
                <Navbar.Link active={location.pathname === '/'} as={'div'}>
                    <Link to='/'>Home</Link>
                </Navbar.Link>
                <Navbar.Link active={location.pathname === '/about'} as={'div'}>
                    <Link to='/about'>About</Link>
                </Navbar.Link>
                <Navbar.Link active={location.pathname === '/projects'} as={'div'}>
                    <Link to='/projects'>Projects</Link>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Header;

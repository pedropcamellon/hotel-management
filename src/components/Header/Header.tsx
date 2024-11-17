"use client";

import {FaUserCircle} from "react-icons/fa";
import {MdDarkMode, MdOutlineLightMode} from "react-icons/md";
import {signOut, useSession} from "next-auth/react";
import {useContext} from "react";
import {usePathname, useRouter} from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ThemeContext from "@/context/themeContext";

const Header = () => {
    const {darkTheme, setDarkTheme} = useContext(ThemeContext);

    const {data: session, status} = useSession()

    const router = useRouter();

    const pathname = usePathname();

    return (
        <header
            className="py-10 px-4 container mx-auto text-xl flex flex-wrap md:flex-nowrap items-center justify-between">
            <div className="flex items-center">
                {/* Logo */}

                <Link href="/" className="font-black text-tertiary-dark">
                    Golden Coast
                </Link>

                {/* END - Logo */}
            </div>

            <ul className="flex gap-8 justify-center items-center mt-4">
                <li className="hover:-translate-y-1 duration-500 transition-all">
                    <Link href="/">Home</Link>
                </li>

                <Link href="/booking" className="bg-tertiary-dark hover:bg-tertiary-light text-white px-4 py-2 rounded-md transition-all duration-500 hover:-translate-y-1">
                    Book a Room
                </Link>

                {/* TODO - Add contact page */}
                {/* <li className="hover:-translate-y-2 duration-500 transition-all">
                  <Link href="/">Contact</Link>
                </li> */}
            </ul>

            <ul className="flex gap-8 justify-end items-center mt-4">
                {/* User */}

                {
                    // Validate if user is logged in
                    status === "authenticated" ? (
                        <li className="flex items-center gap-4">
                            {/* Logout */}

                            <button type="button" onClick={() => signOut()}>
                                Logout
                            </button>

                            {/* Profile Image */}

                            <Link href={`/users/${session.user.id}`}>
                                {session.user.image ? (
                                    <div className="w-10 h-10 rounded-full overflow-hidden">
                                        <Image
                                            src={session.user.image}
                                            alt={session.user.name!}
                                            width={40}
                                            height={40}
                                            className="scale-animation img"
                                        />
                                    </div>
                                ) : (
                                    <FaUserCircle className="cursor-pointer"/>
                                )}
                            </Link>
                        </li>
                    ) : (
                        // User is not logged in
                        // Show if not on the register or login page
                        pathname !== "/register" && pathname !== "/login" && (
                            <>
                                <button type="button">
                                    <Link href="/login">Login</Link>
                                </button>

                                <button type="button">
                                    <Link href="/register">Register</Link>
                                </button>
                            </>
                        )
                    )
                }

                {/* END - User */}

                {/* Dark Mode Toggle */}

                <li className="ml-2">
                    {darkTheme ? (
                        <MdOutlineLightMode
                            className="cursor-pointer"
                            onClick={() => {
                                setDarkTheme(false);
                                localStorage.removeItem("hotel-theme");
                            }}
                        />
                    ) : (
                        <MdDarkMode
                            className="cursor-pointer"
                            onClick={() => {
                                setDarkTheme(true);
                                localStorage.setItem("hotel-theme", "true");
                            }}
                        />
                    )}
                </li>

                {/* END - Dark Mode Toggle */}
            </ul>
        </header>
    );
};

export default Header;

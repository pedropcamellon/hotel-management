"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import {ChangeEvent, FormEvent, useEffect, useRef, useState} from "react";
import {FcGoogle} from "react-icons/fc";
import {register} from "@/actions/register";
import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

const defaultFormData = {
    email: "",
    name: "",
    password: "",
};

const Register = () => {
    const [formData, setFormData] = useState(defaultFormData);
    const [error, setError] = useState<string>();
    const ref = useRef<HTMLFormElement>(null);
    const {data: session} = useSession();
    const router = useRouter();

    const inputStyles =
        "border border-gray-300 sm:text-sm text-black rounded-lg block w-full p-2.5 focus:outline-none";

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
    };


    useEffect(() => {
        if (session) router.push("/");
    }, [router, session]);

    const loginHandler = async () => {
        try {
            await signIn();
            router.push("/");
        } catch (error) {
            console.log(error);
            toast.error("Something wen't wrong");
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);

            const res = await register({
                email: formData.get("email"),
                password: formData.get("password"),
                name: formData.get("name")
            });

            if (res?.error) {
                setError(res.error as string);

                return;
            }

            toast.success("Success. Please sign in");

            return router.push("/login");
        } catch (e) {
            console.error(`(components/Register) Error registering user: ${e}`);

            toast.error("Something went wrong");
        } finally {
            setFormData(defaultFormData);
        }
    };

    return (
        <section className="container mx-auto">
            <div className="flex flex-col p-6 space-y-4 md:space-y-6 sm:p-8 w-80 md:w-[70%] mx-auto">
                <div className="flex mb-8 flex-col md:flex-row items-center justify-between">
                    <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
                        Create an account
                    </h1>

                    <p>OR</p>

                    {/* Sign Up with Google */}

                    <span className="inline-flex items-center">
                        <FcGoogle
                            onClick={loginHandler}
                            className="ml-3 text-4xl cursor-pointer"
                        />
                    </span>
                </div>

                {/* Sign Up */}

                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="name@company.com"
                        required
                        className={inputStyles}
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        required
                        className={inputStyles}
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="password"
                        required
                        minLength={6}
                        className={inputStyles}
                        value={formData.password}
                        onChange={handleInputChange}
                    />

                    <button
                        type="submit"
                        className="w-fit mx-auto bg-tertiary-dark focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-white"
                    >
                        Sign Up
                    </button>
                </form>

                <hr className="w-50"/>

                {/* Login */}

                <Link href="/login"
                      className="w-fit mx-auto bg-white border border-primary focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5">
                    Already have an account?
                </Link>
            </div>
        </section>
    );
};

export default Register;

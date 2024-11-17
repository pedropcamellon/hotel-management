"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

const defaultFormData = {
    email: "",
    name: "",
    password: "",
};

const Login = () => {
    const [error, setError] = useState("");
    const router = useRouter();

    const [formData, setFormData] = useState(defaultFormData);
    const {data: session} = useSession();

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

            const res = await signIn("credentials", {
                email: formData.get("email"),
                password: formData.get("password"),
                redirect: false,
            });

            if (res?.error) {
                setError(res.error as string);
            }

            if (res?.ok) {
                toast.success("Logged Successfully!")
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setFormData(defaultFormData);
        }
    };

    return (
        <section className="container mx-auto">
            <div className="flex flex-col p-6 space-y-4 md:space-y-6 sm:p-8 w-80 md:w-[70%] mx-auto">
                <div className="flex flex-col p-6 space-y-4 md:space-y-6 sm:p-8 w-80 md:w-[70%] mx-auto">
                    <form
                        className="space-y-4 md:space-y-6"
                        onSubmit={handleSubmit}>

                        <h1 className="mb-5 w-full text-2xl font-bold">Sign In</h1>

                        {/* Validation Errors */}
                        {
                            error &&
                            <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded relative"
                                 role="alert">
                                <span className="text-sm">{error}</span>
                            </div>
                        }

                        {/* Email Address */}

                        <div className="w-full mb-2">
                            <label className="w-full text-sm">Email</label>

                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full h-8 border border-solid border-black rounded p-2"
                                name="email"/>
                        </div>

                        {/* Password */}

                        <div className="w-full mb-2">
                            <label className="w-full text-sm">Password</label>

                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full h-8 border border-solid border-black rounded p-2"
                                name="password"/>
                        </div>

                        {/* Login */}

                        <button
                            type="submit"
                            className="w-fit mx-auto bg-tertiary-dark focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-white">
                            Sign In
                        </button>

                        <div className="w-full border border-solid border-2 mb-2"></div>

                        {/* Register */}

                        <div className="flex justify-center">
                            <Link
                                href="/register"
                                className="mr-4 bg-white border border-primary focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5">
                                Don&apos;t have an account?
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Login;

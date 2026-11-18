import { Button } from "@/components/ui/button";

import {
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import { auth } from "@clerk/nextjs/server";

import Link from "next/link";

import Image from "next/image";

import { ModeToggle } from "@/components/ui/mode-toggle";
import { Menu } from "lucide-react";

const Navbar = async ({ UserRole }: { UserRole: string }) => {
  const { userId } = await auth();

  return (
    <nav className="fixed left-1/2 top-2 z-50 w-full max-w-5xl -translate-x-1/2 px-2 sm:top-4 sm:px-4">
      <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 transition-all duration-200 hover:bg-white/15 dark:hover:bg-black/15">
        <div className="flex items-center justify-between gap-2 px-3 py-3 sm:px-6 sm:py-4">
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2">
            <Image
              src="/logo.svg"
              alt="TreeBio"
              width={42}
              height={42}
              className="size-8 sm:size-10"
            />
            <span className="truncate text-lg font-bold tracking-wider text-amber-300 sm:text-2xl sm:tracking-widest">
              LeetCode
            </span>
          </Link>

          <div className="hidden items-center justify-center gap-x-4 md:flex">
            <Link
              href="/problems"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-amber-600 cursor-pointer dark:hover:text-amber-400"
            >
              Problems
            </Link>

            <Link
              href="/about"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-amber-600 cursor-pointer dark:hover:text-amber-400"
            >
              About
            </Link>

            <Link
              href="/profile"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-amber-600 cursor-pointer dark:hover:text-amber-400"
            >
              Profile
            </Link>
          </div>

          <div className="hidden items-center gap-2 md:flex lg:gap-4">
            <ModeToggle />

            {userId ? (
              <>
                {UserRole === "ADMIN" && (
                  <Link href="/create-problem">
                    <Button variant="outline" size="sm">
                      Create Problem
                    </Button>
                  </Link>
                )}

                <UserButton />
              </>
            ) : (
              <div className="flex items-center gap-2">

                <SignInButton>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm font-medium hover:bg-white/20 dark:hover:bg-white/10"
                  >
                    Sign In
                  </Button>
                </SignInButton>

                <SignUpButton>
                  <Button
                    size="sm"
                    className="text-sm font-medium bg-amber-400 hover:bg-amber-500 text-white"
                  >
                    Sign Up
                  </Button>
                </SignUpButton>

              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ModeToggle />
            {userId && <UserButton />}
            <details className="relative">
              <summary
                aria-label="Open navigation menu"
                className="flex size-9 cursor-pointer list-none items-center justify-center rounded-lg border border-border [&::-webkit-details-marker]:hidden"
              >
                <Menu className="size-5" />
                <span className="sr-only">Open navigation menu</span>
              </summary>
              <div className="absolute right-0 top-full mt-2 flex w-56 flex-col gap-1 rounded-xl border bg-background p-2 text-foreground shadow-xl">
                <Link
                  href="/problems"
                  className="rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  Problems
                </Link>
                <Link
                  href="/about"
                  className="rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  About
                </Link>
                {userId ? (
                  <>
                    <Link
                      href="/profile"
                      className="rounded-md px-3 py-2 text-sm hover:bg-muted"
                    >
                      Profile
                    </Link>
                    {UserRole === "ADMIN" && (
                      <Link
                        href="/create-problem"
                        className="rounded-md px-3 py-2 text-sm hover:bg-muted"
                      >
                        Create Problem
                      </Link>
                    )}
                  </>
                ) : (
                  <div className="mt-1 flex flex-col gap-1 border-t border-border pt-2">
                    <SignInButton>
                      <Button variant="ghost" className="w-full">
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton>
                      <Button className="w-full bg-amber-400 text-white hover:bg-amber-500">
                        Sign Up
                      </Button>
                    </SignUpButton>
                  </div>
                )}
              </div>
            </details>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
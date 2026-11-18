import { currentUserRole } from '@/modules/auth/actions';
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'
import { UserRole } from '../generated/prisma/enums';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ModeToggle } from '@/components/ui/mode-toggle';
import CreateProblemForm from '@/modules/problems/components/create-problem-form';

const CreateProblemPage = async () => {
  const user = await currentUser();
  const userRole = await currentUserRole();

  if(userRole !== UserRole.ADMIN) {
    return redirect('/unauthorized');
  }

  return (
    <section className='container mx-auto flex w-full flex-col items-center justify-center px-3 py-4 sm:px-4'>
            <div className='mb-4 flex w-full flex-col items-center justify-between gap-3 sm:flex-row'>
                <Link href={"/"}>
                <Button variant={"outline"} size={"icon"}>
                    <ArrowLeft className='size-4' />
                </Button>
                </Link>
    
                 <h1 className='text-center text-2xl font-bold text-amber-400 sm:text-3xl'>Welcome {user?.firstName}! Create a Problem</h1>
            <ModeToggle/>
            </div>
           <CreateProblemForm/>
        </section>
  )
}

export default CreateProblemPage
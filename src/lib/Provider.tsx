"use client";
import { SessionProvider } from 'next-auth/react';
import React, { Children, ReactNode } from 'react'


const Provider = ({children}:{children:ReactNode}) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

export default Provider

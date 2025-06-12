"use client";

import * as React from "react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

function OpenMenuIcon() {
  return (
    <svg
      data-slot="icon"
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M2 6.75C2 6.33579 2.33579 6 2.75 6H17.25C17.6642 6 18 6.33579 18 6.75C18 7.16421 17.6642 7.5 17.25 7.5H2.75C2.33579 7.5 2 7.16421 2 6.75ZM2 13.25C2 12.8358 2.33579 12.5 2.75 12.5H17.25C17.6642 12.5 18 12.8358 18 13.25C18 13.6642 17.6642 14 17.25 14H2.75C2.33579 14 2 13.6642 2 13.25Z" />
    </svg>
  );
}

function CloseMenuIcon() {
  return (
    <svg
      data-slot="icon"
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
}

function MobileSidebar({
  open,
  close,
  children,
}: React.PropsWithChildren<{ open: boolean; close: () => void }>) {
  if (!open) {
    return;
  }

  return (
    <div className="lg:hidden">
      {/* Backdrop */}
      {/* oxlint-disable-next-line click-events-have-key-events */}
      <div
        className="fixed inset-0 bg-black/30 transition-opacity"
        onClick={close}
      />
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-full max-w-80 p-2 transition duration-300 ease-in-out">
        <div className="flex h-full flex-col rounded-lg bg-white shadow-sm ring-1 ring-zinc-950/5">
          <div className="-mb-3 px-4 pt-3">
            <button
              onClick={close}
              className="rounded-md p-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
              aria-label="Close navigation"
            >
              <CloseMenuIcon />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

interface StackedLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  navbar?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

const StackedLayout = ({
  className,
  navbar,
  sidebar,
  children,
  ...props
}: StackedLayoutProps) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div
      className={twMerge(
        "relative isolate flex min-h-svh w-full flex-col bg-white lg:bg-zinc-100",
        className,
      )}
      {...props}
    >
      {/* Sidebar on mobile */}
      <MobileSidebar open={showSidebar} close={() => setShowSidebar(false)}>
        {sidebar}
      </MobileSidebar>

      {/* Navbar */}
      <header className="flex items-center px-4">
        <div className="py-2.5 lg:hidden">
          <button
            onClick={() => setShowSidebar(true)}
            className="rounded-md p-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
            aria-label="Open navigation"
          >
            <OpenMenuIcon />
          </button>
        </div>
        <div className="min-w-0 flex-1">{navbar}</div>
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col pb-2 lg:px-2">
        <div className="grow p-4 lg:rounded-lg lg:bg-white lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5">
          <div>{children}</div>
        </div>
      </main>
    </div>
  );
};

export { StackedLayout };

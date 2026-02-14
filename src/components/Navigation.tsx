"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from '@/assets/images/logo.svg';
import * as React from "react";

type NavItem = { href: string; label: string };

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navigation() {
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const hamburgerRef = React.useRef<HTMLDivElement>(null);

  const items: NavItem[] = [
    {href: "/", label: "Top 20"},
    {href: "/genres", label: "Genres"},
    {href: "/characters", label: "Characters"},
    {href: "/current-season", label: "Current season"},
  ];

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        hamburgerRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex items-center py-3.5 px-8 w-full gap-8">
      <Link href="/" className="h-14 flex items-center text-zinc-400">
        <Logo/>
      </Link>
      <div
        ref={menuRef}
        className={`menu ${isMenuOpen ? 'block' : 'hidden'}`}
      >
        {items.map((item) => {
          const active = isActivePath(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? "menu-link-active"
                  : "menu-link"
              }
              aria-current={active ? "page" : undefined}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
      <div
        ref={hamburgerRef}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="hamburger-menu"
      >
        <div className="w-7 h-0 border-t-3 border-zinc-400"></div>
        <div className="w-7 h-0 border-t-3 border-zinc-400"></div>
        <div className="w-7 h-0 border-t-3 border-zinc-400"></div>
      </div>
    </nav>
  );
}
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export function Sidebar() {
    return (
        <aside className="rounded-tr-5 bg-03 flex max-w-26 flex-col items-center justify-between">
            <img src="/logo.svg" alt="Logo" className="size-26" />
            <div className="flex w-full flex-col items-center gap-6 py-6">
                <ThemeToggle />
                {/*<Separator orientation="vertical" className="h-8 lg:hidden" />*/}
                <Separator orientation="horizontal" className="w-full" />
                <button
                    className="rounded-full ring-offset-[#1e2139] transition hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none lg:mt-2"
                    aria-label="Profile"
                >
                    <Avatar className="size-10">
                        <AvatarImage
                            src="https://i.pravatar.cc/80?img=11"
                            alt="User"
                        />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                </button>
            </div>
        </aside>
    );
}

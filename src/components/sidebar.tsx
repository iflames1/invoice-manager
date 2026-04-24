import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export function Sidebar() {
    return (
        <aside className="sticky top-0 z-30 flex h-16 w-full shrink-0 items-center justify-between bg-03 lg:top-0 lg:h-screen lg:w-26 lg:max-w-26 lg:flex-col lg:rounded-tr-2xl lg:rounded-br-2xl">
            <img src="/logo.svg" alt="Logo" className="size-16 lg:size-26" />
            <div className="flex items-center gap-4 px-4 lg:w-full lg:flex-col lg:gap-6 lg:px-0 lg:py-6">
                <ThemeToggle />
                <Separator
                    orientation="vertical"
                    className="h-16 bg-[#494E6E] lg:hidden"
                />
                <Separator
                    orientation="horizontal"
                    className="hidden w-full bg-[#494E6E] lg:block"
                />
                <button
                    className="rounded-full transition hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                    aria-label="Profile"
                >
                    <Avatar className="size-8 lg:size-10">
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

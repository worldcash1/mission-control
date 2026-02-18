"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CheckSquare, 
  FolderOpen, 
  Lightbulb, 
  TrendingUp, 
  Heart,
  Coins,
  Brain
} from "lucide-react";
import { SearchTrigger } from "./GlobalSearch";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Brain", href: "/brain", icon: Brain },
  { name: "Ideas", href: "/ideas", icon: Lightbulb },
  { name: "Trading", href: "/trading", icon: TrendingUp },
  { name: "Health", href: "/health", icon: Heart },
  { name: "Tokens", href: "/tokens", icon: Coins },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-sidebar border-r border-border p-4 flex flex-col">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Mission Control</h1>
      </div>
      
      <div className="mb-4">
        <SearchTrigger />
      </div>

      <nav className="space-y-1 flex-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-border">
        <span className="text-[10px] text-gray-600">v4.1.3</span>
      </div>
    </div>
  );
}

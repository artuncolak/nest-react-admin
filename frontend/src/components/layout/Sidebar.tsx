import { BookOpen, Users } from "react-feather";
import { Link } from "react-router-dom";
import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  return (
    <div className="fixed h-screen w-72 p-5 shadow">
      <h1 className="font-semibold text-center">Carna Project</h1>
      <nav className="mt-5 flex flex-col gap-3">
        <SidebarItem to="/courses">
          <BookOpen /> Courses
        </SidebarItem>
        <SidebarItem to="/users">
          <Users /> Users
        </SidebarItem>
      </nav>
    </div>
  );
}

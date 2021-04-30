import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div>
      <Sidebar />
      <div className="container ml-72 mx-auto px-10 py-5">{children}</div>
    </div>
  );
}

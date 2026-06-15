import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import PartnerDashboard from "@/components/PartnerDashboard";
import PublicHome from "@/components/PublicHome";
import Image from "next/image"

export default async function Home() {
  const session = await auth();

  console.log("PAGE SESSION:", session?.user?.role);

  return (
    <div className="w-full min-h-screen bg-white">
      <Nav/>

      {session?.user?.role == "partner" ? 
        <PartnerDashboard />
       : session?.user?.role == "admin" ? 
        <AdminDashboard />
       : 
        <PublicHome />
      }
      <Footer/>
    </div>
  );
}

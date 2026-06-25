import Banner from "@/components/Banner";
import ContactUs from "@/components/ContactUs";
import Featured from "@/components/Featured";
import Overview from "@/components/Overview";
import Navbar from "./homepage/navbar";
import Footer from "@/components/Footer";


export default async function Home() {


  return (
    <div>
      <Navbar />
      <Banner />
      <Overview />
      <Featured />
      <ContactUs />
      <Footer/>
    </div>
  );
}

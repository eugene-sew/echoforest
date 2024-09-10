"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/auth/login");
    }, 3000); // Adjust time as needed

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex items-center space-x-4">
        <Image
          src="/leaf.png"
          alt="Echo Forest Logo"
          width={100}
          height={100}
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">EchoForest</h1>
          <p className="text-gray-600">
            Harnessing Technology for Conservation
          </p>
        </div>
      </motion.div>
    </div>
  );
}

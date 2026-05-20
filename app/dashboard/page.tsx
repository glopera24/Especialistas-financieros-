"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DashboardPage() {

  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {

    const getUser = async () => {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserEmail(user.email || "");
      }

    };

    getUser();

  }, []);

  return (

    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-4xl font-bold mb-4">
        Dashboard
      </h1>

      <p className="text-zinc-400">
        Bienvenido:
      </p>

      <p className="text-xl mt-2">
        {userEmail}
      </p>

    </div>

  );
}